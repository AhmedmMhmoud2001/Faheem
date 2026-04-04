import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Container from '../components/Container';
import bg from '../assets/bgpage.png';
import img1 from '../assets/img1.png';
import img2 from '../assets/img2.png';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api.js';

const slugToColor = {
    statistics: 'bg-blue-700',
    algebra: 'bg-slate-400',
    calculus: 'bg-green-700',
    engineering: 'bg-orange-600',
};

const Dashboard = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [progress, setProgress] = useState([]);

    const subjectLabel = useCallback(
        (slug, nameAr) => {
            const key = `subjectLabels.${slug}`;
            const translated = t(key);
            return translated === key ? nameAr : translated;
        },
        [t],
    );

    useEffect(() => {
        if (!user) return;
        api
            .get('/users/me/progress')
            .then((r) => setProgress(r.data.data || []))
            .catch(() => setProgress([]));
    }, [user]);

    const trialEnds = user?.entitlement?.trialEndsAt;
    const [nowMs, setNowMs] = useState(() => Date.now());
    useEffect(() => {
        const id = setInterval(() => setNowMs(Date.now()), 60_000);
        return () => clearInterval(id);
    }, []);
    const trialDaysLeft =
        trialEnds != null
            ? Math.max(0, Math.ceil((new Date(trialEnds) - nowMs) / 86400000))
            : null;

    const subjects = useMemo(() => {
        const notStarted = t('dashboard.notStarted');
        if (progress.length > 0) {
            return progress.map((p) => ({
                name: p.slug,
                label: subjectLabel(p.slug, p.nameAr),
                color: slugToColor[p.slug] || 'bg-slate-500',
                percentage: p.percentSnapshot > 0 ? `${p.percentSnapshot}%` : '',
                status: p.percentSnapshot === 0 ? notStarted : undefined,
            }));
        }
        return [
            { name: 'statistics', label: subjectLabel('statistics', t('subjectLabels.statistics')), color: 'bg-blue-700', percentage: '', status: notStarted },
            { name: 'algebra', label: subjectLabel('algebra', t('subjectLabels.algebra')), color: 'bg-slate-300', percentage: '', status: notStarted },
            {
                name: 'calculus',
                label: subjectLabel('calculus', t('subjectLabels.calculus')),
                color: 'bg-green-700',
                percentage: '',
                status: notStarted,
            },
            { name: 'engineering', label: subjectLabel('engineering', t('subjectLabels.engineering')), color: 'bg-orange-600', percentage: '', status: notStarted },
        ];
    }, [progress, t, subjectLabel]);

    return (
        <div className=" bg-white relative overflow-hidden pb-20" dir={i18n.dir()}>
            <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{
                    backgroundImage: `url(${bg})`,
                    backgroundSize: '400px',
                }}
            />

            <Container className="relative z-10 pt-1">
                <div className="text-start mb-4 mt-6">
                    <h1 className="text-5xl font-black text-slate-900">
                        {t('dashboard.welcome', { name: user?.name || t('dashboard.guest') })}
                    </h1>
                </div>

                {trialDaysLeft != null && trialDaysLeft > 0 && (
                    <div className="bg-[#FBFBFC] rounded-[1.2rem] p-3 md:p-4 mb-3 shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-slate-50 flex flex-col md:flex-row justify-between items-center gap-3 bg-orange-50">
                        <div className="text-start flex-1">
                            <h2 className="text-2xl font-black text-slate-800 mb-2">{t('dashboard.trialTitle')}</h2>
                            <p className="text-slate-400 font-bold text-xl">{t('dashboard.trialDays', { count: trialDaysLeft })}</p>
                        </div>
                        <button
                            onClick={() => navigate('/subscriptions')}
                            className="bg-[#FFD131] hover:bg-slate-900 hover:text-white px-12 py-3 rounded-2xl font-black text-xl transition-all shadow-xl shadow-yellow-200/40 transform hover:-translate-y-1 active:scale-95"
                        >
                            {t('dashboard.subscribe')}
                        </button>
                    </div>
                )}

                <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div
                        role="button"
                        tabIndex={0}
                        onClick={() => navigate('/topics')}
                        onKeyDown={(e) => e.key === 'Enter' && navigate('/topics')}
                        className="flex cursor-pointer items-center justify-between rounded-[1.2rem] border border-slate-200 bg-white p-3 shadow-[0_15px_50px_rgba(0,0,0,0.04)] transition-all group hover:border-[#FFD131]"
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img src={img2} alt="" />
                            </div>
                            <div className="text-start">
                                <h3 className="mb-0 text-xl font-black text-slate-800">{t('dashboard.solveTitle')}</h3>
                                <p className="text-md font-bold text-slate-500">{t('dashboard.solveDesc')}</p>
                            </div>
                        </div>
                    </div>

                    <div
                        role="button"
                        tabIndex={0}
                        onClick={() => navigate('/trial-test')}
                        onKeyDown={(e) => e.key === 'Enter' && navigate('/trial-test')}
                        className="flex cursor-pointer items-center justify-between rounded-[1.2rem] border border-slate-200 bg-white p-3 shadow-[0_15px_50px_rgba(0,0,0,0.04)] transition-all group hover:border-[#FFD131]"
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img src={img1} alt="" />
                            </div>
                            <div className="text-start">
                                <h3 className="mb-1 text-xl font-black text-slate-800">{t('dashboard.trialCardTitle')}</h3>
                                <p className="text-md font-bold text-slate-500">{t('dashboard.trialCardDesc')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-black text-slate-800 text-start mb-2 flex items-center justify-start gap-3">
                        {t('dashboard.progressTitle')}
                    </h3>

                    <div className="space-y-2">
                        {subjects.map((subject, idx) => (
                            <div key={idx} className="space-y-4">
                                <div className="flex flex-row-reverse justify-between items-center px-2">
                                    <span className="text-2xl font-black text-slate-900">{subject.percentage}</span>
                                    {subject.status && (
                                        <span className="text-xl font-bold text-slate-400">{subject.status}</span>
                                    )}
                                    <h4 className={`text-2xl font-black ${subject.color.replace('bg-', 'text-')}`}>
                                        {subject.label}
                                    </h4>
                                </div>
                                <div
                                    className="flex h-10 w-full items-stretch overflow-hidden rounded-full bg-slate-100/80 shadow-inner"
                                    dir={i18n.dir()}
                                >
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${subject.color}`}
                                        style={{
                                            width: subject.percentage ? subject.percentage : '0%',
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Dashboard;
