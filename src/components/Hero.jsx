import React from 'react';
import { ArrowRight } from 'lucide-react';
import Container from './Container';
import heroLaptop from '../assets/hero-laptop.png';
import iconshero from '../assets/decorative-icons.png';

const Hero = ({ onStartClick }) => {
    return (
        <section className="relative bg-white overflow-hidden" dir="ltr">
            <Container className="relative z-10 mt-4">
                <div className="flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-12">
                    {/* Right Side: Text Content */}
                    <div className="flex-1 text-right relative">
                        <img
                            src={iconshero}
                            className="absolute hidden xl:block -top-31 -right-4 w-[200px] md:w-[450px] lg:w-[650px] max-w-none opacity-40 md:opacity-100 pointer-events-none select-none z-0"
                            alt="decorative elements"
                        />
                        <div className="relative z-10">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-4 md:mb-6">
                                تعلم في أي وقت و من أي مكان !
                            </h1>

                            <p className="text-slate-600 text-sm md:text-base lg:text-lg leading-relaxed mb-6 md:mb-8 max-w-2xl font-medium ml-auto">
                                استمتع بالوصول إلى مئات الدورات التدريبية عالية الجودة التي يقدمها مدربون محترفون، صممت لمساعدتك على إتقان مهارات جديدة وتحقيق معرفتك، وتفتح المزيد من الفرص لتطوير وتحقيق أهدافك الشخصية.
                            </p>

                            <div className="flex flex-wrap items-center justify-end gap-3 md:gap-4 mb-8 md:mb-12">
                                <a href="/#how-it-works" className="w-full md:w-auto flex items-center justify-center gap-3 bg-slate-100 hover:bg-slate-200 text-slate-800 px-6 py-2.5 md:px-8 md:py-3.5 rounded-2xl font-black text-sm md:text-base transition-all">
                                    <span>كيف تعمل ؟</span>
                                </a>

                                <button
                                    onClick={onStartClick}
                                    className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#FFD131] hover:bg-slate-900 hover:text-white px-8 py-2.5 md:px-10 md:py-3.5 rounded-2xl font-black text-sm md:text-base transition-all transform hover:-translate-y-1 shadow-lg shadow-yellow-200/50"
                                >
                                    <ArrowRight size={18} className="rotate-180" />
                                    <span>ابدأ الآن</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Left Side: Laptop Image */}
                    <div className="flex-1 relative group w-full max-w-lg lg:max-w-none mx-auto">
                        <div className="relative z-10 transition-transform duration-700 group-hover:-translate-y-4 absolute -left-18">
                            <img
                                src={heroLaptop}
                                alt="الفهيم منصة التعلم"
                                className="w-full h-auto drop-shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default Hero;
