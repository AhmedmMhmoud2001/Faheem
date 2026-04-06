import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock } from 'lucide-react';

/**
 * SubscriptionWall
 * Renders a full-page blocker when the user's trial has expired
 * and they have no active subscription.
 *
 * Props:
 *   trialDaysLeft {number|null}  - days remaining (0 = expired, null = no trial data)
 */
const SubscriptionWall = ({ trialDaysLeft }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
            {/* Lock icon */}
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-50 shadow-lg shadow-yellow-100">
                <Lock className="h-9 w-9 text-yellow-500" strokeWidth={2.5} />
            </div>

            {/* Badge – only shown when trial just ran out (daysLeft === 0) */}
            {trialDaysLeft === 0 && (
                <span className="mb-4 inline-block rounded-full bg-orange-100 px-4 py-1 text-sm font-bold text-orange-600">
                    {t('subscriptionWall.daysLeft', { count: 0 })}
                </span>
            )}

            <h2 className="mb-3 text-3xl font-black text-slate-900">
                {t('subscriptionWall.title')}
            </h2>
            <p className="mb-8 max-w-sm text-lg font-bold text-slate-500">
                {t('subscriptionWall.body')}
            </p>

            <button
                onClick={() => navigate('/subscriptions')}
                className="rounded-2xl bg-[#FFD131] px-10 py-3.5 text-xl font-black text-slate-900 shadow-xl shadow-yellow-200/50 transition-all hover:-translate-y-1 hover:bg-slate-900 hover:text-white active:scale-95"
            >
                {t('subscriptionWall.cta')}
            </button>
        </div>
    );
};

export default SubscriptionWall;
