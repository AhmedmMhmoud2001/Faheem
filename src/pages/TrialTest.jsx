import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/Container';
import { FileText, Clock, Target, TrendingUp } from 'lucide-react';

const TrialTest = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: FileText,
            value: '24 سؤال',
            description: 'اختبار شامل يغطي جميع المواضيع',
            iconBg: 'bg-yellow-50',
            iconColor: 'text-yellow-600'
        },
        {
            icon: Clock,
            value: '45 دقيقة',
            description: 'مؤقت زمني لمحاكاة الاختبار الحقيقي',
            iconBg: 'bg-yellow-50',
            iconColor: 'text-yellow-600'
        },
        {
            icon: Target,
            value: 'مستويات متنوعة',
            description: 'أسئلة من جميع مستويات الصعوبة',
            iconBg: 'bg-yellow-50',
            iconColor: 'text-yellow-600'
        },
        {
            icon: TrendingUp,
            value: 'تقرير تفصيلي',
            description: 'تحليل شامل للأداء والنتائج',
            iconBg: 'bg-yellow-50',
            iconColor: 'text-yellow-600'
        }
    ];

    const instructions = [
        'يحتوي الاختبار على 24 سؤال من مواضيع ومستويات مختلفة',
        'المدة المحددة للاختبار 45 دقيقة',
        'يمكنك التنقل بين الأسئلة خلال الاختبار',
        'عند انتهاء الوقت سيتم إرسال الإجابات تلقائيا',
        'ستحصل على تقرير تفصيلي بعد الانتهاء'
    ];

    const handleStartTest = () => {
        navigate('/exam/trial/1');
    };

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
                {/* Test Title Section */}
                <div className="text-center mb-16 relative z-10">
                    <div className="flex items-center justify-center gap-6 mb-6">
                        <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center">
                            <FileText className="text-white" size={32} />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-slate-900">
                            الاختبار التجريبي الشامل
                        </h1>
                    </div>
                    <p className="text-xl text-slate-600 font-bold max-w-3xl mx-auto">
                        جرب نفسك في اختبار كامل يحاكي الاختبار الحقيقي
                    </p>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16 relative z-10">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:border-yellow-400 transition-all"
                        >
                            <div className="flex items-start gap-4">
                                <div className={`${feature.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0`}>
                                    <feature.icon className={feature.iconColor} size={32} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-black text-slate-900 mb-2">
                                        {feature.value}
                                    </h3>
                                    <p className="text-slate-600 font-bold text-sm">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Test Instructions */}
                <div className="max-w-4xl mx-auto mb-12 relative z-10">
                    <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-100">
                        <h2 className="text-3xl font-black text-slate-900 mb-8">
                            تعليمات الاختبار
                        </h2>
                        <ul className="space-y-4">
                            {instructions.map((instruction, idx) => (
                                <li key={idx} className="flex items-start gap-4">
                                    <div className="w-2 h-2 bg-slate-900 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-slate-600 font-bold text-lg flex-1">
                                        {instruction}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Start Test Button */}
                <div className="text-center mb-8 relative z-10">
                    <button
                        onClick={handleStartTest}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-16 py-5 rounded-2xl font-black text-xl transition-all transform hover:-translate-y-1 shadow-xl"
                    >
                        ابدأ الاختبار
                    </button>
                </div>

                {/* Tip */}
                <div className="text-center relative z-10">
                    <p className="text-slate-500 font-bold text-sm">
                        نصيحة: تأكد من وجود وقت كاف لديك ومن عدم وجود مشتتات قبل البدء
                    </p>
                </div>
            </Container>
        </div>
    );
};

export default TrialTest;

