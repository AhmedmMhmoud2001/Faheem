import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Container from '../components/Container';
import { ChevronLeft } from 'lucide-react';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext';
import SubscriptionWall from '../components/SubscriptionWall.jsx';
import { useEntitlement } from '../hooks/useEntitlement.js';

import decorativePattern from '../assets/decorative-icons.png';
import difficultyImgL1 from '../assets/Frame 1984078966.png';
import difficultyImgL2 from '../assets/Frame 1984078966(1).png';
import difficultyImgL3 from '../assets/Frame 1984078966(2).png';
import difficultyImgL4 from '../assets/Frame 1984078966(3).png';

function pickLang(primary, fallback) {
    const p = primary?.trim();
    return p || fallback || '';
}

/** اختيار صورة المستوى — 1: Frame…png | 2: (1) | 3: (2) | 4: (3) */
const DIFFICULTY_IMAGE_BY_LEVEL = {
    1: difficultyImgL1,
    2: difficultyImgL2,
    3: difficultyImgL3,
    4: difficultyImgL4,
};

function DifficultyIcon({ level, label }) {
    const src = DIFFICULTY_IMAGE_BY_LEVEL[level];
    if (!src) return null;
    return (
        <img
            src={src}
            alt={label || ''}
            className="h-14 w-auto max-w-[140px] shrink-0 object-contain sm:h-16"
            loading="lazy"
        />
    );
}

