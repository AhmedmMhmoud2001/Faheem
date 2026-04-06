import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Check, LayoutDashboard } from 'lucide-react';
import Container from '../components/Container';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext';

const pickLang = (isEn, ar, en) => {
    if (isEn) return (en && String(en).trim()) || ar || '';
    return ar || '';
};

const defaultFeaturesAr = [
    'الوصول الكامل لجميع الأسئلة (+1000)',
    'اختبارات تجريبية غير محدودة',
    'تقارير تفصيلية للأداء',
    'إمكانية تحميل الاختبارات بصيغة PDF',
    'أسئلة جديدة شهرياً',
    'دعم فني متواصل',
];
const defaultFeaturesEn = [
    'Full access to all questions (+1000)',
    'Unlimited trial exams',
    'Detailed performance reports',
    'Download exams as PDF',
    'New questions monthly',
    'Continuous support',
];

const Subscriptions = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { isLoggedIn, user, loading: authLoading, refreshMe } = useAuth();
    const featuresFromI18n = t('subscriptionsPage.features', { returnObjects: true });
    const isEn = i18n.language?.startsWith('en');
    const featuresList = Array.isArray(featuresFromI18n) && featuresFromI18n.length > 0
        ? featuresFromI18n
        : (isEn ? defaultFeaturesEn : defaultFeaturesAr);
    const [plans, setPlans] = useState([
        {
            name: 'الباقة الشهرية',
            price: '700',
            currency: '$',
            slug: 'monthly',
            interval: 'month',
            features: featuresList,
        },
        {
            name: 'الباقة السنوية',
            price: '1400',
            currency: '$',
            slug: 'yearly',
            interval: 'year',
            features: featuresList,
        },
    ]);

    useEffect(() => {
        refreshMe();
    }, [refreshMe]);

    useEffect(() => {
        api
            .get('/plans')
            .then((r) => {
                const list = (r.data.data || []).map((p) => ({
                    name: p.name,
                    price: String(Math.round(p.priceCents / 100)),
                    currency: p.currency === 'USD' ? '$' : p.currency,
                    slug: p.slug,
                    interval: p.interval,
                    features: featuresList,
                }));
                if (list.length) setPlans(list);
            })
            .catch(() => {});
    }, [featuresList]);

    const entitlement = user?.entitlement;
    const trialEnds = user?.entitlement?.trialEndsAt;
    const [nowMs, setNowMs] = useState(() => Date.now());
    useEffect(() => {
        const id = setInterval(() => setNowMs(Date.now()), 60_000);
        return () => clearInterval(id);
    }, []);
    const trialDaysLeft = useMemo(() => {
        if (trialEnds == null) return null;
        return Math.max(0, Math.ceil((new Date(trialEnds) - nowMs) / 86400000));
    }, [trialEnds, nowMs]);

    const [paymentFaqRemote, setPaymentFaqRemote] = useState(null);
    useEffect(() => {
        api
            .get('/faq', { params: { scope: 'payment' } })
            .then((r) => setPaymentFaqRemote(r.data))
            .catch(() => setPaymentFaqRemote(null));
    }, []);

    // isEn already defined above
    const faqs = useMemo(() => {
        const apiItems = paymentFaqRemote?.items;
        if (apiItems && apiItems.length > 0) {
            return apiItems.map((item) => ({
                id: item.id,
                question: pickLang(isEn, item.questionAr, item.questionEn),
                answer: pickLang(isEn, item.answerAr, item.answerEn),
            }));
        }
        return [];
    }, [paymentFaqRemote, isEn]);

    const [openFaqIndex, setOpenFaqIndex] = useState(-1);
    useEffect(() => {
        setOpenFaqIndex((prev) => {
            if (!faqs.length) return -1;
            return prev >= faqs.length ? -1 : prev;
        });
    }, [faqs.length]);

    const isRtl = i18n.dir() === 'rtl';

    return (
        <div className="min-h-screen bg-slate-50/50 py-6" dir={i18n.dir()}>
            <Container>
                <div className={`mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-center md:justify-between ${isRtl ? 'md:flex-row-reverse' : ''}`}>
                    <h1 className="text-start text-4xl font-black text-slate-900 md:text-5xl">{t('subscriptionsPage.title')}</h1>
                    {!authLoading && isLoggedIn && (
                        <Link
                            to="/dashboard"
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-6 py-3 font-black text-slate-800 shadow-sm transition-all hover:border-[#FFD131] hover:bg-[#FFD131]/10"
                        >
                            <LayoutDashboard className="h-5 w-5" strokeWidth={2.5} />
                            {t('subscriptionsPage.backToDashboard')}
                        </Link>
                    )}
                </div>

                {!authLoading && isLoggedIn && entitlement?.subscriptionStatus === 'ACTIVE' && (
                    <div
                        className={`mb-10 rounded-[1.5rem] border border-emerald-200 bg-emerald-50/90 p-5 md:p-6 ${isRtl ? 'text-right' : 'text-left'}`}
                    >
                        <h2 className="text-xl font-black text-emerald-900 md:text-2xl">{t('subscriptionsPage.activeTitle')}</h2>
                        {entitlement?.planSlug && (
                            <p className="mt-2 font-bold text-emerald-800">{t('subscriptionsPage.planLabel', { slug: entitlement.planSlug })}</p>
                        )}
                        <p className="mt-2 font-bold text-emerald-800/90">{t('subscriptionsPage.activeBody')}</p>
                        {entitlement?.currentPeriodStart && entitlement?.currentPeriodEnd && (
                            <p className="mt-1 font-bold text-emerald-800/90">
                                {isEn
                                    ? `From ${new Date(entitlement.currentPeriodStart).toLocaleDateString('en-GB')} to ${new Date(entitlement.currentPeriodEnd).toLocaleDateString('en-GB')}`
                                    : `من ${new Date(entitlement.currentPeriodStart).toLocaleDateString('ar-EG')} إلى ${new Date(entitlement.currentPeriodEnd).toLocaleDateString('ar-EG')}`}
                            </p>
                        )}
                        <Link
                            to="/dashboard"
                            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 font-black text-white transition hover:bg-emerald-800"
                        >
                            {t('subscriptionsPage.openDashboard')}
                        </Link>
                    </div>
                )}

                {!authLoading && isLoggedIn && entitlement?.subscriptionStatus === 'TRIALING' && trialDaysLeft != null && trialDaysLeft > 0 && (
                    <div
                        className={`mb-10 rounded-[1.5rem] border border-amber-200 bg-amber-50/90 p-5 md:p-6 ${isRtl ? 'text-right' : 'text-left'}`}
                    >
                        <h2 className="text-xl font-black text-amber-900 md:text-2xl">{t('subscriptionsPage.trialTitle')}</h2>
                        <p className="mt-2 font-bold text-amber-900/85">{t('subscriptionsPage.trialDaysLeft', { count: trialDaysLeft })}</p>
                        <div className="mt-4 flex flex-wrap gap-3">
                            <Link
                                to="/dashboard"
                                className="inline-flex items-center gap-2 rounded-xl bg-[#FFD131] px-5 py-2.5 font-black text-slate-900 transition hover:bg-slate-900 hover:text-white"
                            >
                                {t('subscriptionsPage.openDashboard')}
                            </Link>
                        </div>
                    </div>
                )}

                <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2">
                    {plans.map((plan, idx) => {
                        const intervalDays = { day: 1, week: 7, month: 30, year: 365 };
                        const days = intervalDays[plan.interval] ?? null;
                        const daysLine = days != null
                            ? (isEn ? `${days} days of access` : `${days} يوم وصول`)
                            : null;
                        const planFeatures = daysLine ? [daysLine, ...plan.features] : plan.features;
                        return (
                        <div
                            key={plan.slug || idx}
                            className="m-6 rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm transition-all hover:border-yellow-400"
                        >
                            <div className="mb-6 rounded-2xl bg-[#FFD131] px-6 py-3 text-center">
                                <span className="text-3xl font-black text-slate-900">
                                    {plan.currency}
                                    {plan.price}
                                </span>
                            </div>

                            <p className={`mb-8 text-sm font-bold text-red-500 ${isRtl ? 'text-right' : 'text-left'}`}>
                                {t('subscriptionsPage.taxNote')}
                            </p>
                            <hr className="mb-6 text-slate-200" />

                            <div className="mb-8 space-y-3">
                                {planFeatures.map((feature, fIdx) => (
                                    <div key={fIdx} className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                                        <Check size={20} className="flex-shrink-0 text-green-600" strokeWidth={3} />
                                        <span className="text-base font-bold text-slate-700">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={() => navigate('/checkout')}
                                className="w-full rounded-2xl bg-slate-900 py-4 text-lg font-black text-white shadow-lg transition-all hover:bg-slate-800"
                            >
                                {t('subscriptionsPage.subscribeCta')}
                            </button>
                        </div>
                    )})}
                </div>

                <div className="mt-16">
                    <h2 className={`mb-8 text-3xl font-black text-slate-900 ${isRtl ? 'text-right' : 'text-left'}`}>
                        {t('subscriptionsPage.faqTitle')}
                    </h2>
                    <div className="space-y-4">
                        {faqs.length === 0 ? (
                            <p className={`font-bold text-slate-500 ${isRtl ? 'text-right' : 'text-left'}`}>{t('subscriptionsPage.faqEmpty')}</p>
                        ) : (
                            faqs.map((faq, idx) => (
                                <div key={faq.id} className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white">
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaqIndex(openFaqIndex === idx ? -1 : idx)}
                                        className={`w-full p-5 text-lg font-black text-slate-900 transition-colors hover:text-yellow-500 ${isRtl ? 'text-right' : 'text-left'}`}
                                    >
                                        {faq.question}
                                    </button>
                                    {openFaqIndex === idx && (
                                        <div className="px-5 pb-5">
                                            <p
                                                className={`whitespace-pre-wrap font-bold leading-relaxed text-slate-600 ${isRtl ? 'text-right' : 'text-left'}`}
                                            >
                                                {faq.answer}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Subscriptions;
