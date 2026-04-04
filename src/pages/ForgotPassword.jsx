import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Container from '../components/Container';
import logo from '../assets/logo.png';
import { api } from '../lib/api.js';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [canResend, setCanResend] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/forgot-password', { email: emailOrPhone.trim() });
            navigate('/verify-code', { state: { emailOrPhone: emailOrPhone.trim() } });
        } catch (err) {
            const msg = err.response?.data?.message;
            alert(typeof msg === 'string' && msg.trim() ? msg : t('forgotPassword.error'));
        }
    };

    const handleResend = () => {
        setCanResend(false);
        setTimeout(() => {
            setCanResend(true);
        }, 30000);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50/50 py-12" dir={i18n.dir()}>
            <Container>
                <div className="mx-auto max-w-lg">
                    <div className="rounded-[3rem] border border-slate-100 bg-white p-10 shadow-sm">
                        <div className="mb-8 flex justify-center">
                            <img src={logo} alt={t('forgotPassword.logoAlt')} className="h-32 w-auto" />
                        </div>

                        <div className="mb-8 text-center">
                            <h1 className="mb-3 text-3xl font-black text-slate-900">{t('forgotPassword.title')}</h1>
                            <p className="text-base font-bold text-slate-500">{t('forgotPassword.subtitle')}</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <input
                                    type="email"
                                    autoComplete="email"
                                    required
                                    placeholder={t('forgotPassword.placeholder')}
                                    value={emailOrPhone}
                                    onChange={(e) => setEmailOrPhone(e.target.value)}
                                    className="w-full rounded-2xl border-2 border-slate-200 bg-white py-4 ps-6 pe-6 font-bold text-slate-900 outline-none transition-all focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 text-start"
                                />
                            </div>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={!canResend}
                                    className="text-sm font-bold text-slate-600 transition-colors hover:text-slate-900 disabled:cursor-not-allowed disabled:text-slate-400"
                                >
                                    {t('forgotPassword.resend')}
                                </button>
                            </div>

                            <button
                                type="submit"
                                className="w-full rounded-2xl bg-[#FFD131] py-4 text-lg font-black text-slate-900 shadow-lg shadow-yellow-200/50 transition-all hover:bg-slate-900 hover:text-white"
                            >
                                {t('forgotPassword.submit')}
                            </button>

                            <p className="text-center">
                                <Link
                                    to="/login"
                                    className="text-sm font-bold text-slate-600 underline-offset-4 transition-colors hover:text-slate-900"
                                >
                                    {t('forgotPassword.backToLogin')}
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default ForgotPassword;
