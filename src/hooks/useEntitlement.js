import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Returns the user's current entitlement state.
 *
 * @returns {{
 *   hasAccess: boolean,
 *   trialActive: boolean,
 *   trialDaysLeft: number|null,
 *   subscriptionActive: boolean,
 * }}
 */
export function useEntitlement() {
    const { user } = useAuth();

    return useMemo(() => {
        if (!user) {
            return { hasAccess: false, trialActive: false, trialDaysLeft: null, subscriptionActive: false };
        }

        const now = Date.now();
        const trialEndsAt = user?.entitlement?.trialEndsAt ?? user?.trialEndsAt ?? null;
        const trialActive = Boolean(trialEndsAt && new Date(trialEndsAt) > now);
        const trialDaysLeft = trialEndsAt != null
            ? Math.max(0, Math.ceil((new Date(trialEndsAt) - now) / 86400000))
            : null;
        const subscriptionActive =
            user?.entitlement?.subscriptionStatus === 'ACTIVE' ||
            user?.entitlement?.hasContentAccess === true;

        const hasAccess = trialActive || subscriptionActive;

        return { hasAccess, trialActive, trialDaysLeft, subscriptionActive };
    }, [user]);
}
