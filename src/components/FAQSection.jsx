import React, { useState } from 'react';
import { ChevronDown, ChevronUp, DotIcon } from 'lucide-react';
import Container from './Container';

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            question: "لوريم ايبسوم دولار سيت اميت نيسيبوت جولتكو؟",
            answer: "لوريم ايبسوم دولار سيت اميت هوزيلام جيكتوم سيت ايكويب ايروتي دو دو كونسيفيكتات دولار بوت كويرات توب اليكويب ايتم باسمود فيليتيات."
        },
        {
            question: "لوريم ايبسوم دولار سيت اميت نيسيبوت جولتكو؟",
            answer: "لوريم ايبسوم دولار سيت اميت هوزيلام جيكتوم سيت ايكويب ايروتي دو دو كونسيفيكتات دولار بوت كويرات توب اليكويب ايتم باسمود فيليتيات."
        },
        {
            question: "لوريم ايبسوم دولار سيت اميت نيسيبوت جولتكو؟",
            answer: "لوريم ايبسوم دولار سيت اميت هوزيلام جيكتوم سيت ايكويب ايروتي دو دو كونسيفيكتات دولار بوت كويرات توب اليكويب ايتم باسمود فيليتيات."
        },
        {
            question: "لوريم ايبسوم دولار سيت اميت نيسيبوت جولتكو؟",
            answer: "لوريم ايبسوم دولار سيت اميت هوزيلام جيكتوم سيت ايكويب ايروتي دو دو كونسيفيكتات دولار بوت كويرات توب اليكويب ايتم باسمود فيليتيات."
        },
        {
            question: "لوريم ايبسوم دولار سيت اميت نيسيبوت جولتكو؟",
            answer: "لوريم ايبسوم دولار سيت اميت هوزيلام جيكتوم سيت ايكويب ايروتي دو دو كونسيفيكتات دولار بوت كويرات توب اليكويب ايتم باسمود فيليتيات."
        }
    ];

    return (
        <section id="faq" className="py-4 md:py-6 bg-white" dir="rtl">
            <Container>
                <div className="flex flex-col lg:flex-row-reverse gap-10 md:gap-16">

                    {/* FAQ List */}
                    <div className="flex-1 space-y-3">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="bg-white rounded-xl md:rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all">
                                <button
                                    onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                                    className="w-full p-2 text-right flex items-center justify-between group"
                                >
                                    <span className="flex justify-between items-center w-full text-lg md:text-xl font-black text-slate-800 group-hover:text-yellow-500 transition-colors gap-2">
                                        <div className="flex items-center">
                                            <DotIcon size={40} md:size={60} />
                                            {faq.question}
                                        </div>
                                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-900 flex items-center justify-center text-slate-100 group-hover:bg-yellow-400 group-hover:text-slate-900 transition-all">
                                            {openIndex === idx ? <ChevronUp size={18} md:size={20} /> : <ChevronDown size={18} md:size={20} />}
                                        </div>

                                    </span>
                                </button>
                                {openIndex === idx && (
                                    <div className="px-4 md:px-6 pb-4 md:pb-6 pt-0">
                                        <div className="h-px bg-slate-900/5 mb-4 md:mb-6"></div>
                                        <p className="text-slate-500 text-sm md:text-base font-bold leading-relaxed pr-8 md:pr-12">
                                            {faq.answer}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Header */}
                    <div className="flex-[0.8] text-right self-start lg:self-center">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-4">
                            <span className="text-[#FFD131]">الأسئلة</span> الأكثر شيوعا
                        </h2>
                        <p className="text-slate-400 font-bold text-base md:text-lg mb-6 md:mb-8 max-w-md ml-auto">
                            لوريم ايبسوم دولار سيت اميت هوزيلام جيكتوم سيت ايكويب ايروتي دو دو كونسيفيكتات.
                        </p>
                    </div>

                </div>
            </Container>
        </section>
    );
};

export default FAQSection;
