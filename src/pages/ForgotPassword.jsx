import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Container from '../components/Container';
import logo from '../assets/logo.png';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [canResend, setCanResend] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Send verification code
        navigate('/verify-code', { state: { emailOrPhone } });
    };

    const handleResend = () => {
        setCanResend(false);
        // Simulate sending code
        setTimeout(() => {
            setCanResend(true);
        }, 30000); // 30 seconds
    };

    return (
        <div className="min-h-screen bg-slate-50/50 flex items-center justify-center py-12" dir="rtl">
            <Container>
                <div className="max-w-lg mx-auto">
                    <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
                        {/* Logo */}
                        <div className="flex justify-center mb-8">
                            <img src={logo} alt="الفهيم" className="h-32 w-auto" />
                        </div>

                        {/* Title */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-black text-slate-900 mb-3">
                                هل نسيت كلمة السر؟
                            </h1>
                            <p className="text-slate-500 font-bold text-base">
                                أدخل رقم الهاتف أو البريد الإلكتروني إرسال رقم المصادقة
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <input
                                    type="text"
                                    required
                                    placeholder="رقم الهاتف أو البريد الإلكتروني"
                                    value={emailOrPhone}
                                    onChange={(e) => setEmailOrPhone(e.target.value)}
                                    className="w-full bg-white border-2 border-slate-200 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 font-bold transition-all outline-none text-right"
                                />
                            </div>

                            {/* Resend Link */}
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={!canResend}
                                    className="text-slate-600 hover:text-slate-900 font-bold text-sm disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
                                >
                                    لم يصل إليك الكود؟ إعادة الإرسال
                                </button>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-[#FFD131] hover:bg-slate-900 hover:text-white text-slate-900 py-4 rounded-2xl font-black text-lg transition-all shadow-lg shadow-yellow-200/50"
                            >
                                إرسال
                            </button>
                        </form>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default ForgotPassword;

