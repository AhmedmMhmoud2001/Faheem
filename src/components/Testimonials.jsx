import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Container from './Container';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { api, resolveMediaUrl } from '../lib/api.js';

function pickLang(primary, fallback) {
    const p = primary?.trim();
    return p || fallback?.trim() || '';
}

const Testimonials = () => {
    const { t, i18n } = useTranslation();
    const isEn = i18n.language?.toLowerCase().startsWith('en');
    const [payload, setPayload] = useState(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const { data } = await api.get('/testimonials');
                if (!cancelled) setPayload(data);
            } catch {
                if (!cancelled) setPayload(null);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const { title, subtitle, reviews } = useMemo(() => {
        const s = payload?.settings;
        const items = Array.isArray(payload?.items) ? payload.items : [];
        const titleText = s
            ? isEn
                ? pickLang(s.titleEn, s.titleAr)
                : pickLang(s.titleAr, s.titleEn)
            : t('testimonials.title');
        const subtitleText = s
            ? isEn
                ? pickLang(s.subtitleEn, s.subtitleAr)
                : pickLang(s.subtitleAr, s.subtitleEn)
            : t('testimonials.subtitle');
        const mapped = items.map((row, i) => {
            const name = isEn ? pickLang(row.nameEn, row.nameAr) : pickLang(row.nameAr, row.nameEn);
            const role = isEn ? pickLang(row.roleEn, row.roleAr) : pickLang(row.roleAr, row.roleEn);
            const text = isEn ? pickLang(row.textEn, row.textAr) : pickLang(row.textAr, row.textEn);
            let image = row.imageUrl?.trim()
                ? resolveMediaUrl(row.imageUrl)
                : `https://i.pravatar.cc/150?u=${encodeURIComponent(name || String(row.id || i))}`;
            return { id: row.id, name, role, text, image };
        });
        if (mapped.length === 0) {
            const fallback = [0, 1, 2, 3, 4].map((idx) => ({
                id: `fb-${idx}`,
                name: t(`testimonials.reviews.${idx}.name`),
                role: t(`testimonials.reviews.${idx}.role`),
                text: t(`testimonials.reviews.${idx}.text`),
                image: `https://i.pravatar.cc/150?u=r${idx + 1}`,
            }));
            return { title: titleText, subtitle: subtitleText, reviews: fallback };
        }
        return { title: titleText, subtitle: subtitleText, reviews: mapped };
    }, [payload, isEn, t]);

    return (
        <section className="py-12 md:py-16" dir={i18n.dir()}>
            <Container>
                <div className="flex flex-col lg:flex-row-reverse gap-10 md:gap-16 items-center h-full py-8 md:py-12 bg-amber-50 px-6 md:px-12 rounded-[2rem] md:rounded-[3rem]">

                    <div className="w-full lg:max-w-3xl">
                        <Swiper
                            key={i18n.language}
                            dir={i18n.dir()}
                            modules={[Pagination, Autoplay]}
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
                            {reviews.map((review) => (
                                <SwiperSlide key={review.id}>
                                    <div className="bg-white p-6 md:p-8 rounded-2xl border-slate-50 relative group hover:border-[#00A651] transition-all min-h-[280px] flex flex-col justify-between">
                                        <div className="absolute -top-3 left-6 md:left-8 bg-[#00A651] w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-slate-900 shadow-lg shadow-yellow-200 z-50">
                                            <span className="text-xl md:text-2xl font-black mt-1">"</span>
                                        </div>

                                        <p className="text-slate-600 font-bold text-xs md:text-sm leading-relaxed mb-6 opacity-80 pt-4">
                                            {review.text}
                                        </p>

                                        <div className="flex items-center gap-3 md:gap-4 mt-auto">
                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full  border-2 border-slate-50 overflow-hidden">
                                                <img src={review.image} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="text-start min-w-0">
                                                <div className="font-black text-slate-800 text-sm md:text-base truncate">
                                                    {review.name}
                                                </div>
                                                <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-tighter">
                                                    {review.role}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    <div className="flex flex-col text-start lg:flex-1">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 md:mb-6">{title}</h2>
                        <p className="text-slate-500 font-bold leading-relaxed opacity-70 text-sm md:text-base">
                            {subtitle}
                        </p>
                    </div>

                </div>
            </Container>
        </section>
    );
};

export default Testimonials;
