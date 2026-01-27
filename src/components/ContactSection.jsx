import React, { useState } from 'react';
import { Phone, Mail, User, Instagram, Facebook, Youtube, MessageCircle } from 'lucide-react';
import Container from './Container';

const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState(''); // 'idle', 'sending', 'success'

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('sending');

        // Simulate API call
        setTimeout(() => {
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setStatus('idle'), 3000);
        }, 1500);
    };

    return (
        <section id="contact" className="bg-white " dir="rtl">
            <Container>
                <div className="flex flex-col lg:flex-row-reverse gap-8 lg:gap-16 py-20 md:py-20">

                    {/* Form Side - Left */}
                    <div className="flex-1 lg:flex-2/5 bg-white rounded-3xl p-6 md:p-8 border-2 border-yellow-400">
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-6">أرسل رسالة</h3>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    placeholder="الاسم"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white border border-slate-200 rounded-xl py-3.5 px-12 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 font-bold transition-all outline-none text-sm md:text-base"
                                />
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            </div>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    placeholder="البريد الإلكتروني"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-white border border-slate-200 rounded-xl py-3.5 px-12 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 font-bold transition-all outline-none text-sm md:text-base"
                                />
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            </div>
                            <div>
                                <textarea
                                    placeholder="الرسالة"
                                    required
                                    rows="4"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-white border border-slate-200 rounded-xl py-3.5 px-6 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 font-bold transition-all outline-none resize-none text-sm md:text-base"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className={`w-full ${status === 'success' ? 'bg-green-500' : 'bg-slate-900 hover:bg-slate-800'} text-white py-3.5 rounded-xl font-black text-base md:text-lg flex items-center justify-center gap-3 transition-all shadow-lg disabled:opacity-50`}
                            >
                                {status === 'sending' ? (
                                    <span className="animate-pulse">جاري الإرسال...</span>
                                ) : status === 'success' ? (
                                    <span>تم الإرسال بنجاح!</span>
                                ) : (
                                    <span>إرسال</span>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Info Side - Right */}
                    <div className="flex-1 lg:flex-3/5 text-right">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4">تواصل معنا</h2>
                        <p className="text-slate-600 font-bold leading-relaxed mb-6 md:mb-8 text-base md:text-lg">
                            لوريم إيبسوم دولار سيت أميت كونسيكتور. فيليس فيغيات فيليت إد أكتور. ساجيتيس دونيك كوروسوس.
                        </p>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-4 justify-start">
                                <div className="w-12 h-12 md:w-14 md:h-14 bg-[#FFD131] rounded-full flex items-center justify-center text-slate-900 shadow-lg shadow-yellow-200">
                                    <Phone size={20} md:size={24} strokeWidth={2.5} />
                                </div>
                                <div className="text-right">
                                    <span className="text-lg md:text-xl lg:text-2xl font-black text-slate-900" dir="ltr">518468</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 justify-start">
                                <div className="w-12 h-12 md:w-14 md:h-14 bg-[#FFD131] rounded-full flex items-center justify-center text-slate-900 shadow-lg shadow-yellow-200">
                                    <Mail size={20} md:size={24} strokeWidth={2.5} />
                                </div>
                                <div className="text-right">
                                    <span className="text-sm md:text-base lg:text-lg font-black text-slate-900">Trafikklar.co@gmail.com</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <span className="text-sm md:text-base font-black text-slate-900 mb-4 block">تابعنا:</span>
                            <div className="flex gap-3 justify-start">
                                {[
                                    { Icon: Instagram, label: 'Instagram' },
                                    { Icon: MessageCircle, label: 'WhatsApp' },
                                    { Icon: Youtube, label: 'YouTube' },
                                    { Icon: Facebook, label: 'Facebook' }
                                ].map((social, idx) => (
                                    <a
                                        key={idx}
                                        href="#"
                                        className="w-10 h-10 md:w-11 md:h-11 bg-[#FFD131] rounded-full flex items-center justify-center text-slate-900 hover:bg-slate-900 hover:text-[#FFD131] transition-all shadow-md shadow-yellow-200"
                                        aria-label={social.label}
                                    >
                                        <social.Icon size={18} md:size={20} strokeWidth={2.5} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </Container>
        </section>
    );
};

export default ContactSection;
