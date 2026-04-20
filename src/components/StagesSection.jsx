import React from 'react';
import { UserPlus, Search, ShoppingBag, CheckCircle } from 'lucide-react';
import Container from './Container';

const StagesSection = () => {
    const stages = [
        {
            title: "إنشاء حساب",
            description: "ابدأ رحلتك بإنشاء حسابك الخاص على منصة الفهيم لتتمكن من الوصول لجميع المميزات.",
            icon: <UserPlus size={32} />,
            color: "bg-blue-500"
        },
        {
            title: "تصفح المنتجات",
            description: "استعرض آلاف المنتجات بالجملة من أفضل المصانع والموردين في مختلف القطاعات.",
            icon: <Search size={32} />,
            color: "bg-yellow-500"
        },
        {
            title: "تقديم الطلب",
            description: "بعد اختيار المنتجات المناسبة، يمكنك تقديم طلبك والتفاوض مباشرة مع الموردين.",
            icon: <ShoppingBag size={32} />,
            color: "bg-purple-500"
        },
        {
            title: "إتمام الصفقة",
            description: "استلم بضائعك بأمان مع ضمان حماية المدفوعات ومتابعة الشحن خطوة بخطوة.",
            icon: <CheckCircle size={32} />,
            color: "bg-green-500"
        }
    ];

    return (
        <section className="py-6 bg-white relative overflow-hidden" dir="rtl" id="stages">
            <Container>
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">المراحل</h2>
                    <p className="text-slate-500 text-xl font-bold max-w-2xl mx-auto">
                        تعرف على الخطوات البسيطة للبدء في استخدام منصة الفهيم وتحقيق صفقات تجارية ناجحة.
                    </p>
                    <div className="w-24 h-1.5 bg-[#00A651] mx-auto mt-8 rounded-full"></div>
                </div>

                <div className="relative">
                    {/* Connector Line (Desktop) */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 hidden lg:block z-0"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                        {stages.map((stage, idx) => (
                            <div key={idx} className="group">
                                <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50 transition-all duration-500 hover:-translate-y-4 flex flex-col items-center text-center h-full">
                                    <div className={`w-20 h-20 ${stage.color} text-white rounded-3xl flex items-center justify-center mb-8 shadow-lg transform rotate-3 group-hover:rotate-12 transition-transform`}>
                                        {stage.icon}
                                    </div>
                                    <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-black mb-4 -mt-12 border-4 border-white">
                                        {idx + 1}
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-4">{stage.title}</h3>
                                    <p className="text-slate-500 font-bold leading-relaxed">{stage.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default StagesSection;
