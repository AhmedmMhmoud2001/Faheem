import React from 'react';
import Container from './Container';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Testimonials = () => {
    const reviews = [
        {
            name: "رانيا عبدالله",
            role: "المرحلة الثانوية",
            image: "https://i.pravatar.cc/150?u=r1",
            text: "لوريم ايبسوم دولار سيت اميت هوزيلام جيكتوم سيت ايكويب ايروتي دو دو كونسيفيكتات دولار بوت كويرات توب اليكويب ايتم باسمود فيليتيات."
        },
        {
            name: "أحمد محمد",
            role: "المرحلة الثانوية",
            image: "https://i.pravatar.cc/150?u=r2",
            text: "لوريم ايبسوم دولار سيت اميت هوزيلام جيكتوم سيت ايكويب ايروتي دو دو كونسيفيكتات دولار بوت كويرات توب اليكويب ايتم باسمود فيليتيات."
        },
        {
            name: "سارة أحمد",
            role: "المرحلة الثانوية",
            image: "https://i.pravatar.cc/150?u=r3",
            text: "لوريم ايبسوم دولار سيت اميت هوزيلام جيكتوم سيت ايكويب ايروتي دو دو كونسيفيكتات دولار بوت كويرات توب اليكويب ايتم باسمود فيليتيات."
        },
        {
            name: "محمود خالد",
            role: "المرحلة الثانوية",
            image: "https://i.pravatar.cc/150?u=r4",
            text: "لوريم ايبسوم دولار سيت اميت هوزيلام جيكتوم سيت ايكويب ايروتي دو دو كونسيفيكتات دولار بوت كويرات توب اليكويب ايتم باسمود فيليتيات."
        },
        {
            name: "نور الهدى",
            role: "المرحلة الثانوية",
            image: "https://i.pravatar.cc/150?u=r5",
            text: "لوريم ايبسوم دولار سيت اميت هوزيلام جيكتوم سيت ايكويب ايروتي دو دو كونسيفيكتات دولار بوت كويرات توب اليكويب ايتم باسمود فيليتيات."
        }
    ];

    return (
        <section className="py-12 md:py-16" dir="rtl">
            <Container>
                <div className="flex flex-col lg:flex-row-reverse gap-10 md:gap-16 items-center h-full py-8 md:py-12 bg-amber-50 px-6 md:px-12 rounded-[2rem] md:rounded-[3rem]">

                    {/* Testimonials Swiper */}
                    <div className="w-full lg:max-w-3xl">
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            spaceBetween={20}
                            slidesPerView={1}
                            pagination={{
                                clickable: true,
                            }}
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: false,
                            }}
                            breakpoints={{
                                640: {
                                    slidesPerView: 1,
                                    spaceBetween: 20,
                                },
                                768: {
                                    slidesPerView: 2,
                                    spaceBetween: 20,
                                },
                                1024: {
                                    slidesPerView: 3,
                                    spaceBetween: 24,
                                },
                            }}
                            className="testimonials-swiper !pb-12"
                        >
                            {reviews.map((review, idx) => (
                                <SwiperSlide key={idx}>
                                    <div className="bg-white p-6 md:p-8 rounded-2xl border-slate-50 relative group hover:border-yellow-400 transition-all min-h-[280px] flex flex-col justify-between">
                                        {/* Quote Icon */}
                                        <div className="absolute -top-3 left-6 md:left-8 bg-[#FFD131] w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-slate-900 shadow-lg shadow-yellow-200 z-50">
                                            <span className="text-xl md:text-2xl font-black mt-1">"</span>
                                        </div>

                                        <p className="text-slate-600 font-bold text-xs md:text-sm leading-relaxed mb-6 opacity-80 pt-4">
                                            {review.text}
                                        </p>

                                        <div className="flex items-center gap-3 md:gap-4 mt-auto">
                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full  border-2 border-slate-50">
                                                <img src={review.image} alt={review.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="text-right">
                                                <div className="font-black text-slate-800 text-sm md:text-base">{review.name}</div>
                                                <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-tighter">{review.role}</div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* Header Side */}
                    <div className="flex flex-col text-right lg:flex-1">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 md:mb-6">يقول طلابنا..</h2>
                        <p className="text-slate-500 font-bold leading-relaxed opacity-70 text-sm md:text-base">
                            استمتع بمباشرة عن طلابنا الذين نجحوا مع التزامهم ومشاركتهم القوية من خلال منصة الدورات التدريبية عبر الإنترنت.
                        </p>
                    </div>

                </div>
                {/* <div className="swiper-pagination-custom flex justify-center gap-2 mt-12"></div> */}

            </Container>

            {/* Custom Styles for Swiper */}
            {/* <style jsx>{`
                .swiper-pagination-bullet-custom {
                    width: 8px;
                    height: 8px;
                    background: #cbd5e1;
                    border-radius: 9999px;
                    transition: all 0.3s;
                    opacity: 1;
                    cursor: pointer;
                }
                
                .swiper-pagination-bullet-active-custom {
                    width: 32px;
                    background: #FFD131;
                }
            `}</style> */}
        </section>
    );
};

export default Testimonials;
