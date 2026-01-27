import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Container from '../components/Container';
import { ClipboardList, Check, X } from 'lucide-react';

const ExamResult = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Default values if no state is passed (for preview/dev)
    const {
        score = 16,
        totalQuestions = 24,
        correctCount = 16,
        wrongCount = 8,
        answers = [] // Array of booleans or status 'correct'/'wrong'
    } = location.state || {};

    // Generate mock dots if no real data
    const resultDots = answers.length > 0 ? answers : Array(24).fill(null).map((_, i) => i < 8 ? 'wrong' : 'correct');

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 font-sans" dir="rtl">
            <Container>
                {/* Main Card */}
                <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-100 text-center max-w-5xl mx-auto">

                    {/* Header Section */}
                    <div className="mb-12">
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">
                            لقد حصلت على <span className="text-[#FFD131]">{correctCount}</span> من <span className="text-slate-900">{totalQuestions}</span> صحيح
                        </h1>
                        <p className="text-lg md:text-xl text-slate-500 font-bold leading-relaxed max-w-4xl mx-auto">
                            كان هذا مجرد مثال موجز. يحتوي اختبار النظرية في هيئة الطرق والنقل على 45 سؤالاً وسنحتاج إلى 38 إجابة صحيحة على الأقل لتجاوز الاختبار. ابدأ التحضير اليوم مع مجموعة كاملة من اختبارات النظرية ودورة نظرية شاملة!
                        </p>
                    </div>

                    {/* Notes Section */}
                    <div className="mb-16 text-right">
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                            <div className="relative">
                                <ClipboardList size={40} className="text-slate-300" />
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center text-white">
                                    <Check size={12} strokeWidth={4} />
                                </div>
                                <div className="absolute -top-1 -left-1 w-5 h-5 bg-red-400 rounded-full border-2 border-white flex items-center justify-center text-white">
                                    <X size={12} strokeWidth={4} />
                                </div>
                            </div>
                            <h2 className="text-3xl font-black text-slate-800">ملاحظات</h2>
                        </div>

                        <div className="flex items-start gap-3 pr-4">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#FFD131] mt-2.5 flex-shrink-0"></div>
                            <p className="text-lg md:text-xl text-slate-600 font-bold leading-relaxed">
                                محاولة جيدة، لكن للأسف ارتكبت الكثير من الأخطاء. ستحتاج إلى المزيد من الممارسة لتكون مستعدًا للصفقة الحقيقية. نوصي بشراء الوصول والبدء في الممارسة اليوم!
                            </p>
                        </div>
                    </div>

                    {/* Results Visual Section */}
                    <div className="text-right">
                        <h2 className="text-3xl font-black text-slate-800 mb-8 border-b border-slate-100 pb-4 inline-block pl-8">إجابتك</h2>

                        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 mb-8">
                            <div className="flex items-center gap-6">
                                <span className="text-2xl font-black text-red-500">{wrongCount} إجابة خاطئة</span>
                                <span className="text-sm font-bold text-slate-400">*حد أقصى 2 أخطاء</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className="text-2xl font-black text-green-500">{correctCount} إجابة صحيحة</span>
                                <span className="text-sm font-bold text-slate-400">*38 لتجاوز الاختبار</span>
                            </div>
                        </div>

                        {/* Dots Grid */}
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start bg-slate-50 p-6 rounded-3xl">
                            {resultDots.map((status, index) => (
                                <div
                                    key={index}
                                    className={`w-8 h-8 rounded-full border-2 transition-all ${status === 'wrong'
                                            ? 'bg-red-300 border-red-300'
                                            : 'bg-green-300/50 border-green-300'
                                        }`}
                                    title={`Question ${index + 1}: ${status === 'correct' ? 'Correct' : 'Wrong'}`}
                                ></div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons (Optional but recommended) */}
                    <div className="mt-12 flex justify-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
                        >
                            العودة للرئيسية
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-[#FFD131] text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-[#ffc800] transition-colors"
                        >
                            إعادة المحاولة
                        </button>
                    </div>

                </div>
            </Container>
        </div>
    );
};

export default ExamResult;
