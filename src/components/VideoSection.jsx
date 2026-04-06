import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Container from './Container';
import { Play, X } from 'lucide-react';
import { api, resolveMediaUrl } from '../lib/api.js';

const FALLBACK_THUMB =
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop';

function pickLang(isEn, ar, en) {
  if (isEn) return (en && String(en).trim()) || ar || '';
  return ar || '';
}

/** تحويل رابط YouTube إلى رابط embed */
function youtubeEmbedUrl(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') {
      const id = u.pathname.replace(/^\//, '').split('/')[0];
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : null;
    }
    if (host === 'youtube.com' || host.endsWith('.youtube.com')) {
      if (u.pathname.startsWith('/embed/')) return `${url}${url.includes('?') ? '&' : '?'}autoplay=1`;
      const v = u.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}?autoplay=1`;
      const shorts = u.pathname.match(/^\/shorts\/([^/]+)/);
      if (shorts) return `https://www.youtube.com/embed/${shorts[1]}?autoplay=1`;
    }
  } catch {
    /* ignore */
  }
  return null;
}

/** تحويل رابط Vimeo إلى رابط embed */
function vimeoEmbedUrl(url) {
  try {
    const u = new URL(url);
    if (!u.hostname.includes('vimeo.com')) return null;
    const m = u.pathname.match(/\/(\d+)/);
    return m ? `https://player.vimeo.com/video/${m[1]}?autoplay=1` : null;
  } catch {
    return null;
  }
}

/** هل الرابط فيديو محلي أو مباشر؟ */
function isDirectVideo(url) {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

const VideoSection = () => {
  const { t, i18n } = useTranslation();
  const [remote, setRemote] = useState(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    api
      .get('/home-video')
      .then((r) => setRemote(r.data))
      .catch(() => setRemote(null));
  }, []);

  // أغلق المشغّل عند الضغط على Escape
  useEffect(() => {
    if (!playing) return;
    const onKey = (e) => { if (e.key === 'Escape') setPlaying(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [playing]);

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

  // حدّد نوع الفيديو
  const embedUrl = useMemo(() => {
    if (!videoHref) return null;
    return youtubeEmbedUrl(videoHref) || vimeoEmbedUrl(videoHref) || null;
  }, [videoHref]);

  const isLocal = useMemo(() => videoHref && isDirectVideo(videoHref), [videoHref]);

  const handlePlay = () => {
    if (videoHref) setPlaying(true);
  };

  const thumbBlock = (
    <div
      role="button"
      tabIndex={videoHref ? 0 : -1}
      onClick={handlePlay}
      onKeyDown={(e) => e.key === 'Enter' && handlePlay()}
      className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden group cursor-pointer aspect-video border-4 md:border-8 border-slate-50"
    >
      <img
        src={thumbSrc}
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        alt={t('video.thumbAlt')}
      />
      <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-all flex items-center justify-center">
        <div className="w-16 h-16 md:w-24 md:h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-white/30">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-[#FFD131] rounded-full flex items-center justify-center text-slate-900 shadow-2xl">
            <Play size={24} fill="currentColor" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section id="how-it-works" className="bg-white" dir={i18n.dir()}>
      <Container className="py-20 md:py-20">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{title}</h2>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {thumbBlock}
          <p className="text-slate-600 text-base md:text-lg leading-relaxed font-bold mt-6 md:mt-8 text-center opacity-80 max-w-3xl mx-auto whitespace-pre-wrap">
            {body}
          </p>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl -z-10" />
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-slate-400/10 rounded-full blur-2xl -z-10" />
        </div>
      </Container>

      {/* ─── مشغّل الفيديو (Modal) ──────────────────────────────── */}
      {playing && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setPlaying(false)}
        >
          <div
            className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            {/* زر الإغلاق */}
            <button
              onClick={() => setPlaying(false)}
              className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/90 transition"
              aria-label="إغلاق"
            >
              <X size={20} />
            </button>

            <div className="aspect-video w-full">
              {embedUrl ? (
                <iframe
                  className="h-full w-full border-0"
                  src={embedUrl}
                  title="فيديو"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : isLocal ? (
                <video
                  src={videoHref}
                  controls
                  autoPlay
                  playsInline
                  className="h-full w-full object-contain"
                >
                  متصفحك لا يدعم تشغيل هذا الفيديو.
                </video>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default VideoSection;
