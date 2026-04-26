import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom';
import Container from '../components/Container';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import imgbanner from '../assets/imgbanner.png';
import { api, getLearnerLang, resolveMediaUrl } from '../lib/api.js';
import SubscriptionWall from '../components/SubscriptionWall.jsx';
import { useEntitlement } from '../hooks/useEntitlement.js';
import MathText from '../components/MathText.jsx';

const PRACTICE_LIMIT_FALLBACK = 5;

const Practice = () => {
    const normalizeOption = (option, idx, question) => {
        const lang = getLearnerLang();
        const letter = ['A', 'B', 'C', 'D'][idx] || 'A';
        const legacyImage = lang === 'en'
            ? question?.[`option${letter}ImageUrlEn`] || question?.[`option${letter}ImageUrl`]
            : question?.[`option${letter}ImageUrl`] || question?.[`option${letter}ImageUrlEn`];
        if (typeof option === 'string') {
            return { text: option, imageUrl: legacyImage ? resolveMediaUrl(legacyImage) : null };
        }
        return {
            text: option?.text ?? '',
            imageUrl: option?.imageUrl
                ? resolveMediaUrl(option.imageUrl)
                : legacyImage
                  ? resolveMediaUrl(legacyImage)
                  : null,
        };
    };

    const navigate = useNavigate();
    const { subject, level } = useParams();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const subCategorySlug = searchParams.get('sub') || null;
    const { hasAccess, trialDaysLeft } = useEntitlement();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [attemptId, setAttemptId] = useState(null);
    const [attempt, setAttempt] = useState(null);
    const [stageStats, setStageStats] = useState({ answeredInStage: 0, correctInStage: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [practiceTpl, setPracticeTpl] = useState(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const { data } = await api.get('/practice/template');
                if (!cancelled) setPracticeTpl(data);
            } catch {
                /* ignore, will use fallback */
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const totalQuestions = attempt?.questionIds?.length || 0;
    const questions = attempt?.questions || [];
    const currentQ = questions[currentQuestion];

    const refreshAttempt = useCallback(async (aid) => {
        const { data } = await api.get(`/exams/attempts/${aid}`);
        setAttempt(data);
    }, []);

    const refreshStageStats = useCallback(async () => {
        try {
            const { data } = await api.get('/practice/stats', {
                params: {
                    subjectSlug: subject,
                    difficulty: Number(level),
                    ...(subCategorySlug ? { subCategorySlug } : {}),
                },
            });
            setStageStats({
                answeredInStage: data.answeredInStage ?? 0,
                correctInStage: data.correctInStage ?? 0,
            });
        } catch {
            /* keep previous */
        }
    }, [subject, level, subCategorySlug]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            // انتظر حتى نحصل على إعدادات PRACTICE من الخادم لتحديد limit الصحيح
            if (practiceTpl == null) return;
            try {
                let aid = location.state?.attemptId;
                if (!aid) {
                    const { data } = await api.post('/practice/sessions', {
                        subjectSlug: subject,
                        ...(subCategorySlug ? { subCategorySlug } : {}),
                        difficulty: Number(level),
                        limit: Math.min(
                            20,
                            Math.max(1, practiceTpl?.questionCount || PRACTICE_LIMIT_FALLBACK)
                        ),
                        lang: getLearnerLang(),
                    });
                    aid = data.attemptId;
                    if (!cancelled && data.stageStats) {
                        setStageStats({
                            answeredInStage: data.stageStats.answeredInStage ?? 0,
                            correctInStage: data.stageStats.correctInStage ?? 0,
                        });
                    }
                }
                if (cancelled) return;
                setAttemptId(aid);
                await refreshAttempt(aid);
                await refreshStageStats();
            } catch (e) {
                if (!cancelled) {
                    const status = e.response?.status;
                    const msg = e.response?.data?.message;
                    if (status === 403) {
                        setError('يجب الاشتراك أو تفعيل التجربة المجانية لبدء التدريب');
                    } else if (status === 404 && msg === 'Subject not found') {
                        setError('المادة غير موجودة');
                    } else if (status === 404 && msg === 'No questions for this filter') {
                        setError('لا توجد أسئلة لهذا المستوى في هذا التصنيف بعد');
                    } else if (status === 404) {
                        setError(msg || 'تعذر بدء التدريب');
                    } else {
                        setError(msg || 'تعذر بدء التدريب');
                    }
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [subject, level, subCategorySlug, location.state, refreshAttempt, refreshStageStats, practiceTpl]);

    const showResult = Boolean(currentQ?.userAnswerIndex != null);
    const selectedAnswer = currentQ?.userAnswerIndex ?? null;

    const handleAnswerSelect = async (answerIndex) => {
        if (!attemptId || !currentQ || showResult) return;
        try {
            await api.post(`/exams/attempts/${attemptId}/answer`, {
                questionId: currentQ.id,
                selectedIndex: answerIndex,
                lang: getLearnerLang(),
            });
            await refreshAttempt(attemptId);
            await refreshStageStats();
        } catch (e) {
            alert(e.response?.data?.message || 'تعذر حفظ الإجابة');
        }
    };

    const handleNext = async () => {
        if (currentQuestion < totalQuestions - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setSubmitting(true);
            try {
                const { data } = await api.post(`/exams/attempts/${attemptId}/submit`);
                await refreshStageStats();
                navigate('/result', {
                    state: {
                        attemptId,
                        totalQuestions: data.score?.total ?? totalQuestions,
                        correctCount: data.score?.correct ?? 0,
                        wrongCount: data.score?.wrong ?? 0,
                        answers: data.perQuestion ?? [],
                    },
                });
            } catch (e) {
                alert(e.response?.data?.message || 'تعذر إنهاء الجلسة');
            } finally {
                setSubmitting(false);
            }
        }
    };

    const handleBack = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        } else {
            navigate(-1);
        }
    };

    const questionImageSrc = currentQ?.imageUrl ? resolveMediaUrl(currentQ.imageUrl) : null;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center font-black text-slate-600" dir="rtl">
                جاري تحميل الأسئلة...
            </div>
        );
    }

    if (error || !currentQ) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6" dir="rtl">
                <p className="font-black text-red-600 text-center">{error || 'لا توجد أسئلة لهذا المستوى'}</p>
                <button
                    type="button"
                    onClick={() => navigate('/topics')}
                    className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold"
                >
                    العودة للمواضيع
                </button>
            </div>
        );
    }

    if (attempt?.status === 'EXPIRED') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6" dir="rtl">
                <p className="font-black text-slate-800">انتهت صلاحية جلسة التدريب</p>
                <button
                    type="button"
                    onClick={() => navigate(`/topics/${subject}/difficulty`)}
                    className="bg-[#00A651] text-slate-900 px-6 py-3 rounded-xl font-black"
                >
                    اختيار المستوى من جديد
                </button>
            </div>
        );
    }

    if (!hasAccess) {
        return <SubscriptionWall trialDaysLeft={trialDaysLeft} />;
    }

    return (
        <div className="min-h-screen bg-slate-50/50 py-12 relative font-sans" dir="rtl">
            <Container>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 text-sm font-bold text-slate-600">
                    <span>
                        السؤال {currentQuestion + 1} من {totalQuestions}
                    </span>
                    <span>
                        في هذا المستوى (إجمالي إجاباتك): {stageStats.answeredInStage} سؤال
                        {stageStats.correctInStage > 0
                            ? ` — ${stageStats.correctInStage} إجابة صحيحة`
                            : ''}
                    </span>
                </div>

                <div className="flex items-center justify-end gap-3 mb-8">
                    <MathText
                        value={currentQ.stem}
                        className="text-2xl font-black text-slate-800 text-right leading-snug"
                        dir="rtl"
                    />
                    <div className="w-3 h-3 bg-[#00A651] rounded-full shrink-0" />
                </div>

                <div className="w-full bg-slate-200 rounded-[3rem] overflow-hidden mb-12 shadow-sm">
                    <img
                        src={questionImageSrc || imgbanner}
                        alt=""
                        className="w-full h-auto object-cover max-h-[400px]"
                    />
                </div>

                <div className="space-y-4 mb-20">
                    {(currentQ.options || []).map((option, idx) => {
                        const normalized = normalizeOption(option, idx, currentQ);
                        const isSelected = selectedAnswer === idx;

                        // Blind practice mode: do NOT reveal correctness while solving.
                        let cardStyle = 'bg-white border-2 border-transparent shadow-sm';
                        let numberStyle = 'bg-slate-50 text-slate-400 border border-slate-200';
                        if (isSelected) {
                            cardStyle = 'bg-[#fffbeb] border-2 border-[#00A651]';
                            numberStyle = 'bg-[#00A651] text-slate-900 border border-[#00A651]';
                        }

                        return (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => handleAnswerSelect(idx)}
                                disabled={showResult}
                                className={`w-full p-6 rounded-[2rem] flex items-center justify-between group transition-all duration-300 ${cardStyle} ${!showResult ? 'hover:border-slate-200' : ''}`}
                            >
                                <div className="flex-1">
                                    <MathText
                                        value={normalized.text}
                                        dir="rtl"
                                        className="text-lg font-bold text-right text-slate-700"
                                    />
                                    {normalized.imageUrl && (
                                        <img
                                            src={normalized.imageUrl}
                                            alt=""
                                            className="mt-2 max-h-36 w-auto rounded-lg border border-slate-200 object-contain ms-auto"
                                        />
                                    )}
                                </div>
                                <div className="mr-6">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-base transition-all ${numberStyle}`}
                                    >
                                        {idx + 1}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={submitting || !showResult}
                            className="flex items-center gap-3 bg-[#2d3342] hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-10 py-3.5 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl"
                        >
                            <span>
                                {currentQuestion === totalQuestions - 1
                                    ? submitting
                                        ? 'جاري الحفظ...'
                                        : 'إنهاء'
                                    : 'التالي'}
                            </span>
                            <ArrowLeft size={20} />
                        </button>

                        <button
                            type="button"
                            onClick={handleBack}
                            className="flex items-center gap-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-100 px-10 py-3.5 rounded-xl font-bold text-lg transition-all shadow-sm"
                        >
                            <span>رجوع</span>
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Practice;
