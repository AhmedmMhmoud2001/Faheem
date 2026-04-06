import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Container from '../components/Container';
import { ChevronLeft, Ruler, TrendingUp, BookOpen, Layers } from 'lucide-react';
import { api, resolveMediaUrl } from '../lib/api.js';
import decorativePattern from '../assets/decorative-icons.png';
import SubscriptionWall from '../components/SubscriptionWall.jsx';
import { useEntitlement } from '../hooks/useEntitlement.js';

function pickLang(primary, fallback) {
    const p = primary?.trim();
    return p || fallback || '';
}

/** ألوان خلفيات أيقونة ناعمة كالتصميم */
const SUBJECT_VISUAL = {
    algebra: { boxClass: 'bg-rose-100 text-rose-800', icon: 'x-y', iconType: 'text' },
    engineering: { boxClass: 'bg-orange-100 text-orange-800', icon: Ruler, iconType: 'component' },
    statistics: { boxClass: 'bg-violet-100 text-violet-800', icon: TrendingUp, iconType: 'component' },
    calculus: { boxClass: 'bg-emerald-100 text-emerald-800', icon: 'fx', iconType: 'text' },
};

const defaultVisual = { boxClass: 'bg-slate-100 text-slate-700', icon: '?', iconType: 'text' };

/** مستوى صعوبة افتراضي لاختبار TOPIC_24 من بطاقة «اختبار شامل» */
const DEFAULT_EXAM_DIFFICULTY = 2;

/** ألوان متنوعة لبطاقات التصنيفات الفرعية */
const SUB_COLORS = [
    'bg-blue-50 text-blue-700 border-blue-100',
    'bg-rose-50 text-rose-700 border-rose-100',
    'bg-emerald-50 text-emerald-700 border-emerald-100',
    'bg-violet-50 text-violet-700 border-violet-100',
    'bg-amber-50 text-amber-700 border-amber-100',
    'bg-sky-50 text-sky-700 border-sky-100',
    'bg-pink-50 text-pink-700 border-pink-100',
    'bg-teal-50 text-teal-700 border-teal-100',
];

