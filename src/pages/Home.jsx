import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import FeatureOverview from '../components/FeatureOverview';
import TestSection from '../components/TestSection';
import AboutSection from '../components/AboutSection';
import VideoSection from '../components/VideoSection';
import FAQSection from '../components/FAQSection';
import Testimonials from '../components/Testimonials';
import ContactSection from '../components/ContactSection';
import Container from '../components/Container';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        if (location.hash) {
            const element = document.getElementById(location.hash.slice(1));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [location]);

    const handleStartClick = () => {
        if (isLoggedIn) {
            navigate('/dashboard');
        } else {
            navigate('/register');
        }
    };

    return (
        <>
            <Hero onStartClick={handleStartClick} />

            {/* Feature Overview Section
            <FeatureOverview /> */}

            {/* 1. Test Section (Contains Stats + "اختبر نفسك") */}
            <TestSection />

            {/* 2. Why Us Section ("ما الذي يميزنا؟") */}
            <section className="bg-white relative overflow-hidden py-4 md:py-6" dir="rtl">
                <Container className="text-center">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-10 md:mb-12">
                        ما الذي يميزنا؟
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
                        {[
                            'اختبارات تجريبية غير محدودة',
                            'تجربة مجانية لمدة 7 أيام',
                            'تقارير تفصيلية للأداء',
                            'الوصول الكامل لجميع الأسئلة'
                        ].map((text, idx) => (
                            <div key={idx} className="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-slate-50 hover:border-yellow-400 transition-all cursor-default text-center">
                                <span className="text-xl md:text-2xl font-black text-slate-800">{text}</span>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* 3. About Us Section ("الفهيم") */}
            <AboutSection />

            {/* 4. Video Tutorial Section ("كيف تعمل منصتنا؟") */}
            <VideoSection />

            {/* 5. Frequently Asked Questions Section ("الأسئلة الأكثر شيوعا") */}
            <FAQSection />

            {/* 6. Contact Us Directly Section ("تواصل معنا") */}
            <ContactSection />

            {/* 7. Student Success Stories Section ("يقول طلابنا") */}
            <Testimonials />
        </>
    );
};

export default Home;
