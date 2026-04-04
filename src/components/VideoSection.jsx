import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Container from './Container';
import { Play } from 'lucide-react';
import { api, resolveMediaUrl } from '../lib/api.js';

const FALLBACK_THUMB =
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop';

function pickLang(isEn, ar, en) {
  if (isEn) return (en && String(en).trim()) || ar || '';
  return ar || '';
}

const VideoSection = () => {
  const { t, i18n } = useTranslation();
  const [remote, setRemote] = useState(null);

  useEffect(() => {
    api
      .get('/home-video')
      .then((r) => setRemote(r.data))
      .catch(() => setRemote(null));
  }, []);

  const isEn = i18n.language?.startsWith('en');

  const title = useMemo(() => {
    if (!remote) return t('video.title');
    const v = pickLang(isEn, remote.titleAr, remote.titleEn);
    return v.trim() || t('video.title');
  }, [remote, isEn, t]);

  const body = useMemo(() => {
    if (!remote) return t('video.body');
    const v = pickLang(isEn, remote.bodyAr, remote.bodyEn);
    return v.trim() || t('video.body');
  }, [remote, isEn, t]);

  const thumbSrc = useMemo(() => {
    const u = remote?.thumbUrl?.trim();
    if (!u) return FALLBACK_THUMB;
    return resolveMediaUrl(u) || u || FALLBACK_THUMB;
  }, [remote]);

  const videoHref = remote?.videoUrl?.trim() || '';

  const thumbBlock = (
    <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden group cursor-pointer aspect-video border-4 md:border-8 border-slate-50">
      <img
        src={thumbSrc}
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        alt={t('video.thumbAlt')}
      />
      <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-all flex items-center justify-center">
        <div className="w-16 h-16 md:w-24 md:h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-white/30">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-[#FFD131] rounded-full flex items-center justify-center text-slate-900 shadow-2xl">
            <Play size={24} md:size={32} fill="currentColor" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section id="how-it-works" className="bg-white " dir={i18n.dir()}>
      <Container className="py-20 md:py-20">
        <div className="text-center mb-8 md:mb-12 ">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{title}</h2>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {videoHref ? (
            <a
              href={videoHref}
              target="_blank"
              rel="noopener noreferrer"
              className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD131] rounded-[2rem] md:rounded-[3rem]"
            >
              {thumbBlock}
            </a>
          ) : (
            thumbBlock
          )}
          <p className="text-slate-600 text-base md:text-lg leading-relaxed font-bold mt-6 md:mt-8 text-center opacity-80 max-w-3xl mx-auto whitespace-pre-wrap">
            {body}
          </p>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl -z-10"></div>
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-slate-400/10 rounded-full blur-2xl -z-10"></div>
        </div>
      </Container>
    </section>
  );
};

export default VideoSection;
