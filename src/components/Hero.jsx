import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Container from './Container';
import heroLaptop from '../assets/hero-laptop.png';
import iconshero from '../assets/decorative-icons.png';
import { api } from '../lib/api.js';

function pickLang(isEn, ar, en) {
    if (isEn) return (en && String(en).trim()) || ar || '';
    return ar || '';
}

const Hero = ({ onStartClick }) => {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.dir() === 'rtl';
    const [remote, setRemote] = useState(null);

    useEffect(() => {
        api
            .get('/hero')
            .then((r) => setRemote(r.data))
            .catch(() => setRemote(null));
    }, []);

    const isEn = i18n.language?.startsWith('en');

    const title = useMemo(() => {
        if (!remote) return t('hero.title');
        const v = pickLang(isEn, remote.titleAr, remote.titleEn);
        return v.trim() || t('hero.title');
    }, [remote, isEn, t]);

    const subtitle = useMemo(() => {
        if (!remote) return t('hero.subtitle');
        const v = pickLang(isEn, remote.subtitleAr, remote.subtitleEn);
        return v.trim() || t('hero.subtitle');
    }, [remote, isEn, t]);

    const howItWorks = useMemo(() => {
        if (!remote) return t('hero.howItWorks');
        const v = pickLang(isEn, remote.howItWorksAr, remote.howItWorksEn);
        return v.trim() || t('hero.howItWorks');
    }, [remote, isEn, t]);

    const startNow = useMemo(() => {
        if (!remote) return t('hero.startNow');
        const v = pickLang(isEn, remote.startNowAr, remote.startNowEn);
        return v.trim() || t('hero.startNow');
    }, [remote, isEn, t]);

    const laptopAlt = useMemo(() => {
        if (!remote) return t('hero.laptopAlt');
        const v = pickLang(isEn, remote.laptopAltAr, remote.laptopAltEn);
        return v.trim() || t('hero.laptopAlt');
    }, [remote, isEn, t]);

    return (
        <section className="relative bg-white overflow-hidden">
            <Container className="relative z-10 mt-4">
                <div
                    className="flex flex-col items-center gap-8 lg:gap-12 lg:flex-row-reverse lg:items-center"
                    dir="ltr"
                >
                    <div
                        className={`flex-1 relative w-full ${isRtl ? 'text-right' : 'text-left'}`}
                        dir={i18n.dir()}
                    >
                        <img
                            src={iconshero}
                            className="absolute hidden xl:block -top-[7.75rem] -right-4 w-[200px] md:w-[450px] lg:w-[650px] max-w-none opacity-40 md:opacity-100 pointer-events-none select-none z-0"
                            alt="decorative elements"
                        />
                        <div className="relative z-10">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-4 md:mb-6 whitespace-pre-wrap">
                                {title}
                            </h1>

                            <p className={`text-slate-600 text-sm md:text-base lg:text-lg leading-relaxed mb-6 md:mb-8 max-w-2xl font-medium ${isRtl ? 'ms-auto' : 'me-auto'} whitespace-pre-wrap`}>
                                {subtitle}
                            </p>

                            <div
                                className={`flex flex-wrap items-center gap-3 md:gap-4 mb-8 md:mb-12 ${
                                    isRtl ? 'justify-start' : 'justify-end'
                                }`}
                            >
                                <a
                                    href="/#how-it-works"
                                    className={`w-full md:w-auto flex items-center gap-3 bg-slate-100 hover:bg-slate-200 text-slate-800 px-6 py-2.5 md:px-8 md:py-3.5 rounded-2xl font-black text-sm md:text-base transition-all ${
                                        isRtl ? 'justify-start' : 'justify-end'
                                    }`}
                                >
                                    <span>{howItWorks}</span>
                                </a>

                                <button
                                    type="button"
                                    onClick={onStartClick}
                                    className={`w-full md:w-auto flex items-center gap-3 bg-[#00A651] hover:bg-slate-900 hover:text-white px-8 py-2.5 md:px-10 md:py-3.5 rounded-2xl font-black text-sm md:text-base transition-all transform hover:-translate-y-1 shadow-lg shadow-green-200/50 ${
                                        isRtl ? 'justify-start' : 'justify-end'
                                    }`}
                                >
                                    <ArrowRight size={18} className={isRtl ? 'rotate-180' : ''} />
                                    <span>{startNow}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Left Side: Laptop Image */}
                    <div className="flex-1 relative group w-full max-w-lg lg:max-w-none mx-auto">
                        <div className="relative z-10 transition-transform duration-700 group-hover:-translate-y-4 lg:-ms-20 xl:-ms-28">
                            <img
                                src={heroLaptop}
                                alt={laptopAlt}
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
