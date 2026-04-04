import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Container from '../components/Container';
import { FileText, Clock, Target, TrendingUp } from 'lucide-react';
import { api } from '../lib/api.js';

const ICON_CONFIG = [
    { icon: FileText, iconBg: 'bg-yellow-50', iconColor: 'text-yellow-600' },
    { icon: Clock, iconBg: 'bg-yellow-50', iconColor: 'text-yellow-600' },
    { icon: Target, iconBg: 'bg-yellow-50', iconColor: 'text-yellow-600' },
    { icon: TrendingUp, iconBg: 'bg-yellow-50', iconColor: 'text-yellow-600' }
];

const TrialTest = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [starting, setStarting] = useState(false);

    const featuresData = t('trialTest.features', { returnObjects: true });
    const instructionsData = t('trialTest.instructions', { returnObjects: true });

    const features = useMemo(() => {
        const list = Array.isArray(featuresData) ? featuresData : [];
        return ICON_CONFIG.map((cfg, idx) => ({
            ...cfg,
            value: list[idx]?.value ?? '',
            description: list[idx]?.description ?? ''
        }));
    }, [featuresData]);

    const instructions = useMemo(
        () => (Array.isArray(instructionsData) ? instructionsData : []),
        [instructionsData]
    );

    const handleStartTest = async () => {
        setStarting(true);
        try {
            const { data } = await api.post('/exams/start', { templateCode: 'TRIAL_24' });
            navigate('/exam/trial/1', { state: { attemptId: data.attemptId } });
        } catch (e) {
            const msg = e.response?.data?.message;
            alert(typeof msg === 'string' && msg.trim() ? msg : t('trialTest.startError'));
        } finally {
            setStarting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 py-12 relative overflow-hidden" dir={i18n.dir()}>
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-20 right-20 text-6xl">💡</div>
                <div className="absolute top-40 left-40 text-5xl">💻</div>
                <div className="absolute bottom-40 right-60 text-6xl">📊</div>
                <div className="absolute bottom-60 left-20 text-5xl">🎓</div>
                <div className="absolute top-60 left-60 text-4xl">❓</div>
                <div className="absolute bottom-80 right-40 text-5xl">💬</div>
            </div>

            <Container>
                <div className="text-center mb-16 relative z-10">
                    <div className="flex items-center justify-center gap-6 mb-6">
                        <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center">
                            <FileText className="text-white" size={32} />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-slate-900">
                            {t('trialTest.title')}
                        </h1>
                    </div>
                    <p className="text-xl text-slate-600 font-bold max-w-3xl mx-auto">
                        {t('trialTest.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16 relative z-10">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:border-yellow-400 transition-all"
                        >
                            <div className="flex items-start gap-4">
                                <div
                                    className={`${feature.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0`}
                                >
                                    <feature.icon className={feature.iconColor} size={32} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-black text-slate-900 mb-2">
                                        {feature.value}
                                    </h3>
                                    <p className="text-slate-600 font-bold text-sm">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="max-w-4xl mx-auto mb-12 relative z-10">
                    <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-100">
                        <h2 className="text-3xl font-black text-slate-900 mb-8">
                            {t('trialTest.instructionsTitle')}
                        </h2>
                        <ul className="space-y-4">
                            {instructions.map((instruction, idx) => (
                                <li key={idx} className="flex items-start gap-4">
                                    <div className="w-2 h-2 bg-slate-900 rounded-full mt-2 flex-shrink-0" />
                                    <p className="text-slate-600 font-bold text-lg flex-1">
                                        {instruction}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="text-center mb-8 relative z-10">
                    <button
                        type="button"
                        onClick={handleStartTest}
                        disabled={starting}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-16 py-5 rounded-2xl font-black text-xl transition-all transform hover:-translate-y-1 shadow-xl disabled:opacity-50"
                    >
                        {starting ? t('trialTest.starting') : t('trialTest.start')}
                    </button>
                </div>

                <div className="text-center relative z-10">
                    <p className="text-slate-500 font-bold text-sm">{t('trialTest.tip')}</p>
                </div>
            </Container>
        </div>
    );
};

export default TrialTest;
