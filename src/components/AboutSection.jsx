import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Container from './Container';
import { api, resolveMediaUrl } from '../lib/api.js';

const FALLBACK_IMG =
  'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=2070&auto=format&fit=crop';

function pickLang(isEn, ar, en) {
  if (isEn) return (en && String(en).trim()) || ar || '';
  return ar || '';
}

const AboutSection = () => {
  const { t, i18n } = useTranslation();
  const [remote, setRemote] = useState(null);

  useEffect(() => {
    api
      .get('/about')
      .then((r) => setRemote(r.data))
      .catch(() => setRemote(null));
  }, []);

  const isEn = i18n.language?.startsWith('en');

  const badge = useMemo(() => {
    if (!remote) return t('about.badge');
    const v = pickLang(isEn, remote.badgeAr, remote.badgeEn);
    return v.trim() || t('about.badge');
  }, [remote, isEn, t]);

  const title = useMemo(() => {
    if (!remote) return t('about.title');
    const v = pickLang(isEn, remote.titleAr, remote.titleEn);
    return v.trim() || t('about.title');
  }, [remote, isEn, t]);

  const body = useMemo(() => {
    if (!remote) return t('about.body');
    const v = pickLang(isEn, remote.bodyAr, remote.bodyEn);
    return v.trim() || t('about.body');
  }, [remote, isEn, t]);

  const imgSrc = useMemo(() => {
    const u = remote?.imageUrl?.trim();
    if (!u) return FALLBACK_IMG;
    return resolveMediaUrl(u) || u || FALLBACK_IMG;
  }, [remote]);

  return (
    <section id="about" className="py-4 md:py-6 bg-white overflow-hidden " dir={i18n.dir()}>
      <Container>
        <div className="flex flex-col lg:flex-row-reverse items-center gap-10 lg:gap-16 pt-20">
          <div className="flex-1 lg:flex-2/5 relative">
            <div className="relative flex items-center justify-center">
              <div className="w-[85%] rounded-[2.5rem] overflow-hidden shadow-2xl z-10">
                <img src={imgSrc} className="w-full h-full object-cover" alt={t('about.imageAlt')} />
              </div>
              <div className="absolute -top-4 -end-4 z-30 bg-[#FFD131] text-slate-900 px-6 py-2 rounded-xl font-black text-lg md:text-xl shadow-xl rotate-2">
                {badge}
              </div>
            </div>
          </div>
          <div className="flex-1 lg:flex-3/5 text-start">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 md:mb-6 tracking-tight">{title}</h2>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed font-bold mb-4 md:mb-6 opacity-80 whitespace-pre-wrap">
              {body}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AboutSection;
