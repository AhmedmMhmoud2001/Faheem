import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import Container from '../components/Container';

const Subscriptions = () => {
    const navigate = useNavigate();
    const plans = [
        {
            name: "الباقة الشهرية",
            price: "700",
            pricePerSession: "96",
            currency: "$",
            features: [
                "الوصول الكامل لجميع الأسئلة (+1000)",
                "اختبارات تجريبية غير محدودة",
                "تقارير تفصيلية للأداء",
                "إمكانية تحميل الاختبارات بصيغة PDF",
                "أسئلة جديدة شهرياً",
                "دعم فني متواصل"
            ]
        },
        {
            name: "الباقة السنوية",
            price: "1400",
            pricePerSession: "80",
            currency: "$",
            features: [
                "الوصول الكامل لجميع الأسئلة (+1000)",
                "اختبارات تجريبية غير محدودة",
                "تقارير تفصيلية للأداء",
                "إمكانية تحميل الاختبارات بصيغة PDF",
                "أسئلة جديدة شهرياً",
                "دعم فني متواصل"
            ]
        }
    ];

    const faqs = [
        {
            question: "هل يمكنني إلغاء الإشتراك؟",
            answer: "نعم، يمكنك إلغاء الاشتراك في أي وقت من إعدادات الحساب."
        },
        {
            question: "ما هي طرق الدفع المتاحة؟",
            answer: "نقبل جميع بطاقات الائتمان والخصم (VISA, MasterCard, Mada)."
        },
        {
            question: "هل يوجد ضمان لاسترداد المال؟",
            answer: "نعم، نوفر ضمان استرداد المال خلال 14 يوماً من الاشتراك."
        }
    ];

    const [openFaqIndex, setOpenFaqIndex] = useState(-1);

    return (
        <div className="bg-slate-50/50 min-h-screen py-6" dir="rtl">
            <Container>
                {/* Title */}
                <div className="text-right mb-12">
                    <h1 className="text-5xl font-black text-slate-900">أشترك معنا!</h1>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {plans.map((plan, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-[2rem] p-6 m-6 shadow-sm border border-slate-100 hover:border-yellow-400 transition-all"
                        >
                            {/* Price Badge */}
                            <div className="bg-[#FFD131] rounded-2xl py-3 px-6 mb-6 text-center">
                                <span className="text-3xl font-black text-slate-900">
                                    {plan.currency}{plan.price}
                                </span>
                            </div>

                            {/* Price per Session */}
                            <div className="text-right mb-4">
                                <span className="text-2xl font-black text-slate-900">
                                    {plan.currency}{plan.pricePerSession} /الحصة
                                </span>
                            </div>

                            {/* Tax Notice */}
                            <p className="text-right text-red-500 font-bold text-sm mb-8">
                                الأسعار المذكورة غير شاملة الضريبة
                            </p>
                            <hr className='text-slate-200 mb-6 -mt-4' />

                            {/* Features List */}
                            <div className="space-y-3 mb-8">
                                {plan.features.map((feature, fIdx) => (
                                    <div key={fIdx} className="flex items-center gap-3">
                                        <Check size={20} className="text-green-600 flex-shrink-0" strokeWidth={3} />
                                        <span className="text-slate-700 font-bold text-base">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Subscribe Button */}
                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-black text-lg transition-all shadow-lg"
                            >
                                اشترك الآن!
                            </button>
                        </div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="mt-16">
                    <h2 className="text-3xl font-black text-slate-900 mb-8 text-right">الأسئلة الشائعة</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? -1 : idx)}
                                    className="w-full p-5 text-right font-black text-lg text-slate-900 hover:text-yellow-500 transition-colors"
                                >
                                    {faq.question}
                                </button>
                                {openFaqIndex === idx && (
                                    <div className="px-5 pb-5">
                                        <p className="text-slate-600 font-bold leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Subscriptions;
