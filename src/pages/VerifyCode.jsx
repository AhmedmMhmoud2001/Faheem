import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Container from '../components/Container';
import logo from '../assets/logo.png';
import { api } from '../lib/api.js';

const VerifyCode = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const emailOrPhone = location.state?.emailOrPhone || '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/reset-password', {
                email: emailOrPhone,
                code,
                newPassword,
            });
            navigate('/login');
        } catch {
            alert('رمز غير صحيح أو منتهي');
        }
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
                                أدخل رقم المصادقة.
                            </h1>
                            <p className="text-slate-500 font-bold text-base">
                                أدخل رقم المصادقة المرسل لك.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <input
                                    type="text"
                                    required
                                    placeholder="رقم المصادقة"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="w-full bg-white border-2 border-slate-200 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 font-bold transition-all outline-none text-center text-2xl tracking-widest"
                                    maxLength="6"
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    placeholder="كلمة المرور الجديدة"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-white border-2 border-slate-200 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 font-bold transition-all outline-none"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-[#FFD131] hover:bg-slate-900 hover:text-white text-slate-900 py-4 rounded-2xl font-black text-lg transition-all shadow-lg shadow-yellow-200/50"
                            >
                                تم
                            </button>
                        </form>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default VerifyCode;

