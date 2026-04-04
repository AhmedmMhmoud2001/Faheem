import React, { useEffect, useMemo, useState } from 'react';
import { Phone, Mail, User, Instagram, Facebook, Youtube, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Container from './Container';
import { api } from '../lib/api.js';

function pickLang(primary, fallback) {
    const p = primary?.trim();
    return p || fallback?.trim() || '';
}

const ContactSection = () => {
    const { t, i18n } = useTranslation();
    const isEn = i18n.language?.toLowerCase().startsWith('en');
    const [info, setInfo] = useState(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const { data } = await api.get('/contact/info');
                if (!cancelled) setInfo(data);
            } catch {
                if (!cancelled) setInfo(null);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const intro = useMemo(() => {
        if (!info) return t('contact.intro');
        const line = isEn
            ? pickLang(info.introEn, info.introAr)
            : pickLang(info.introAr, info.introEn);
        return line || t('contact.intro');
    }, [info, isEn, t]);

    const phoneDisplay = info?.phone?.trim() || '';
    const emailDisplay = info?.email?.trim() || '';

    const socials = useMemo(() => {
        if (!info) return [];
        const items = [
            { Icon: Instagram, label: 'Instagram', url: info.instagramUrl?.trim() },
            { Icon: Facebook, label: 'Facebook', url: info.facebookUrl?.trim() },
            { Icon: MessageCircle, label: 'WhatsApp', url: info.whatsappUrl?.trim() },
            { Icon: Youtube, label: 'YouTube', url: info.youtubeUrl?.trim() },
        ];
        return items.filter((s) => s.url);
    }, [info]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [status, setStatus] = useState('idle');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        try {
            await api.post('/contact', {
                name: formData.name,
                email: formData.email,
                message: formData.message,
            });
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setStatus('idle'), 3000);
        } catch {
            setStatus('idle');
            alert(t('contact.sendError'));
        }
    };

    return (
        <section id="contact" className="bg-white " dir={i18n.dir()}>
            <Container>
                <div className="flex flex-col lg:flex-row-reverse gap-8 lg:gap-16 py-20 md:py-20">
                    <div className="flex-1 lg:flex-2/5 bg-white rounded-3xl p-6 md:p-8 border-2 border-yellow-400">
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-6">
                            {t('contact.formTitle')}
                        </h3>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    placeholder={t('contact.name')}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white border border-slate-200 rounded-xl py-3.5 px-12 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 font-bold transition-all outline-none text-sm md:text-base"
                                />
                                <User className="absolute start-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            </div>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    placeholder={t('contact.email')}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-white border border-slate-200 rounded-xl py-3.5 px-12 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 font-bold transition-all outline-none text-sm md:text-base"
                                />
                                <Mail className="absolute start-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            </div>
                            <div>
                                <textarea
                                    placeholder={t('contact.message')}
                                    required
                                    rows="4"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-white border border-slate-200 rounded-xl py-3.5 px-6 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 font-bold transition-all outline-none resize-none text-sm md:text-base"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className={`w-full ${status === 'success' ? 'bg-green-500' : 'bg-slate-900 hover:bg-slate-800'} text-white py-3.5 rounded-xl font-black text-base md:text-lg flex items-center justify-center gap-3 transition-all shadow-lg disabled:opacity-50`}
                            >
                                {status === 'sending' ? (
                                    <span className="animate-pulse">{t('contact.sending')}</span>
                                ) : status === 'success' ? (
                                    <span>{t('contact.success')}</span>
                                ) : (
                                    <span>{t('contact.send')}</span>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="flex-1 lg:flex-3/5 text-start">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4">
                            {t('contact.title')}
                        </h2>
                        <p className="text-slate-600 font-bold leading-relaxed mb-6 md:mb-8 text-base md:text-lg">
                            {intro}
                        </p>

                        <div className="space-y-4 mb-8">
                            {phoneDisplay ? (
                                <div className="flex items-center gap-4 justify-start">
                                    <div className="w-12 h-12 md:w-14 md:h-14 bg-[#FFD131] rounded-full flex items-center justify-center text-slate-900 shadow-lg shadow-yellow-200">
                                        <Phone size={20} strokeWidth={2.5} />
                                    </div>
                                    <div className="text-right">
                                        <span className="text-lg md:text-xl lg:text-2xl font-black text-slate-900" dir="ltr">
                                            {phoneDisplay}
                                        </span>
                                    </div>
                                </div>
                            ) : null}

                            {emailDisplay ? (
                                <div className="flex items-center gap-4 justify-start">
                                    <div className="w-12 h-12 md:w-14 md:h-14 bg-[#FFD131] rounded-full flex items-center justify-center text-slate-900 shadow-lg shadow-yellow-200">
                                        <Mail size={20} strokeWidth={2.5} />
                                    </div>
                                    <div className="text-right min-w-0">
                                        <a
                                            href={`mailto:${emailDisplay}`}
                                            className="text-sm md:text-base lg:text-lg font-black text-slate-900 break-all hover:text-[#FFD131]"
                                        >
                                            {emailDisplay}
                                        </a>
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        {socials.length > 0 ? (
                            <div className="text-start">
                                <span className="text-sm md:text-base font-black text-slate-900 mb-4 block">
                                    {t('contact.follow')}
                                </span>
                                <div className="flex flex-wrap gap-3 justify-start">
                                    {socials.map(({ Icon, label, url }) => (
                                        <a
                                            key={label}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 md:w-11 md:h-11 bg-[#FFD131] rounded-full flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-[#FFD131] transition-all shadow-md shadow-yellow-200"
                                            aria-label={label}
                                        >
                                            <Icon size={18} strokeWidth={2.5} />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default ContactSection;
