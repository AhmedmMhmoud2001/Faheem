import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import TestSection from '../components/TestSection';
import AboutSection from '../components/AboutSection';
import VideoSection from '../components/VideoSection';
import FAQSection from '../components/FAQSection';
import Testimonials from '../components/Testimonials';
import ContactSection from '../components/ContactSection';
import WhyUsSection from '../components/WhyUsSection';
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

            <WhyUsSection />

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