const DifficultyLevel = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { subject, subcategory } = useParams();
    const isEn = i18n.language?.toLowerCase().startsWith('en');
    const { isLoggedIn, loading: authLoading } = useAuth();
    const { hasAccess, trialDaysLeft } = useEntitlement();
    const [subjectLabel, setSubjectLabel] = useState(null);
    const [subcategoryLabel, setSubcategoryLabel] = useState(null);
    const [progressPct, setProgressPct] = useState({ 1: 0, 2: 0, 3: 0, 4: 0 });
    const [statsLoading, setStatsLoading] = useState(true);

    const difficultyLevels = useMemo(
        () =>
            [1, 2, 3, 4].map((level) => ({
                name: t(`difficulty.levels.${level}.name`),
                subtitle: t(`difficulty.levels.${level}.subtitle`),
                level,
            })),
        [t, i18n.language],
    );

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const { data } = await api.get('/subjects');
                const list = Array.isArray(data?.data) ? data.data : [];
                const row = list.find((s) => s.slug === subject);
                if (!cancelled) {
                    if (row) {
                        setSubjectLabel(
                            isEn ? pickLang(row.nameEn, row.nameAr) : pickLang(row.nameAr, row.nameEn),
                        );
                    } else {
                        setSubjectLabel(
                            t(`subjectLabels.${subject}`, { defaultValue: subject || t('difficulty.fallbackSubject') }),
                        );
                    }
                }
            } catch {
                if (!cancelled) {
                    setSubjectLabel(
                        t(`subjectLabels.${subject}`, { defaultValue: subject || t('difficulty.fallbackSubject') }),
                    );
                }
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [subject, isEn, t]);

    // Load subcategory label if subcategory param present
    useEffect(() => {
        if (!subcategory || !subject) {
            setSubcategoryLabel(null);
            return;
        }
        let cancelled = false;
        (async () => {
            try {
                const { data } = await api.get(`/subjects/${subject}/subcategories`);
                const list = Array.isArray(data?.data) ? data.data : [];
                const row = list.find((s) => s.slug === subcategory);
                if (!cancelled && row) {
                    setSubcategoryLabel(isEn ? pickLang(row.nameEn, row.nameAr) : pickLang(row.nameAr, row.nameEn));
                }
            } catch {
                // ignore – label will fall back to slug
            }
        })();
        return () => { cancelled = true; };
    }, [subject, subcategory, isEn]);

    const loadStageProgress = useCallback(async () => {
        if (!subject) return;
        if (!isLoggedIn) {
            setProgressPct({ 1: 0, 2: 0, 3: 0, 4: 0 });
            setStatsLoading(false);
            return;
        }
        setStatsLoading(true);
        const levels = [1, 2, 3, 4];
        const next = { 1: 0, 2: 0, 3: 0, 4: 0 };
        await Promise.all(
            levels.map(async (level) => {
                try {
                    const statsParams = {
                        subjectSlug: subject,
                        difficulty: level,
                        ...(subcategory ? { subCategorySlug: subcategory } : {}),
                    };
                    const countParams = {
                        difficulty: level,
                        limit: 1,
                        page: 1,
                        ...(subcategory ? { subCategorySlug: subcategory } : {}),
                    };
                    const [statsRes, countRes] = await Promise.all([
                        api.get('/practice/stats', { params: statsParams }),
                        api.get(`/subjects/${subject}/questions`, { params: countParams }),
                    ]);
                    const total = countRes.data?.meta?.total ?? 0;
                    const answered = statsRes.data?.answeredInStage ?? 0;
                    if (total > 0) {
                        const used = Math.min(answered, total);
                        next[level] = Math.min(100, Math.round((used / total) * 100));
                    } else {
                        next[level] = 0;
                    }
                } catch {
                    next[level] = 0;
                }
            }),
        );
        setProgressPct(next);
        setStatsLoading(false);
    }, [subject, subcategory, isLoggedIn]);

    useEffect(() => {
        if (authLoading) return;
        loadStageProgress();
    }, [authLoading, loadStageProgress]);

    const subjectName =
        subjectLabel ??
        t(`subjectLabels.${subject}`, { defaultValue: subject || t('difficulty.fallbackSubject') });

    const handleDifficultyClick = (level) => {
        if (subcategory) {
            navigate(`/practice/${subject}/${level}?sub=${subcategory}`);
        } else {
            navigate(`/practice/${subject}/${level}`);
        }
    };

    const isRtl = i18n.dir() === 'rtl';

    // Block access when trial expired and no active subscription
    if (!hasAccess) {
        return <SubscriptionWall trialDaysLeft={trialDaysLeft} />;
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#F5F6FA] py-8 md:py-10" dir={i18n.dir()}>
            {/* خلفية بنمط أيقونات خفيف كالمعاينة */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.08]"
                style={{
                    backgroundImage: `url(${decorativePattern})`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '420px',
                }}
            />
            <div className="pointer-events-none absolute inset-0 bg-[#F5F6FA]/85" />

            <Container className="relative z-10">
                <div className="mb-8 flex flex-wrap items-center gap-2 text-sm font-bold md:text-base" style={{ color: '#707070' }}>
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="transition-colors hover:opacity-80"
                        style={{ color: '#707070' }}
                    >
                        {t('topics.crumbDashboard')}
                    </button>
                    <ChevronLeft size={18} className={`shrink-0 opacity-60 ${isRtl ? 'rotate-180' : ''}`} />
                    <button
                        type="button"
                        onClick={() => navigate('/topics')}
                        className="transition-colors hover:opacity-80"
                        style={{ color: '#707070' }}
                    >
                        {t('topics.crumbTopics')}
                    </button>
                    <ChevronLeft size={18} className={`shrink-0 opacity-60 ${isRtl ? 'rotate-180' : ''}`} />
                    <button
                        type="button"
                        onClick={() => navigate(`/topics/${subject}`)}
                        className="transition-colors hover:opacity-80"
                        style={{ color: '#707070' }}
                    >
                        {subjectName}
                    </button>
                    {subcategory && (
                        <>
                            <ChevronLeft size={18} className={`shrink-0 opacity-60 ${isRtl ? 'rotate-180' : ''}`} />
                            <span style={{ color: '#2E3A59' }}>{subcategoryLabel || subcategory}</span>
                        </>
                    )}
                    <ChevronLeft size={18} className={`shrink-0 opacity-60 ${isRtl ? 'rotate-180' : ''}`} />
                    <span style={{ color: '#2E3A59' }}>{t('difficulty.crumbLevel')}</span>
                </div>

                <div className="relative z-10 mb-10 text-center md:mb-12">
                    <h1
                        className="mb-3 text-3xl font-black leading-tight md:text-4xl lg:text-[2.75rem]"
                        style={{ color: '#2E3A59' }}
                    >
                        {t('difficulty.title')}
                    </h1>
                    <p
                        className="mx-auto max-w-2xl text-base font-semibold leading-relaxed md:text-lg"
                        style={{ color: '#707070' }}
                    >
                        {t('difficulty.subtitle')}
                    </p>
                </div>

                <div className="relative z-10 mx-auto grid max-w-[920px] grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
                    {difficultyLevels.map((difficulty) => {
                        const pct = progressPct[difficulty.level] ?? 0;
                        const fillWidth = statsLoading ? 0 : pct;
                        return (
                            <button
                                key={difficulty.level}
                                type="button"
                                onClick={() => handleDifficultyClick(difficulty.level)}
                                className="group w-full rounded-[1.5rem] border border-white/80 bg-white p-6 text-start shadow-[0_8px_32px_rgba(46,58,89,0.08)] transition-all hover:shadow-[0_12px_40px_rgba(46,58,89,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C83AC] focus-visible:ring-offset-2 md:p-7"
                            >
                                {/* صف علوي: نص + أيقونة الأعمدة — في RTL يظهر النص يمين والأيقونة يسار */}
                                <div className="mb-6 flex items-start justify-between gap-4">
                                    <div className={`min-w-0 flex-1 space-y-1.5 ${isRtl ? 'text-right' : 'text-left'}`}>
                                        <h3
                                            className="text-2xl font-black md:text-[1.65rem] lg:text-[1.75rem]"
                                            style={{ color: '#2E3A59' }}
                                        >
                                            {difficulty.name}
                                        </h3>
                                        <p className="text-base font-bold md:text-[1.05rem]" style={{ color: '#707070' }}>
                                            {difficulty.subtitle}
                                        </p>
                                    </div>
                                    <div className="shrink-0 pt-0.5">
                                        <DifficultyIcon level={difficulty.level} label={difficulty.name} />
                                    </div>
                                </div>

                                {/* النسبة بجانب الشريط: يسار الشريط في LTR، يمين الشريط في RTL */}
                                <div className="flex w-full items-center gap-3">
                                    {!isRtl && (
                                        <span
                                            className="shrink-0 text-sm font-black tabular-nums md:text-base"
                                            style={{ color: '#707070' }}
                                        >
                                            {statsLoading ? '…' : `${pct}%`}
                                        </span>
                                    )}
                                    <div
                                        className="h-3 min-w-0 flex-1 overflow-hidden rounded-full"
                                        style={{ backgroundColor: '#E0E0E0' }}
                                    >
                                        <div
                                            className="h-full rounded-full transition-all duration-500 ease-out"
                                            style={{
                                                width: `${fillWidth}%`,
                                                backgroundColor: '#7C83AC',
                                            }}
                                        />
                                    </div>
                                    {isRtl && (
                                        <span
                                            className="shrink-0 text-sm font-black tabular-nums md:text-base"
                                            style={{ color: '#707070' }}
                                        >
                                            {statsLoading ? '…' : `${pct}%`}
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </Container>
        </div>
    );
};

export default DifficultyLevel;
