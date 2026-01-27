import React from 'react';
import Container from './Container';

const AboutSection = () => {
    return (
        <section id="about" className="py-4 md:py-6 bg-white overflow-hidden ">
            <Container>
                <div className="flex flex-col lg:flex-row-reverse items-center gap-10 lg:gap-16 pt-20">



                    {/* Image Side */}
                    <div className="flex-1 lg:flex-2/5 relative">
                        <div className="relative flex items-center justify-center">
                            {/* Main Large Image */}
                            <div className="w-[85%] rounded-[2.5rem] overflow-hidden shadow-2xl z-10">
                                <img src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Student studying" />
                            </div>

                            {/* Yellow Badge */}
                            <div className="absolute -top-4 -right-4 z-30 bg-[#FFD131] text-slate-900 px-6 py-2 rounded-xl font-black text-lg md:text-xl shadow-xl rotate-2">
                                +20 سنة من الخبرة
                            </div>
                        </div>
                    </div>
                    {/* Text Side */}
                    <div className="flex-1 lg:flex-3/5 text-right">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 md:mb-6 tracking-tight">الفهيم</h2>
                        <p className="text-slate-600 text-base md:text-lg leading-relaxed font-bold mb-4 md:mb-6 opacity-80">
                            لوريم ايبسوم دولار سيت اميت هوزيلام جيكتوم سيت ايكويب ايروتي دو دو كونسيفيكتات دولار بوت كويرات توب اليكويب ايتم باسمود فيليتيات. كويرات تيكنيديونت ليتسيوت انتويديكتوم نويساراد دونك كويرات ايت اميت، واليميكو ايتروديكتوم جيوامي ميو ايبسوم الكروبيتيشين كومودو بورت نيسي كونسيكوات.
                        </p>
                    </div>

                </div>
            </Container>
        </section>
    );
};

export default AboutSection;
