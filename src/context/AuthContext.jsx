import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    // Persist login state (optional but good for UX)
    useEffect(() => {
        const savedLogin = localStorage.getItem('isLoggedIn');
        if (savedLogin === 'true') {
            setIsLoggedIn(true);
            setUser({ name: 'مستخدم الفهيم', avatar: 'https://i.pravatar.cc/150?u=faheem' });
        }
    }, []);

    const login = () => {
        setIsLoggedIn(true);
        setUser({ name: 'مستخدم الفهيم', avatar: 'https://i.pravatar.cc/150?u=faheem' });
        localStorage.setItem('isLoggedIn', 'true');
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem('isLoggedIn');
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