const Topics = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { subject } = useParams();
    const isEn = i18n.language?.toLowerCase().startsWith('en');
    const isRtl = i18n.dir() === 'rtl';
    const { hasAccess, trialDaysLeft } = useEntitlement();

    const [subjects, setSubjects] = useState([]);
    const [loadError, setLoadError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Subcategories state
    const [subcategories, setSubcategories] = useState([]);
    const [subLoading, setSubLoading] = useState(false);
    const [subError, setSubError] = useState(null);

    // Load all subjects (always needed)
    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            setLoadError(null);
            try {
                const { data } = await api.get('/subjects');
                if (!cancelled) {
                    const list = Array.isArray(data?.data) ? data.data : [];
                    setSubjects(
                        list.map((s) => {
                            const v = SUBJECT_VISUAL[s.slug] || defaultVisual;
                            return {
                                ...s,
                                coverSrc: resolveMediaUrl(s.imageUrl),
                                boxClass: v.boxClass,
                                icon: v.icon,
                                iconType: v.iconType,
                            };
                        }),
                    );
                    setLoadError(null);
                }
            } catch (err) {
                if (!cancelled) {
                    setSubjects([]);
                    setLoadError({
                        serverMsg: err.response?.data?.message
                            ? String(err.response.data.message)
                            : undefined,
                    });
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    // Load subcategories when a subject is selected
    useEffect(() => {
        if (!subject) {
            setSubcategories([]);
            return;
        }
        let cancelled = false;
        setSubLoading(true);
        setSubError(null);
        (async () => {
            try {
                const { data } = await api.get(`/subjects/${subject}/subcategories`);
                if (!cancelled) {
                    setSubcategories(Array.isArray(data?.data) ? data.data : []);
                }
            } catch (err) {
                if (!cancelled) {
                    setSubcategories([]);
                    setSubError(err.response?.data?.message || t('topics.subLoadError', 'تعذر تحميل التصنيفات الفرعية'));
                }
            } finally {
                if (!cancelled) setSubLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [subject]);

    const subjectDisplayName = (row) =>
        isEn ? pickLang(row.nameEn, row.nameAr) : pickLang(row.nameAr, row.nameEn);

    const subCategoryDisplayName = (row) =>
        isEn ? pickLang(row.nameEn, row.nameAr) : pickLang(row.nameAr, row.nameEn);

    const subCategoryDesc = (row) =>
        isEn
            ? pickLang(row.descriptionEn, row.description)
            : pickLang(row.description, row.descriptionEn);

    const currentSubject = subject ? subjects.find((s) => s.slug === subject) : null;
    const currentSubjectName = currentSubject ? subjectDisplayName(currentSubject) : subject;

    // ─── View: subject subcategories ──────────────────────────────────────────
    if (subject) {
        return (
            <div className="relative min-h-screen overflow-hidden bg-white py-10 md:py-12" dir={i18n.dir()}>
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.07]"
                    style={{ backgroundImage: `url(${decorativePattern})`, backgroundRepeat: 'repeat', backgroundSize: '420px' }}
                />
                <div className="pointer-events-none absolute inset-0 bg-white/80" />

                <Container className="relative z-10">
                    {/* Breadcrumb */}
                    <div className="mb-8 flex flex-wrap items-center gap-2 text-sm font-bold md:text-base" style={{ color: '#707070' }}>
                        <button type="button" onClick={() => navigate('/dashboard')} className="transition-colors hover:opacity-80" style={{ color: '#707070' }}>
                            {t('topics.crumbDashboard')}
                        </button>
                        <ChevronLeft size={18} className={`shrink-0 opacity-60 ${isRtl ? 'rotate-180' : ''}`} />
                        <button type="button" onClick={() => navigate('/topics')} className="transition-colors hover:opacity-80" style={{ color: '#707070' }}>
                            {t('topics.crumbTopics')}
                        </button>
                        <ChevronLeft size={18} className={`shrink-0 opacity-60 ${isRtl ? 'rotate-180' : ''}`} />
                        <span style={{ color: '#2E3A59' }}>{currentSubjectName}</span>
                    </div>

                    {/* Header */}
                    <div className="relative z-10 mb-10 text-center md:mb-12">
                        <h1 className="mb-3 text-3xl font-black md:text-4xl lg:text-[2.75rem]" style={{ color: '#2E3A59' }}>
                            {currentSubjectName}
                        </h1>
                        {currentSubject && (() => {
                            const desc = isEn
                                ? pickLang(currentSubject.descriptionEn, currentSubject.description)
                                : pickLang(currentSubject.description, currentSubject.descriptionEn);
                            return desc ? (
                                <p className="mx-auto max-w-3xl text-base font-semibold leading-relaxed md:text-lg" style={{ color: '#2E3A59', opacity: 0.85 }}>
                                    {desc}
                                </p>
                            ) : null;
                        })()}
                    </div>

                    {/* Quick-access buttons (bank + exam) */}
                    <div className="relative z-10 mb-8 flex flex-wrap justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => navigate(`/topics/${subject}/difficulty`)}
                            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                            style={{ color: '#2E3A59' }}
                        >
                            {t('topics.questionBank')}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(`/exam/${subject}/${DEFAULT_EXAM_DIFFICULTY}`)}
                            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                            style={{ color: '#2E3A59' }}
                        >
                            {t('topics.comprehensiveExamFor', { name: currentSubjectName })}
                        </button>
                    </div>

                    {/* Subcategories section */}
                    {subLoading && (
                        <p className="mb-6 text-center font-bold" style={{ color: '#707070' }}>
                            {t('topics.subLoading', 'جاري تحميل التصنيفات الفرعية…')}
                        </p>
                    )}
                    {subError && (
                        <p className="mx-auto mb-6 max-w-xl text-center font-bold leading-relaxed text-red-600">{subError}</p>
                    )}

                    {!subLoading && !subError && subcategories.length > 0 && (
                        <>
                            <h2 className="mb-5 text-xl font-black" style={{ color: '#2E3A59' }}>
                                {t('topics.subtopicsTitle', 'التصنيفات الفرعية')}
                            </h2>
                            <div className="relative z-10 mx-auto grid max-w-[920px] grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
                                {subcategories.map((sub, idx) => {
                                    const colorCls = SUB_COLORS[idx % SUB_COLORS.length];
                                    const name = subCategoryDisplayName(sub);
                                    const desc = subCategoryDesc(sub);
                                    const questionCount = sub._count?.questions ?? 0;
                                    return (
                                        <button
                                            key={sub.id}
                                            type="button"
                                            onClick={() => navigate(`/topics/${subject}/${sub.slug}/difficulty`)}
                                            className="group flex w-full items-start gap-4 rounded-[1.25rem] border bg-white p-5 text-start shadow-sm transition-all hover:shadow-md md:p-6"
                                        >
                                            {sub.imageUrl ? (
                                                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl ring-1 ring-slate-100">
                                                    <img src={resolveMediaUrl(sub.imageUrl)} alt="" className="h-full w-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border font-black ${colorCls}`}>
                                                    <Layers size={22} strokeWidth={2} />
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <p className="mb-0.5 text-base font-black" style={{ color: '#2E3A59' }}>{name}</p>
                                                {desc ? (
                                                    <p className="mb-1 line-clamp-2 text-sm font-semibold leading-relaxed" style={{ color: '#707070' }}>{desc}</p>
                                                ) : null}
                                                {questionCount > 0 && (
                                                    <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold" style={{ color: '#707070' }}>
                                                        {questionCount} {t('topics.questionsCount', 'سؤال')}
                                                    </span>
                                                )}
                                            </div>
                                            <ChevronLeft size={18} className={`mt-1 shrink-0 opacity-40 transition-opacity group-hover:opacity-70 ${isRtl ? '' : 'rotate-180'}`} />
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {!subLoading && !subError && subcategories.length === 0 && (
                        <p className="mt-4 text-center font-bold" style={{ color: '#707070' }}>
                            {t('topics.noSubcategories', 'لا توجد تصنيفات فرعية لهذه المادة.')}
                        </p>
                    )}
                </Container>
            </div>
        );
    }

    // ─── View: all subjects list ───────────────────────────────────────────────
    // Block access when trial expired and no active subscription
    if (!hasAccess) {
        return <SubscriptionWall trialDaysLeft={trialDaysLeft} />;
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-white py-10 md:py-12" dir={i18n.dir()}>
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                style={{ backgroundImage: `url(${decorativePattern})`, backgroundRepeat: 'repeat', backgroundSize: '420px' }}
            />
            <div className="pointer-events-none absolute inset-0 bg-white/80" />

            <Container className="relative z-10">
                <div className="mb-8 flex flex-wrap items-center gap-2 text-sm font-bold md:text-base" style={{ color: '#707070' }}>
                    <button type="button" onClick={() => navigate('/dashboard')} className="transition-colors hover:opacity-80" style={{ color: '#707070' }}>
                        {t('topics.crumbDashboard')}
                    </button>
                    <ChevronLeft size={18} className={`shrink-0 opacity-60 ${isRtl ? 'rotate-180' : ''}`} />
                    <span style={{ color: '#2E3A59' }}>{t('topics.crumbTopics')}</span>
                </div>

                <div className="relative z-10 mb-10 text-center md:mb-12">
                    <h1 className="mb-3 text-3xl font-black md:text-4xl lg:text-[2.75rem]" style={{ color: '#2E3A59' }}>
                        {t('topics.title')}
                    </h1>
                    <p className="mx-auto max-w-3xl text-base font-semibold leading-relaxed md:text-lg" style={{ color: '#2E3A59', opacity: 0.85 }}>
                        {t('topics.subtitle')}
                    </p>
                </div>

                {loading ? (
                    <p className="mb-6 text-center font-bold" style={{ color: '#707070' }}>{t('topics.loading')}</p>
                ) : null}
                {loadError ? (
                    <p className="mx-auto mb-6 max-w-xl text-center font-bold leading-relaxed text-red-600">
                        {loadError.serverMsg || t('topics.loadError')}
                    </p>
                ) : null}

                <div className="relative z-10 mx-auto grid max-w-[920px] grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
                    {!loading && !loadError && subjects.length === 0 ? (
                        <p className="col-span-full text-center font-bold" style={{ color: '#707070' }}>{t('topics.empty')}</p>
                    ) : null}
                    {subjects.map((subjectItem) => {
                        const name = subjectDisplayName(subjectItem);
                        return (
                            <div
                                key={subjectItem.slug}
                                className="rounded-[1.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_8px_32px_rgba(46,58,89,0.06)] md:p-7 cursor-pointer hover:shadow-[0_12px_40px_rgba(46,58,89,0.12)] transition"
                                onClick={() => navigate(`/topics/${subjectItem.slug}`)}
                            >
                                <div className="mb-5 flex items-start gap-4">
                                    {subjectItem.coverSrc ? (
                                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl ring-1 ring-slate-100 sm:h-16 sm:w-16">
                                            <img src={subjectItem.coverSrc} alt="" className="h-full w-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl font-black sm:h-16 sm:w-16 ${subjectItem.boxClass}`}>
                                            {subjectItem.iconType === 'component' ? (
                                                React.createElement(subjectItem.icon, { size: 28, strokeWidth: 2.25 })
                                            ) : (
                                                <span className="text-sm sm:text-base">{subjectItem.icon}</span>
                                            )}
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <h3 className="mb-1.5 text-xl font-black sm:text-2xl" style={{ color: '#2E3A59' }}>{name}</h3>
                                        {(() => {
                                            const desc = isEn
                                                ? pickLang(subjectItem.descriptionEn, subjectItem.description)
                                                : pickLang(subjectItem.description, subjectItem.descriptionEn);
                                            if (!desc) return (
                                                <p className="text-sm font-bold" style={{ color: '#707070' }}>{t('topics.noDescription')}</p>
                                            );
                                            return (
                                                <p className="text-sm font-bold leading-relaxed sm:text-base" style={{ color: '#707070' }}>{desc}</p>
                                            );
                                        })()}
                                    </div>
                                </div>

                                <div className="flex gap-3" dir={i18n.dir()}>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); navigate(`/topics/${subjectItem.slug}/difficulty`); }}
                                        className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-3 text-center text-sm font-black transition-colors hover:border-slate-300 hover:bg-slate-50 sm:text-base"
                                        style={{ color: '#2E3A59' }}
                                    >
                                        {t('topics.questionBank')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); navigate(`/exam/${subjectItem.slug}/${DEFAULT_EXAM_DIFFICULTY}`); }}
                                        className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-3 text-center text-sm font-black transition-colors hover:border-slate-300 hover:bg-slate-50 sm:text-base"
                                        style={{ color: '#2E3A59' }}
                                    >
                                        {t('topics.comprehensiveExamFor', { name })}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); navigate(`/topics/${subjectItem.slug}`); }}
                                        className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-3 text-center text-sm font-black transition-colors hover:border-slate-300 hover:bg-slate-50 sm:text-base"
                                        style={{ color: '#2E3A59' }}
                                    >
                                        {t('topics.pickSubcategory', 'اختيار التصنيف الفرعي')}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Container>
        </div>
    );
};

export default Topics;
