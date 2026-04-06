import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/Container';
import { User, Mail, Star, X } from 'lucide-react';
import { api } from '../lib/api.js';

const Feedback = () => {
    const navigate = useNavigate();
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [comment, setComment] = useState('');

    function isValidEmail(v) {
        if (!v) return true; // اختياري
        const s = String(v).trim();
        // فحص بسيط لصيغة البريد
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
    }

    const handleSend = async () => {
        if (rating < 1) {
            alert('اختر عدد النجوم');
            return;
        }
        if (!comment || !comment.trim()) {
            alert('يرجى كتابة تعليقك.');
            return;
        }
        if (!isValidEmail(email)) {
            alert('صيغة البريد الإلكتروني غير صحيحة. يرجى إدخال بريد صالح.');
            return;
        }
        try {
            await api.post('/feedback', {
                rating,
                name: name?.trim() || undefined,
                email: email?.trim() || undefined,
                comment: comment.trim(),
            });
            setShowSuccess(true);
        } catch (e) {
            const msg = e?.response?.data?.message;
            if (msg && typeof msg === 'string') {
                alert(msg);
            } else {
                alert('تعذر إرسال التقييم.');
            }
        }
    };

    const handleClose = () => {
        // Navigate to home after feedback
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 font-sans relative" dir="rtl">
            <Container>
                {/* Feedback Form Card */}
                {!showSuccess && (
                    <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-sm border border-slate-100 max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4">
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-12">
                            شارك برأيك الآن!
                        </h1>

                        {/* Star Rating */}
                        <div className="flex justify-center gap-4 mb-12">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    onClick={() => setRating(star)}
                                    className="transition-transform hover:scale-110 focus:outline-none"
                                >
                                    <Star
                                        size={48}
                                        weight="fill"
                                        className={`transition-colors duration-200 ${star <= (hoveredRating || rating)
                                            ? 'fill-[#FFD131] text-[#FFD131]'
                                            : 'fill-slate-200 text-slate-200'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-6 mb-10">
                            {/* Name Input */}
                            <div className="relative">
                                <div className="absolute top-1/2 -translate-y-1/2 right-6 text-slate-400">
                                    <User size={24} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="الاسم"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 pr-16 pl-6 text-lg font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FFD131] focus:ring-1 focus:ring-[#FFD131] transition-all"
                                />
                            </div>

                            {/* Email Input */}
                            <div className="relative">
                                <div className="absolute top-1/2 -translate-y-1/2 right-6 text-slate-400">
                                    <Mail size={24} />
                                </div>
                                <input
                                    type="email"
                                    placeholder="عنوان البريد الإلكتروني"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 pr-16 pl-6 text-lg font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FFD131] focus:ring-1 focus:ring-[#FFD131] transition-all"
                                />
                            </div>

                            {/* Comments Textarea */}
                            <textarea
                                rows="5"
                                placeholder="أضف تعليقاتك"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-lg font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#FFD131] focus:ring-1 focus:ring-[#FFD131] transition-all resize-none"
                            ></textarea>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <button
                                onClick={handleSend}
                                className="flex-1 bg-[#FFD131] hover:bg-[#ffc800] text-slate-900 py-4 rounded-xl font-black text-xl transition-all shadow-lg shadow-yellow-100"
                            >
                                إرسال
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-600 py-4 rounded-xl font-black text-xl transition-all"
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                )}
            </Container>

            {/* Success Overlay */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 bg-[#2d3342]/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <button
                        onClick={handleClose}
                        className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
                    >
                        <X size={40} />
                    </button>

                    <div className="text-center text-white max-w-2xl w-full">
                        {/* Background Icons (Simulated with text/lucide for now or simple SVG bg) */}
                        <div className="mb-8 font-black text-4xl md:text-6xl tracking-tight">
                            شكراً لمشاركتك برأيك !
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Feedback;
