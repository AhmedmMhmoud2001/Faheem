import React, { useState } from 'react';
import { CheckCircle2, Apple, Facebook } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import logo from '../assets/logo.png';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate login
        setTimeout(() => {
            setLoading(false);
            login();
            navigate('/dashboard');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 " dir="ltr">
            <div className="max-w-6xl w-full bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col lg:flex-row border border-white">

                {/* Left Side: Form (Right in RTL) */}
                <div className="flex-1 p-10 md:p-20">
                    <div className="max-w-md mx-auto">
                        <h2 className="text-3xl font-black text-slate-900 mb-2 border-r-4 border-yellow-400 pr-4">سجل الآن</h2>
                        <p className="text-slate-400 font-bold mb-10 tracking-tight pr-5">رقم الهاتف أو البريد الإلكتروني</p>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 focus:ring-2 focus:ring-yellow-400 font-bold transition-all outline-none"
                                    placeholder="البريد الإلكتروني"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-slate-800 font-black">كلمة السر</label>
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-slate-50 border-none rounded-2xl py-5 px-6 focus:ring-2 focus:ring-yellow-400 font-bold transition-all outline-none"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out bg-yellow-400 rounded-full cursor-pointer">
                                        <div className="absolute left-1 top-1 w-4 h-4 transition duration-200 ease-in-out translate-x-6 bg-white rounded-full"></div>
                                    </div>
                                    <span className="text-slate-500 font-bold">تذكرني</span>
                                </div>
                                <Link to="/forgot-password" className="text-slate-900 font-bold hover:text-yellow-500 transition-colors">هل نسيت كلمة السر؟</Link>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#FFD740] hover:bg-slate-900 hover:text-white py-5 rounded-2xl font-black text-xl transition-all transform hover:-translate-y-1 active:scale-95 shadow-xl shadow-yellow-200/50 disabled:opacity-50"
                            >
                                {loading ? "جاري التحميل..." : "سجل الدخول"}
                            </button>

                            <p className="text-slate-400 text-sm font-bold text-center mt-6">
                                بالتسجيل، أنت توافق على <span className="text-slate-900">شروط الخدمة</span> و<span className="text-slate-900">سياسة الخصوصية</span>
                            </p>

                            <div className="text-center mt-6">
                                <span className="text-slate-400 font-bold">ليس لديك حساب ؟ </span>
                                <Link
                                    to="/register"
                                    className="text-slate-900 font-black hover:text-yellow-500 transition-colors underline underline-offset-4"
                                >
                                    إنشاء حساب
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
                                <div className="absolute left-0 top-0 h-full w-1/3 bg-yellow-400"></div>
                            </div>
                            <span className="text-slate-400 font-bold mt-4 tracking-[0.3em] text-xs uppercase">سلوجان</span>
                        </div>

                        {/* Features List */}
                        <ul className="space-y-6">
                            {[
                                "تجربة مجانية لمدة 7 أيام",
                                "الوصول الكامل لجميع الأسئلة",
                                "اختبارات تجريبية غير محدودة",
                                "تقارير تفصيلية للأداء"
                            ].map((feature, idx) => (
                                <li key={idx} className="flex items-center justify-end gap-4 group">
                                   
                                    <span className="text-xl font-bold text-slate-700 tracking-tight">{feature}</span>
                                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all shadow-sm">
                                        <CheckCircle2 size={24} />
                                    </div>
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

