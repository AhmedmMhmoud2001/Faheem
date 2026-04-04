import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Container from '../components/Container';
import { ChevronLeft, Ruler, TrendingUp } from 'lucide-react';
import { api, resolveMediaUrl } from '../lib/api.js';
import decorativePattern from '../assets/decorative-icons.png';

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

const Topics = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { subject } = useParams();
    const isEn = i18n.language?.toLowerCase().startsWith('en');
    const isRtl = i18n.dir() === 'rtl';
    const [subjects, setSubjects] = useState([]);
    const [loadError, setLoadError] = useState(null);
    const [loading, setLoading] = useState(true);

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
        return () => {
            cancelled = true;
        };
    }, []);

    const displaySubjects = subject ? subjects.filter((s) => s.slug === subject) : subjects;

    const subjectDisplayName = (row) =>
        isEn ? pickLang(row.nameEn, row.nameAr) : pickLang(row.nameAr, row.nameEn);

    return (
        <div className="relative min-h-screen overflow-hidden bg-white py-10 md:py-12" dir={i18n.dir()}>
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                style={{
                    backgroundImage: `url(${decorativePattern})`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '420px',
                }}
            />
            <div className="pointer-events-none absolute inset-0 bg-white/80" />

            <Container className="relative z-10">
                <div
                    className="mb-8 flex flex-wrap items-center gap-2 text-sm font-bold md:text-base"
                    style={{ color: '#707070' }}
                >
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="transition-colors hover:opacity-80"
                        style={{ color: '#707070' }}
                    >
                        {t('topics.crumbDashboard')}
                    </button>
                    {subject && (
                        <>
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
                            <span style={{ color: '#2E3A59' }}>
                                {(() => {
                                    const row = subjects.find((s) => s.slug === subject);
                                    if (!row) return subject;
                                    return subjectDisplayName(row);
                                })()}
                            </span>
                            <ChevronLeft size={18} className={`shrink-0 opacity-60 ${isRtl ? 'rotate-180' : ''}`} />
                            <span style={{ color: '#2E3A59' }}>{t('topics.crumbSubtopics')}</span>
                        </>
                    )}
                    {!subject && (
                        <>
                            <ChevronLeft size={18} className={`shrink-0 opacity-60 ${isRtl ? 'rotate-180' : ''}`} />
                            <span style={{ color: '#2E3A59' }}>{t('topics.crumbTopics')}</span>
                        </>
                    )}
                </div>

                <div className="relative z-10 mb-10 text-center md:mb-12">
                    <h1
                        className="mb-3 text-3xl font-black md:text-4xl lg:text-[2.75rem]"
                        style={{ color: '#2E3A59' }}
                    >
                        {t('topics.title')}
                    </h1>
                    <p
                        className="mx-auto max-w-3xl text-base font-semibold leading-relaxed md:text-lg"
                        style={{ color: '#2E3A59', opacity: 0.85 }}
                    >
                        {t('topics.subtitle')}
                    </p>
                </div>

                {loading ? (
                    <p className="mb-6 text-center font-bold" style={{ color: '#707070' }}>
                        {t('topics.loading')}
                    </p>
                ) : null}
                {loadError ? (
                    <p className="mx-auto mb-6 max-w-xl text-center font-bold leading-relaxed text-red-600">
                        {loadError.serverMsg || t('topics.loadError')}
                    </p>
                ) : null}

                <div className="relative z-10 mx-auto grid max-w-[920px] grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
                    {!loading && !loadError && displaySubjects.length === 0 ? (
                        <p className="col-span-full text-center font-bold" style={{ color: '#707070' }}>
                            {t('topics.empty')}
                        </p>
                    ) : null}
                    {displaySubjects.map((subjectItem) => {
                        const name = subjectDisplayName(subjectItem);
                        return (
                            <div
                                key={subjectItem.slug}
                                className="rounded-[1.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_8px_32px_rgba(46,58,89,0.06)] md:p-7"
                            >
                                <div className="mb-5 flex items-start gap-4">
                                    {subjectItem.coverSrc ? (
                                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl ring-1 ring-slate-100 sm:h-16 sm:w-16">
                                            <img
                                                src={subjectItem.coverSrc}
                                                alt=""
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl font-black sm:h-16 sm:w-16 ${subjectItem.boxClass}`}
                                        >
                                            {subjectItem.iconType === 'component' ? (
                                                React.createElement(subjectItem.icon, {
                                                    size: 28,
                                                    strokeWidth: 2.25,
                                                })
                                            ) : (
                                                <span className="text-sm sm:text-base">{subjectItem.icon}</span>
                                            )}
                                        </div>
                                    )}

                                    <div className="min-w-0 flex-1">
                                        <h3
                                            className="mb-1.5 text-xl font-black sm:text-2xl"
                                            style={{ color: '#2E3A59' }}
                                        >
                                            {name}
                                        </h3>
                                        {(() => {
                                            const desc = isEn
                                                ? pickLang(subjectItem.descriptionEn, subjectItem.description)
                                                : pickLang(subjectItem.description, subjectItem.descriptionEn);
                                            if (!desc) {
                                                return (
                                                    <p className="text-sm font-bold" style={{ color: '#707070' }}>
                                                        {t('topics.noDescription')}
                                                    </p>
                                                );
                                            }
                                            return (
                                                <p
                                                    className="text-sm font-bold leading-relaxed sm:text-base"
                                                    style={{ color: '#707070' }}
                                                >
                                                    {desc}
                                                </p>
                                            );
                                        })()}
                                    </div>
                                </div>

                                <div className="flex gap-3" dir={i18n.dir()}>
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/topics/${subjectItem.slug}/difficulty`)}
                                        className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-3 text-center text-sm font-black transition-colors hover:border-slate-300 hover:bg-slate-50 sm:text-base"
                                        style={{ color: '#2E3A59' }}
                                    >
                                        {t('topics.questionBank')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(`/exam/${subjectItem.slug}/${DEFAULT_EXAM_DIFFICULTY}`)
                                        }
                                        className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-3 text-center text-sm font-black transition-colors hover:border-slate-300 hover:bg-slate-50 sm:text-base"
                                        style={{ color: '#2E3A59' }}
                                    >
                                        {t('topics.comprehensiveExamFor', { name })}
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
