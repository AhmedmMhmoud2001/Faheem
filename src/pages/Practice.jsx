import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Container from '../components/Container';
import { ChevronRight, ChevronLeft, ArrowLeft } from 'lucide-react';
import imgbanner from '../assets/imgbanner.png';

const Practice = () => {
    const navigate = useNavigate();
    const { subject, level } = useParams();
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);
    // Mock Question Data
    const question = {
        id: 1,
        title: 'لوريم ايبسوم دولار سيت',
        image: imgbanner,
        options: [
            'لوريم ايبسوم دولار سيت أميت ليجاتوس إنفيدونت',
            'لوريم ايبسوم دولار سيت أميت إيليت، إت تيت إنترولي',
            'لوريم ايبسوم دولار سيت أميت إي لومينيير مينيم إي ريبيوديامت لومينيير فينيام، إنتروليكيشن !',
            'لوريم ايبسوم دولار سيت أميت فوليام كويرات ميوتيت تيت نوستراد لومينيير دو كونسيكتيتور ماج'
        ],
        correctAnswer: 1 // Index 1 (Option 2)
    };

    const handleAnswerSelect = (index) => {
        if (!showResult) {
            setSelectedAnswer(index);
            setShowResult(true);
        }
    };

    const handleNext = () => {
        // Since practice currently has one question, next should go to feedback/end flow
        navigate('/feedback');
    };

    const isCorrect = selectedAnswer === question.correctAnswer;

    return (
        <div className="min-h-screen bg-slate-50/50 py-12 relative font-sans" dir="rtl">
            <Container>
                {/* Header Title */}
                <div className="flex items-center justify-end gap-3 mb-8">
                    <h1 className="text-2xl font-black text-slate-800">{question.title}</h1>
                    <div className="w-3 h-3 bg-[#FFD131] rounded-full"></div>
                </div>

                {/* Hero Image */}
                <div className="w-full bg-slate-200 rounded-[3rem] overflow-hidden mb-12 shadow-sm">
                    <img
                        src={question.image}
                        alt="Question Illustration"
                        className="w-full h-auto object-cover max-h-[400px]"
                    />
                </div>

                {/* Options List */}
                <div className="space-y-4 mb-20">
                    {question.options.map((option, idx) => {
                        const isSelected = selectedAnswer === idx;
                        const isCorrectAnswer = idx === question.correctAnswer;

                        let cardStyle = "bg-white border-2 border-transparent shadow-sm";
                        let numberStyle = "bg-slate-50 text-slate-400 border border-slate-200";

                        if (showResult && isSelected) {
                            if (isCorrectAnswer) {
                                cardStyle = "bg-green-50 border-2 border-green-500";
                                numberStyle = "bg-green-500 text-white border border-green-500";
                            } else {
                                cardStyle = "bg-red-50 border-2 border-red-400"; // Red for wrong
                                numberStyle = "bg-red-400 text-white border border-red-400";
                            }
                        } else if (isSelected) {
                            cardStyle = "bg-[#fffbeb] border-2 border-[#FFD131]";
                            numberStyle = "bg-[#FFD131] text-slate-900 border border-[#FFD131]";
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleAnswerSelect(idx)}
                                disabled={showResult}
                                className={`w-full p-6 rounded-[2rem] flex items-center justify-between group transition-all duration-300 ${cardStyle} ${!showResult ? 'hover:border-slate-200' : ''}`}
                            >
                                <span className={`text-lg font-bold text-right flex-1 ${isSelected && showResult && !isCorrectAnswer ? 'text-red-900' : 'text-slate-700'}`}>
                                    {option}
                                </span>

                                <div className="mr-6">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-base transition-all ${numberStyle}`}>
                                        {idx + 1}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Footer Section */}
                <div className="space-y-8">
                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleNext}
                            className="flex items-center gap-3 bg-[#2d3342] hover:bg-slate-800 text-white px-10 py-3.5 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl"
                        >
                            <span>التالي</span>
                            <ArrowLeft size={20} />
                        </button>

                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-100 px-10 py-3.5 rounded-xl font-bold text-lg transition-all shadow-sm"
                        >
                            <span>رجوع</span>
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    {/* Result Feedback Section (Only if Wrong) */}
                    {showResult && !isCorrect && (
                        <div className="animate-in fade-in slide-in-from-top-4 space-y-4">
                            {/* Error Header */}
                            <div className="flex items-center font-black text-red-600 gap-2 text-sm">
                                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-red-600 rotate-90"></div>
                                <span>الإجابة خاطئة</span>
                            </div>

                            {/* Correct Answer Box */}
                            <div className="bg-[#e7f7ed] rounded-2xl p-6 border border-[#d1e7dd]">
                                <div className="mb-2">
                                    <span className="font-black text-slate-800 text-base block mb-2">الإجابة الصحيحة :</span>
                                    <p className="text-slate-700 font-bold text-sm leading-relaxed">
                                        لوريم ايبسوم دولار سيت أميت نيسيوت دونك، دونك، دولار نوسترو يوت بيريتيتيس. سيت. أولامكو ديكتوم دولار سيد كونسيكوات. رييبوديامت كويرات سيد إكس فوليام نويس دولار كونسيكوات. كونسيفيكات كومودو فوليام نوستراد.
                                    </p>
                                </div>
                            </div>

                            {/* Explanation Button */}
                            <button
                                onClick={() => navigate('/explanation')}
                                className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#FFD131] hover:bg-[#ffc800] text-slate-900 px-12 py-3.5 rounded-xl font-black text-lg transition-all shadow-lg shadow-yellow-100"
                            >
                                <div className="w-6 h-6 rounded-full border-2 border-slate-900 flex items-center justify-center">
                                    <span className="font-serif italic font-bold text-xs">i</span>
                                </div>
                                <span>الشرح</span>
                            </button>
                        </div>
                    )}
                </div>

            </Container>
        </div>
    );
};

export default Practice;
