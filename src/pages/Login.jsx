import React, { useState } from 'react';
import { Check, Apple, Facebook } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api.js';

import logo from '../assets/logo.png';

const Login = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { loginWithTokens } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', {
                email: formData.username.trim(),
                password: formData.password,
            });
            await loginWithTokens(data.accessToken, data.refreshToken);
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || t('login.fail'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 " dir={i18n.dir()}>
            <div className="max-w-6xl w-full bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col lg:flex-row border border-white">

                {/* Left Side: Form (Right in RTL) */}
                <div className="flex-1 p-10 md:p-20">
                    <div className="max-w-md mx-auto">
                        <h2 className="text-3xl font-black text-slate-900 mb-2 border-e-4 border-[#00A651] pe-4">{t('login.title')}</h2>
                        <p className="text-slate-400 font-bold mb-10 tracking-tight pe-5">{t('login.subtitle')}</p>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <input
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 focus:ring-2 focus:ring-[#00A651] font-bold transition-all outline-none"
                                    placeholder={t('login.emailPlaceholder')}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-slate-800 font-black">{t('login.password')}</label>
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 focus:ring-2 focus:ring-[#00A651] font-bold transition-all outline-none"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out bg-[#00A651] rounded-full cursor-pointer">
                                        <div className="absolute left-1 top-1 w-4 h-4 transition duration-200 ease-in-out translate-x-6 bg-white rounded-full"></div>
                                    </div>
                                    <span className="text-slate-500 font-bold">{t('login.remember')}</span>
                                </div>
                                <Link to="/forgot-password" className="text-slate-900 font-bold hover:text-[#00A651] transition-colors">{t('login.forgot')}</Link>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#00A651] hover:bg-slate-900 hover:text-white py-5 rounded-2xl font-black text-xl transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl shadow-green-200/50 disabled:opacity-50"
                            >
                                {loading ? t('login.loading') : t('login.submit')}
                            </button>

                            <p className="text-slate-400 text-sm font-bold text-center mt-6">
                                <Trans
                                    i18nKey="login.terms"
                                    components={{
                                        terms: <span className="text-slate-900" />,
                                        privacy: <span className="text-slate-900" />,
                                    }}
                                />
                            </p>

                            <div className="text-center mt-6">
                                <span className="text-slate-400 font-bold">{t('login.noAccount')} </span>
                                <Link
                                    to="/register"
                                    className="text-slate-900 font-black hover:text-[#00A651] transition-colors underline underline-offset-4"
                                >
                                    {t('login.register')}
                                </Link>
                            </div>

                            {/* Social Logins */}
                            <div className="flex gap-4 mt-10">
                                <button type="button" className="flex-1 py-4 bg-slate-50 rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-colors border border-slate-100">
                                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
                                </button>
                                <button type="button" className="flex-1 py-4 bg-slate-50 rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-colors border border-slate-100">
                                    <Apple size={24} className="text-slate-900" />
                                </button>
                                <button type="button" className="flex-1 py-4 bg-slate-50 rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-colors border border-slate-100">
                                    <Facebook size={24} className="text-[#1877F2]" fill="currentColor" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Side: Features (Left in RTL) */}
                <div className="flex-1 bg-white p-10 md:p-20 flex flex-col items-center justify-center border-r lg:border-r-0 lg:border-l border-slate-50">
                    <div className="max-w-sm w-full text-center">
                        {/* Big Logo Image */}
                        <div className="mb-12 flex flex-col items-center">
                            <img src={logo} alt="Al Faheem Logo" className="w-64 h-auto drop-shadow-2xl animate-float" />
                            <div className="w-32 h-1.5 bg-slate-200 mt-8 rounded-full relative overflow-hidden">
                                <div className="absolute left-0 top-0 h-full w-1/3 bg-[#00A651]"></div>
                            </div>
                            <span className="text-slate-400 font-bold mt-4 tracking-[0.3em] text-xs uppercase">{t('login.slogan')}</span>
                        </div>

                        {/* Features: أيقونة قبل النص (بداية القراءة) + hover يملأ المربع أخضر والعلامة بيضاء */}
                        <ul className="w-full space-y-5 text-start">
                            {[
                                t('login.feature1'),
                                t('login.feature2'),
                                t('login.feature3'),
                                t('login.feature4'),
                            ].map((feature, idx) => (
                                <li
                                    key={idx}
                                    className="group flex items-start gap-3 transition-colors"
                                >
                                    <div
                                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-200/90 bg-[#F0FDF4] transition-all duration-200 group-hover:border-[#00C853] group-hover:bg-[#00C853] group-hover:shadow-md"
                                        aria-hidden
                                    >
                                        <Check
                                            size={20}
                                            strokeWidth={3}
                                            className="text-emerald-600 transition-colors group-hover:text-white"
                                        />
                                    </div>
                                    <span className="min-w-0 flex-1 pt-1.5 text-lg font-bold leading-snug tracking-tight text-[#2E3A59]">
                                        {feature}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;

