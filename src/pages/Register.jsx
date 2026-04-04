import React, { useState } from 'react';
import { Apple, Facebook } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api.js';
import logo from '../assets/logo.png';

const Register = () => {
    const navigate = useNavigate();
    const { loginWithTokens } = useAuth();
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        password: '',
        confirm: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirm) {
            alert('كلمتا المرور غير متطابقتين');
            return;
        }
        setLoading(true);
        try {
            const { data } = await api.post('/auth/register', {
                fullName: form.fullName,
                email: form.email.trim(),
                password: form.password,
            });
            await loginWithTokens(data.accessToken, data.refreshToken);
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || 'فشل إنشاء الحساب');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6  bg-fixed" dir="ltr">
            <div className="max-w-4xl w-full bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col items-center p-10 md:p-16 border border-white">

                {/* Logo at Top */}
                <div className="flex flex-col items-center mb-12">
                    <img src={logo} alt="Al Faheem Logo" className="w-40 h-auto" />
                    <div className="w-12 h-1 bg-yellow-400 mt-6 rounded-full"></div>
                </div>

                <div className="w-full max-w-lg">
                    <h2 className="text-4xl font-black text-slate-900 mb-2 text-center">سجل الآن</h2>
                    <p className="text-slate-400 font-bold mb-10 text-center tracking-tight">الاسم الكامل</p>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <input
                                type="text"
                                required
                                value={form.fullName}
                                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 focus:ring-2 focus:ring-yellow-400 font-bold transition-all outline-none"
                                placeholder="الاسم بالكامل"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-slate-800 font-black block mb-2 px-2">رقم الهاتف أو البريد الإلكتروني</label>
                            <input
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 focus:ring-2 focus:ring-yellow-400 font-bold transition-all outline-none"
                                placeholder="example@email.com"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-slate-800 font-black block mb-2 px-2">كلمة السر</label>
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 focus:ring-2 focus:ring-yellow-400 font-bold transition-all outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-slate-800 font-black block mb-2 px-2">تأكيد كلمة السر</label>
                                <input
                                    type="password"
                                    required
                                    value={form.confirm}
                                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                                    className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 focus:ring-2 focus:ring-yellow-400 font-bold transition-all outline-none"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#FFD740] hover:bg-slate-900 hover:text-white py-5 rounded-3xl font-black text-xl transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl shadow-yellow-200/50 mt-4 disabled:opacity-50"
                        >
                            {loading ? 'جاري الإنشاء...' : 'إنشاء حساب'}
                        </button>

                        <p className="text-slate-400 text-sm font-bold text-center mt-6">
                            بالتسجيل، أنت توافق على <span className="text-slate-900">شروط الخدمة</span> و<span className="text-slate-900">سياسة الخصوصية</span>
                        </p>

                        <div className="text-center mt-8">
                            <span className="text-slate-400 font-bold">لديك حساب بالفعل؟ </span>
                            <Link
                                to="/login"
                                className="text-slate-900 font-black hover:text-yellow-500 transition-colors underline underline-offset-4"
                            >
                                سجل الدخول
                            </Link>
                        </div>

                        {/* Social Logins */}
                        <div className="flex gap-4 mt-8">
                            <button className="flex-1 py-4 bg-slate-50 rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-colors border border-slate-100">
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
                            </button>
                            <button className="flex-1 py-4 bg-slate-50 rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-colors border border-slate-100">
                                <Apple size={24} className="text-slate-900" />
                            </button>
                            <button className="flex-1 py-4 bg-slate-50 rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-colors border border-slate-100">
                                <Facebook size={24} className="text-[#1877F2]" fill="currentColor" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;

