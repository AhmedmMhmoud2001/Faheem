import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { api, setTokens, clearTokens, getAccessToken, resolveMediaUrl } from '../lib/api.js';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4001/api/v1';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(Boolean(getAccessToken()));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshMe = useCallback(async () => {
        const t = getAccessToken();
        if (!t) {
            setUser(null);
            setIsLoggedIn(false);
            return;
        }
        try {
            const { data } = await api.get('/users/me');
            setUser({
                id: data.id,
                name: data.fullName,
                email: data.email,
                avatar: data.avatarUrl
                    ? resolveMediaUrl(data.avatarUrl)
                    : 'https://i.pravatar.cc/150?u=faheem',
                trialEndsAt: data.entitlement?.trialEndsAt,
                entitlement: data.entitlement,
            });
            setIsLoggedIn(true);
        } catch {
            clearTokens();
            setUser(null);
            setIsLoggedIn(false);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const rt = localStorage.getItem('refreshToken');
            const at = getAccessToken();
            if (!at && rt) {
                try {
                    const { data } = await axios.post(`${baseURL}/auth/refresh`, { refreshToken: rt });
                    setTokens(data.accessToken, data.refreshToken || rt);
                } catch {
                    clearTokens();
                }
            }
            if (!cancelled) await refreshMe();
            if (!cancelled) setLoading(false);
        })();
        return () => {
            cancelled = true;
        };
    }, [refreshMe]);

    const loginWithTokens = useCallback(
        async (accessToken, refreshTok) => {
            setTokens(accessToken, refreshTok);
            await refreshMe();
        },
        [refreshMe],
    );

    const logout = async () => {
        const rt = localStorage.getItem('refreshToken');
        try {
            if (rt) await api.post('/auth/logout', { refreshToken: rt });
        } catch {
            /* ignore */
        }
        clearTokens();
        setIsLoggedIn(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, loading, loginWithTokens, logout, refreshMe }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components -- hook paired with provider for DX
export const useAuth = () => useContext(AuthContext);
