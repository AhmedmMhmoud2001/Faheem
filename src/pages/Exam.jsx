import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Container from '../components/Container';
import { ChevronRight, ChevronLeft, CheckCircle2, XCircle } from 'lucide-react';

const Exam = () => {
    const navigate = useNavigate();
    const { subject, level } = useParams();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [timeLeft, setTimeLeft] = useState(90); // 90 seconds = 1:30
    const [answers, setAnswers] = useState({});

    const totalQuestions = 24;
    const questions = Array.from({ length: totalQuestions }, (_, i) => ({
        id: i + 1,
        title: 'لوريم ايبسوم دولار سيت',
        options: [
            'لوريم ايبسوم دولار سيت أميت ليجاتوس إنفيدونت',
            'لوريم ايبسوم دولار سيت أميت إيليت، إت تيت إنترولي',
            'لوريم ايبسوم دولار سيت أميت إي لومينيير مينيم إي ريبيوديامت لومينيير فينيام، إنتروليكيشن !',
            'لوريم ايبسوم دولار سيت أميت فوليام كويرات ميوتيت تيت نوستراد لومينيير دو كونسيكتيتور ماج'
        ],
        correctAnswer: 1 // Index of correct answer (0-based)
    }));

    const subjects = {
        algebra: 'الجبر',
        engineering: 'الهندسة',
        statistics: 'الإحصاء',
        calculus: 'التفاضل و التكامل'
    };

    const difficultyNames = {
        1: 'ضعيف',
        2: 'متوسط',
        3: 'صعب',
        4: 'صعب جدا'
    };

    useEffect(() => {
        if (timeLeft > 0 && !showResult) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft, showResult]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
    };

    const handleAnswerSelect = (answerIndex) => {
        if (!showResult) {
            setSelectedAnswer(answerIndex);
            setAnswers({ ...answers, [currentQuestion]: answerIndex });
            // Show result immediately after selecting an answer
            setShowResult(true);
        }
    };

    const handleNext = () => {
        if (currentQuestion < totalQuestions - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(answers[currentQuestion + 1] || null);
            setShowResult(false);
        } else {
            // Exam finished
            // Calculate results
            let correctCount = 0;
            const finalAnswers = [];

            // Reconstruct answers array status
            for (let i = 0; i < totalQuestions; i++) {
                const userAnswer = answers[i];
                const correctAnswer = questions[i].correctAnswer;
                if (userAnswer === correctAnswer) {
                    correctCount++;
                    finalAnswers.push('correct');
                } else {
                    finalAnswers.push('wrong');
                }
            }

            navigate('/result', {
                state: {
                    score: correctCount,
                    totalQuestions,
                    correctCount,
                    wrongCount: totalQuestions - correctCount,
                    answers: finalAnswers
                }
            });
        }
    };

    const handleBack = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
            setSelectedAnswer(answers[currentQuestion - 1] || null);
            setShowResult(false);
        }
    };

    const handleQuestionClick = (questionIndex) => {
        setCurrentQuestion(questionIndex);
        setSelectedAnswer(answers[questionIndex] || null);
        setShowResult(false);
    };

    const currentQ = questions[currentQuestion];
    const isCorrect = selectedAnswer === currentQ.correctAnswer;

    return (
        <div className="min-h-screen bg-slate-50/50 py-12 relative overflow-hidden" dir="rtl">
            {/* Background decorative icons */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-20 right-20 text-6xl">💡</div>
                <div className="absolute top-40 left-40 text-5xl">💻</div>
                <div className="absolute bottom-40 right-60 text-6xl">📊</div>
                <div className="absolute bottom-60 left-20 text-5xl">🎓</div>
                <div className="absolute top-60 left-60 text-4xl">❓</div>
                <div className="absolute bottom-80 right-40 text-5xl">💬</div>
            </div>

            <Container>
                {/* Question Navigation Grid */}
                <div className="mb-8">
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                        {Array.from({ length: totalQuestions }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => handleQuestionClick(i)}
                                className={`w-12 h-12 rounded-xl font-black text-lg transition-all ${i === currentQuestion
                                    ? 'bg-slate-900 text-white shadow-lg'
                                    : answers[i] !== undefined
                                        ? 'bg-yellow-400 text-slate-900'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:border-yellow-400'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    {/* Timer */}
                    <div className="flex items-center justify-center gap-4 text-slate-600 font-bold">
                        <span>Min {formatTime(timeLeft)} Sec</span>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col lg:flex-row-reverse gap-8 mb-8">
                    {/* Question Display Area - Right Side */}
                    <div className="flex-1">
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
                            {/* Question Title */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-3 h-3 bg-[#FFD131] rounded-full"></div>
                                <h2 className="text-2xl font-black text-slate-900">{currentQ.title}</h2>
                            </div>

                            {/* Question Content Area - Large Grey Box */}
                            <div className="bg-slate-100 rounded-[2rem] h-96 flex items-center justify-center">
                                <span className="text-slate-400 font-bold">منطقة عرض السؤال</span>
                            </div>
                        </div>
                    </div>

                    {/* Answer Options - Left Side */}
                    <div className="lg:w-96 flex-shrink-0">
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-4">
                            {currentQ.options.map((option, idx) => {
                                const isSelected = selectedAnswer === idx;
                                const isCorrectAnswer = idx === currentQ.correctAnswer;
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
                                        onClick={() => handleAnswerSelect(idx)}
                                        disabled={showResult}
                                        className={`w-full ${bgColor} ${borderColor} border-2 rounded-2xl p-4 text-right transition-all ${!showResult ? 'hover:border-green-400 cursor-pointer' : 'cursor-default'
                                            }`}
                                    >
                                        <div className="flex items-center justify-end gap-4">
                                            <span className="text-slate-700 font-bold text-sm flex-1 text-right">
                                                {option}
                                            </span>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 ${isSelected || (showResult && isCorrectAnswer)
                                                ? 'bg-slate-900 text-white'
                                                : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                {idx + 1}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}

                            {/* Result Display - Below Options */}
                            {showResult && (
                                <div className="mt-6 space-y-4">
                                    <div className={`p-4 rounded-2xl ${isCorrect ? 'bg-green-50 border-2 border-green-400' : 'bg-red-50 border-2 border-red-400'}`}>
                                        <div className="flex items-center gap-3 mb-3">
                                            {isCorrect ? (
                                                <CheckCircle2 className="text-green-600" size={24} />
                                            ) : (
                                                <XCircle className="text-red-600" size={24} />
                                            )}
                                            <span className={`font-black text-lg ${isCorrect ? 'text-green-900' : 'text-red-900'}`}>
                                                {isCorrect ? 'الإجابة صحيحة' : 'الإجابة خاطئة'}
                                            </span>
                                        </div>
                                        {!isCorrect && (
                                            <div className="mt-4">
                                                <p className="text-slate-700 font-black text-base mb-2">
                                                    الإجابة الصحيحة :
                                                </p>
                                                <p className="text-slate-600 font-bold text-sm leading-relaxed mb-6">
                                                    لوريم إيبسوم دولار سيت أميت نيسيوت دونك، دونك دولار نوسترو يوت بيريتيتيس. سيت. أولامكو ديكتوم دولار سيد كونسيكوات. رييبوديامت كويرات سيد إكس فوليام نويس دولار كونسيكوات. ماغنيت، كونسيفيكات كومودو فوليام نوستراد فوليام أيت كويرات. فوليام سيت لومينيير لابوريس ديتيكتورمي ليجاتوس أولامكو أليكويب نيس
                                                </p>

                                                <button
                                                    onClick={() => navigate('/explanation')}
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

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={handleNext}
                        disabled={currentQuestion === totalQuestions - 1}
                        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-8 py-4 rounded-2xl font-black text-lg transition-all"
                    >
                        <ChevronLeft size={20} className="rotate-180" />
                        التالي
                    </button>

                    <button
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

