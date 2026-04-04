import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Container from '../components/Container';
import { ChevronRight, ChevronLeft, CheckCircle2, XCircle } from 'lucide-react';
import { api, getLearnerLang } from '../lib/api.js';

const Exam = () => {
    const navigate = useNavigate();
    const { subject, level } = useParams();
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
    const isCorrect = Boolean(currentQ?.isCorrect);
    const correctAnswerIndex =
        currentQ?.correctIndex != null ? currentQ.correctIndex : null;

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
                    className="bg-[#FFD131] text-slate-900 px-6 py-3 rounded-xl font-black"
                >
                    عرض النتيجة
                </button>
            </div>
        );
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
                                              ? 'bg-yellow-400 text-slate-900'
                                              : 'bg-white text-slate-600 border border-slate-200 hover:border-yellow-400'
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
                                <div className="w-3 h-3 bg-[#FFD131] rounded-full" />
                                <h2 className="text-2xl font-black text-slate-900">{currentQ.stem}</h2>
                            </div>

                            <div className="bg-slate-100 rounded-[2rem] min-h-[200px] flex items-center justify-center p-6">
                                <span className="text-slate-400 font-bold text-center">محتوى السؤال (نص)</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-96 flex-shrink-0">
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-4">
                            {(currentQ.options || []).map((option, idx) => {
                                const isSelected = selectedAnswer === idx;
                                const isCorrectAnswer =
                                    showResult && correctAnswerIndex != null && idx === correctAnswerIndex;
                                let bgColor = 'bg-white';
                                let borderColor = 'border-slate-200';

                                if (showResult) {
                                    if (isCorrectAnswer) {
                                        bgColor = 'bg-green-50';
                                        borderColor = 'border-green-400';
                                    } else if (isSelected && !isCorrectAnswer) {
                                        bgColor = 'bg-pink-50';
                                        borderColor = 'border-pink-400';
                                    }
                                } else if (isSelected) {
                                    bgColor = 'bg-green-50';
                                    borderColor = 'border-green-400';
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
                                            <span className="text-slate-700 font-bold text-sm flex-1 text-right">
                                                {option}
                                            </span>
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 ${
                                                    isSelected || (showResult && isCorrectAnswer)
                                                        ? 'bg-slate-900 text-white'
                                                        : 'bg-slate-100 text-slate-600'
                                                }`}
                                            >
                                                {idx + 1}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}

                            {showResult && (
                                <div className="mt-6 space-y-4">
                                    <div
                                        className={`p-4 rounded-2xl ${
                                            isCorrect
                                                ? 'bg-green-50 border-2 border-green-400'
                                                : 'bg-red-50 border-2 border-red-400'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            {isCorrect ? (
                                                <CheckCircle2 className="text-green-600" size={24} />
                                            ) : (
                                                <XCircle className="text-red-600" size={24} />
                                            )}
                                            <span
                                                className={`font-black text-lg ${
                                                    isCorrect ? 'text-green-900' : 'text-red-900'
                                                }`}
                                            >
                                                {isCorrect ? 'الإجابة صحيحة' : 'الإجابة خاطئة'}
                                            </span>
                                        </div>
                                        {!isCorrect && correctAnswerIndex != null && (
                                            <div className="mt-4">
                                                <p className="text-slate-700 font-black text-base mb-2">
                                                    الإجابة الصحيحة :
                                                </p>
                                                <p className="text-slate-600 font-bold text-sm leading-relaxed mb-6">
                                                    {(currentQ.options || [])[correctAnswerIndex]}
                                                </p>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(`/explanation/${currentQ.id}`, {
                                                            state: { questionId: currentQ.id },
                                                        })
                                                    }
                                                    className="w-full flex items-center justify-center gap-2 bg-[#FFD131] hover:bg-slate-900 hover:text-white px-6 py-3 rounded-xl font-black text-lg transition-all shadow-lg shadow-yellow-200/50"
                                                >
                                                    <div className="p-1 border-2 border-current rounded-full">
                                                        <ChevronLeft size={16} className="rotate-180" />
                                                    </div>
                                                    <span>الشرح</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
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
