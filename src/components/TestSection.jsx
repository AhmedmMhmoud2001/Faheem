import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import Container from './Container';
import { FileText, ClipboardCheck, BookOpen } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { api, resolveMediaUrl } from '../lib/api.js';

const DEFAULT_IMG =
    'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop';

function pickLang(isEn, ar, en) {
    if (isEn) return (en && String(en).trim()) || ar || '';
    return ar || '';
}

const TestSection = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { isLoggedIn } = useAuth();
    const [remote, setRemote] = useState(null);

    useEffect(() => {
        api
            .get('/home-stats')
            .then((r) => setRemote(r.data))
            .catch(() => setRemote(null));
    }, []);

    const isEn = i18n.language?.startsWith('en');
    const isRtl = i18n.dir() === 'rtl';

    const stats = useMemo(() => {
        const icons = [FileText, ClipboardCheck, BookOpen];
        if (!remote) {
            return [
                { labelKey: 'testSection.statQuestions', value: '+1000', Icon: FileText },
                { labelKey: 'testSection.statQuant', value: '100%', Icon: ClipboardCheck },
                { labelKey: 'testSection.statTopics', value: '4', Icon: BookOpen },
            ];
        }
        const fallbackLabels = ['testSection.statQuestions', 'testSection.statQuant', 'testSection.statTopics'];
        return [1, 2, 3].map((n, idx) => {
            const rawLabel = pickLang(isEn, remote[`stat${n}LabelAr`], remote[`stat${n}LabelEn`]);
            return {
                label: rawLabel.trim() ? rawLabel : t(fallbackLabels[idx]),
                value: (remote[`stat${n}Value`] && String(remote[`stat${n}Value`]).trim()) || ['+1000', '100%', '4'][idx],
                Icon: icons[idx],
            };
        });
    }, [remote, isEn, t]);

    const title = useMemo(() => {
        if (!remote) return t('testSection.title');
        const v = pickLang(isEn, remote.titleAr, remote.titleEn);
        return v.trim() || t('testSection.title');
    }, [remote, isEn, t]);

    const body = useMemo(() => {
        if (!remote) return t('testSection.body');
        const v = pickLang(isEn, remote.bodyAr, remote.bodyEn);
        return v.trim() || t('testSection.body');
    }, [remote, isEn, t]);

    const cta = useMemo(() => {
        if (!remote) return t('testSection.cta');
        const v = pickLang(isEn, remote.ctaAr, remote.ctaEn);
        return v.trim() || t('testSection.cta');
    }, [remote, isEn, t]);

    const imageAlt = useMemo(() => {
        if (!remote) return t('testSection.imageAlt');
        const v = pickLang(isEn, remote.imageAltAr, remote.imageAltEn);
        return v.trim() || t('testSection.imageAlt');
    }, [remote, isEn, t]);

    const imgSrc = useMemo(() => {
        const u = remote?.imageUrl?.trim();
        if (!u) return DEFAULT_IMG;
        return resolveMediaUrl(u) || u || DEFAULT_IMG;
    }, [remote]);

    const handleStartTest = () => {
        if (isLoggedIn) {
            navigate('/dashboard');
        } else {
            navigate('/register');
        }
    };

    return (
        <section className="bg-slate-50/30 py-4 md:py-6" dir={i18n.dir()}>
            <Container>
                <div className="mb-12">
                    <Swiper
                        key={i18n.language}
                        dir={i18n.dir()}
                        modules={[Autoplay]}
                        spaceBetween={24}
                        slidesPerView={1}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        breakpoints={{
                            640: { slidesPerView: 3 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="py-4"
                    >
                        {stats.map((stat, idx) => {
                            const label = stat.labelKey ? t(stat.labelKey) : stat.label;
                            const value = stat.value;
                            const Icon = stat.Icon;
                            return (
                                <SwiperSlide key={idx}>
                                    <div
                                        className={`rounded-3xl p-2 flex ${isRtl ? 'flex-row-reverse' : 'flex-row'} items-center justify-center group hover:bg-[#00A651] transition-all duration-300 bg-white shadow-sm md:shadow-none`}
                                    >
                                        <div className={isRtl ? 'text-right' : 'text-left'}>
                                            <div className="text-2xl md:text-3xl font-black text-slate-900 group-hover:text-slate-900">{value}</div>
                                            <div className="text-slate-400 font-bold text-xs md:text-sm group-hover:text-slate-800">{label}</div>
                                        </div>
                                        <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-900 p-2 m-2 md:m-3 rounded-2xl flex items-center justify-center text-white group-hover:bg-slate-900 group-hover:text-[#00A651] transition-all">
                                            <Icon size={22} className="md:w-7 md:h-7" />
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>

                <div className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-slate-100 flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-14">
                    <div className={`flex-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 md:mb-6 leading-tight whitespace-pre-wrap">{title}</h2>
                        <p className="text-slate-500 text-base md:text-lg leading-relaxed mb-6 md:mb-8 font-bold opacity-80 whitespace-pre-wrap">{body}</p>
                        <button
                            type="button"
                            onClick={handleStartTest}
                            className="w-full md:w-auto bg-white hover:bg-slate-900 hover:text-white px-8 md:px-10 py-3.5 md:py-4 rounded-2xl font-black text-base md:text-lg transition-all transform hover:-translate-y-1 active:scale-95 shadow-lg shadow-green-200/50"
                        >
                            {cta}
                        </button>
                    </div>

                    <div className="flex-1 w-full">
                        <div className="rounded-[2rem] overflow-hidden aspect-video lg:aspect-4/3 relative group">
                            <img src={imgSrc} alt={imageAlt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-[#00A651]/5 group-hover:bg-transparent transition-all" />
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default TestSection;
