import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Container from '../components/Container';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { api, getLearnerLang, resolveMediaUrl } from '../lib/api.js';
import SubscriptionWall from '../components/SubscriptionWall.jsx';
import { useEntitlement } from '../hooks/useEntitlement.js';
import MathText from '../components/MathText.jsx';

const Exam = () => {
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
    const { hasAccess, trialDaysLeft } = useEntitlement();
    const location = useLocation();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [attemptId, setAttemptId] = useState(null);
    const [attempt, setAttempt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [timeLeftSec, setTimeLeftSec] = useState(-1);

    const totalQuestions = attempt?.questionIds?.length || 0;
    const questions = attempt?.questions || [];
    const currentQ = questions[currentQuestion];

    const refreshAttempt = useCallback(async (aid) => {
        const { data } = await api.get(`/exams/attempts/${aid}`);
        setAttempt(data);
        if (data.expiresAt) {
            const s = Math.max(0, Math.floor((new Date(data.expiresAt) - Date.now()) / 1000));
            setTimeLeftSec(s);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                let aid = location.state?.attemptId;
                if (!aid) {
                    const body =
                        subject === 'trial'
                            ? { templateCode: 'TRIAL_24' }
                            : { subjectSlug: subject, difficulty: Number(level) };
                    const { data } = await api.post('/exams/start', body);
                    aid = data.attemptId;
                }
                if (cancelled) return;
                setAttemptId(aid);
                await refreshAttempt(aid);
            } catch (e) {
                if (!cancelled) setError(e.response?.data?.message || 'تعذر بدء الاختبار');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [subject, level, location.state, refreshAttempt]);

    useEffect(() => {
        if (!attempt?.expiresAt || attempt.status !== 'IN_PROGRESS') return;
        const tick = () => {
            const s = Math.max(0, Math.floor((new Date(attempt.expiresAt) - Date.now()) / 1000));
            setTimeLeftSec(s);
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [attempt?.expiresAt, attempt?.status]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
    };

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
                navigate('/result', {
                    state: {
                        attemptId,
                        score: data.score.correct,
                        totalQuestions: data.score.total,
                        correctCount: data.score.correct,
                        wrongCount: data.score.wrong,
                        answers: data.perQuestion,
                    },
                });
            } catch (e) {
                alert(e.response?.data?.message || 'تعذر إرسال الاختبار');
            } finally {
                setSubmitting(false);
            }
        }
    };

    const handleBack = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleQuestionClick = (questionIndex) => {
        setCurrentQuestion(questionIndex);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center font-black text-slate-600" dir="rtl">
                جاري تحميل الاختبار...
            </div>
        );
    }

    if (error || !currentQ) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6" dir="rtl">
                <p className="font-black text-red-600 text-center">{error || 'لا توجد أسئلة'}</p>
                <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold"
                >
                    العودة
                </button>
            </div>
        );
    }

    if (attempt?.status === 'EXPIRED' || (attempt && timeLeftSec === 0)) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6" dir="rtl">
                <p className="font-black text-slate-800">انتهى وقت الاختبار</p>
                <button
                    type="button"
                    onClick={async () => {
                        try {
                            const { data } = await api.post(`/exams/attempts/${attemptId}/submit`);
                            navigate('/result', {
                                state: {
                                    attemptId,
                                    score: data.score.correct,
                                    totalQuestions: data.score.total,
                                    correctCount: data.score.correct,
                                    wrongCount: data.score.wrong,
                                    answers: data.perQuestion,
                                },
                            });
                        } catch {
                            navigate('/dashboard');
                        }
                    }}
                    className="bg-[#00A651] text-slate-900 px-6 py-3 rounded-xl font-black"
                >
                    عرض النتيجة
                </button>
            </div>
        );
    }

    if (!hasAccess) {
        return <SubscriptionWall trialDaysLeft={trialDaysLeft} />;
    }

    return (
        <div className="min-h-screen bg-slate-50/50 py-12 relative overflow-hidden" dir="rtl">
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-20 right-20 text-6xl">💡</div>
                <div className="absolute top-40 left-40 text-5xl">💻</div>
                <div className="absolute bottom-40 right-60 text-6xl">📊</div>
                <div className="absolute bottom-60 left-20 text-5xl">🎓</div>
            </div>

            <Container>
                <div className="mb-8">
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                        {Array.from({ length: totalQuestions }, (_, i) => {
                            const q = questions[i];
                            const answered = q?.userAnswerIndex != null;
                            return (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => handleQuestionClick(i)}
                                    className={`w-12 h-12 rounded-xl font-black text-lg transition-all ${
                                        i === currentQuestion
                                            ? 'bg-slate-900 text-white shadow-lg'
                                            : answered
                                              ? 'bg-[#00A651] text-slate-900'
                                              : 'bg-white text-slate-600 border border-slate-200 hover:border-[#00A651]'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center justify-center gap-4 text-slate-600 font-bold">
                        <span>
                            Min {formatTime(timeLeftSec)} Sec
                        </span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row-reverse gap-8 mb-8">
                    <div className="flex-1">
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-3 h-3 bg-[#00A651] rounded-full" />
                                <MathText
                                    value={currentQ.stem}
                                    dir="rtl"
                                    className="text-2xl font-black text-slate-900"
                                />
                            </div>

                            <div className="bg-slate-100 rounded-[2rem] min-h-[200px] flex items-center justify-center p-6">
                                <span className="text-slate-400 font-bold text-center">محتوى السؤال (نص)</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-96 flex-shrink-0">
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-4">
                            {(currentQ.options || []).map((option, idx) => {
                                const normalized = normalizeOption(option, idx, currentQ);
                                const isSelected = selectedAnswer === idx;
                                let bgColor = 'bg-white';
                                let borderColor = 'border-slate-200';

                                // Blind exam mode: do NOT reveal correctness while solving.
                                if (isSelected) {
                                    bgColor = 'bg-[#fffbeb]';
                                    borderColor = 'border-[#00A651]';
                                }

                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => handleAnswerSelect(idx)}
                                        disabled={showResult}
                                        className={`w-full ${bgColor} ${borderColor} border-2 rounded-2xl p-4 text-right transition-all ${
                                            !showResult ? 'hover:border-green-400 cursor-pointer' : 'cursor-default'
                                        }`}
                                    >
                                        <div className="flex items-center justify-end gap-4">
                                            <div className="flex-1">
                                                <MathText
                                                    value={normalized.text}
                                                    dir="rtl"
                                                    className="text-slate-700 font-bold text-sm text-right"
                                                />
                                                {normalized.imageUrl && (
                                                    <img
                                                        src={normalized.imageUrl}
                                                        alt=""
                                                        className="mt-2 max-h-32 w-auto rounded-lg border border-slate-200 object-contain ms-auto"
                                                    />
                                                )}
                                            </div>
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 ${
                                                    isSelected ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                                                }`}
                                            >
                                                {idx + 1}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={submitting || !showResult}
                        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 py-4 rounded-2xl font-black text-lg transition-all"
                    >
                        <ChevronLeft size={20} className="rotate-180" />
                        {currentQuestion === totalQuestions - 1 ? (submitting ? 'جاري الإرسال...' : 'إنهاء') : 'التالي'}
                    </button>

                    <button
                        type="button"
                        onClick={handleBack}
                        disabled={currentQuestion === 0}
                        className="flex items-center gap-2 bg-white hover:bg-slate-50 disabled:bg-slate-100 disabled:cursor-not-allowed border-2 border-slate-200 text-slate-900 px-8 py-4 rounded-2xl font-black text-lg transition-all"
                    >
                        <ChevronRight size={20} />
                        رجوع
                    </button>
                </div>
            </Container>
        </div>
    );
};

export default Exam;
