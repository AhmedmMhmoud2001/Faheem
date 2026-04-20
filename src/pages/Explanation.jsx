import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Container from '../components/Container';
import { ChevronLeft, FileDown } from 'lucide-react';
import { api } from '../lib/api.js';
import MathText from '../components/MathText.jsx';

const apiOrigin =
    (import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1').replace(/\/api\/v1\/?$/, '') ||
    'http://localhost:4000';

function resolveToAbsolute(url, origin) {
    if (!url || !String(url).trim()) return '';
    const u = String(url).trim();
    if (u.startsWith('http://') || u.startsWith('https://')) return u;
    const p = u.startsWith('/') ? u : `/${u}`;
    return `${origin}${p}`;
}

/** Returns embed URL or null if not a recognized YouTube link. */
function youtubeEmbedUrl(url) {
    try {
        const u = new URL(url);
        const host = u.hostname.replace(/^www\./, '');
        if (host === 'youtu.be') {
            const id = u.pathname.replace(/^\//, '').split('/')[0];
            return id ? `https://www.youtube.com/embed/${id}` : null;
        }
        if (host === 'youtube.com' || host.endsWith('.youtube.com')) {
            if (u.pathname.startsWith('/embed/')) return url;
            const v = u.searchParams.get('v');
            if (v) return `https://www.youtube.com/embed/${v}`;
            const shorts = u.pathname.match(/^\/shorts\/([^/]+)/);
            if (shorts) return `https://www.youtube.com/embed/${shorts[1]}`;
        }
    } catch {
        /* ignore */
    }
    return null;
}

function vimeoEmbedUrl(url) {
    try {
        const u = new URL(url);
        if (!u.hostname.includes('vimeo.com')) return null;
        const m = u.pathname.match(/\/(\d+)/);
        return m ? `https://player.vimeo.com/video/${m[1]}` : null;
    } catch {
        return null;
    }
}

function VideoSection({ rawUrl }) {
    const abs = useMemo(() => resolveToAbsolute(rawUrl, apiOrigin), [rawUrl]);
    const yt = useMemo(() => (abs ? youtubeEmbedUrl(abs) : null), [abs]);
    const vm = useMemo(() => (!yt && abs ? vimeoEmbedUrl(abs) : null), [abs, yt]);

    if (!abs) return null;

    const frameClass = 'absolute inset-0 h-full w-full border-0';
    const wrapClass =
        'relative mb-12 aspect-video w-full overflow-hidden rounded-3xl bg-black shadow-2xl';

    if (yt) {
        return (
            <div className={wrapClass}>
                <iframe
                    className={frameClass}
                    src={yt}
                    title="شرح الفيديو"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                />
            </div>
        );
    }
    if (vm) {
        return (
            <div className={wrapClass}>
                <iframe className={frameClass} src={vm} title="شرح الفيديو" allowFullScreen />
            </div>
        );
    }

    return (
        <div className={wrapClass}>
            <video src={abs} controls playsInline className="h-full w-full object-contain">
                متصفحك لا يدعم تشغيل هذا الفيديو.
            </video>
        </div>
    );
}

function ExplanationLoaded({ questionId }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');

    useEffect(() => {
        let cancelled = false;
        api.get(`/questions/${questionId}`)
            .then((r) => {
                if (!cancelled) setData(r.data);
            })
            .catch((e) => {
                if (!cancelled) setErr(e.response?.data?.message || 'تعذر تحميل الشرح');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [questionId]);

    const title = data?.stem?.slice(0, 80) || 'الشرح';
    const description = data?.explanation?.trim()
        ? data.explanation
        : 'لا يوجد نص شرح لهذا السؤال.';

    const pdfHref = data?.pdfUrl?.trim() ? resolveToAbsolute(data.pdfUrl.trim(), apiOrigin) : null;

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center font-bold text-slate-600" dir="rtl">
                جاري التحميل...
            </div>
        );
    }

    if (err || !data) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6" dir="rtl">
                <p className="font-black text-red-600">{err || 'لا بيانات'}</p>
                <Link to="/dashboard" className="font-bold text-slate-900 underline">
                    الرئيسية
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20 font-sans" dir="rtl">
            <Container className="pt-8">
                <div className="mb-8 flex items-center gap-2 text-lg font-bold text-slate-400">
                    <Link to="/" className="transition-colors hover:text-slate-900">
                        الرئيسية
                    </Link>
                    <ChevronLeft size={20} />
                    <Link to="/topics" className="transition-colors hover:text-slate-900">
                        المواضيع
                    </Link>
                    <ChevronLeft size={20} />
                    <span className="text-slate-900">{title}</span>
                </div>

                {data.videoUrl?.trim() ? <VideoSection rawUrl={data.videoUrl.trim()} /> : null}

                <div className="mb-8 rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm lg:p-12">
                    <MathText
                        value={description}
                        dir="rtl"
                        className="text-justify text-lg font-bold leading-loose text-slate-700 whitespace-pre-wrap lg:text-xl"
                    />
                </div>

                {pdfHref ? (
                    <div className="flex justify-end">
                        <a
                            href={pdfHref}
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-center gap-3 rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 text-xl font-black text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md"
                        >
                            <FileDown
                                size={28}
                                className="text-slate-400 transition-colors group-hover:text-slate-900"
                            />
                            <span>تحميل المحتوى PDF</span>
                        </a>
                    </div>
                ) : null}
            </Container>
        </div>
    );
}

const Explanation = () => {
    const { questionId } = useParams();

    if (!questionId) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6" dir="rtl">
                <p className="font-black text-red-600">معرّف السؤال غير موجود</p>
                <Link to="/dashboard" className="font-bold text-slate-900 underline">
                    الرئيسية
                </Link>
            </div>
        );
    }

    return <ExplanationLoaded key={questionId} questionId={questionId} />;
};

export default Explanation;
