import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Container from './Container';
import { FileText, ClipboardCheck, BookOpen } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const TestSection = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    const handleStartTest = () => {
        if (isLoggedIn) {
            navigate('/dashboard');
        } else {
            navigate('/register');
        }
    };

    return (
        <section className="bg-slate-50/30 py-4 md:py-6" dir="rtl">
            <Container>
                {/* Stats Bar */}
                <div className="mb-12">
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={24}
                        slidesPerView={1}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        breakpoints={{
                            640: { slidesPerView: 3 },
                            1024: { slidesPerView: 3 }
                        }}
                        className="py-4"
                    >
                        {[
                            { label: 'سؤال', value: '+1000', Icon: FileText },
                            { label: 'محاكي للإمتحان الكمية', value: '100%', Icon: ClipboardCheck },
                            { label: 'مواضيع', value: '4', Icon: BookOpen },
                        ].map((stat, idx) => (
                            <SwiperSlide key={idx}>
                                <div className="rounded-3xl p-2 flex flex-row-reverse items-center justify-center group hover:bg-yellow-400 transition-all duration-300 bg-white shadow-sm md:shadow-none">
                                    <div className="text-right">
                                        <div className="text-2xl md:text-3xl font-black text-slate-900 group-hover:text-slate-900">{stat.value}</div>
                                        <div className="text-slate-400 font-bold text-xs md:text-sm group-hover:text-slate-800">{stat.label}</div>
                                    </div>
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-900 p-2 m-2 md:m-3 rounded-2xl flex items-center justify-center text-white group-hover:bg-slate-900 group-hover:text-yellow-400 transition-all">
                                        <stat.Icon size={22} className="md:w-7 md:h-7" />
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-slate-100 flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-14">
                    <div className="flex-1 text-right">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 md:mb-6 leading-tight">
                            اختبر نفسك و حدد مستواك
                        </h2>
                        <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-6 md:mb-8 font-bold opacity-80">
                            لوريم ايبسوم دولار سيت اميت هوزيلام جيكتوم سيت ايكويب ايروتي دو دو كونسيفيكتات دولار بوت كويرات توب اليكويب ايتم باسمود فيليتيات. كويرات تيكنيديونت ليتسيوت انتويديكتوم نويساراد دونك كويرات ايت اميت.
                        </p>
                        <button
                            onClick={handleStartTest}
                            className="w-full md:w-auto bg-white hover:bg-slate-900 hover:text-white px-8 md:px-10 py-3.5 md:py-4 rounded-2xl font-black text-base md:text-lg transition-all transform hover:-translate-y-1 active:scale-95 shadow-lg shadow-yellow-200/50"
                        >
                            ابدأ الاختبار الآن
                        </button>
                    </div>

                    <div className="flex-1 w-full">
                        <div className="rounded-[2rem] overflow-hidden aspect-video lg:aspect-4/3 relative group">
                            <img
                                src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop"
                                alt="تحديد المستوى"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-yellow-400/5 group-hover:bg-transparent transition-all"></div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default TestSection;
