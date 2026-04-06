import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext';
import Container from '../components/Container';

const Checkout = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { refreshMe } = useAuth();
    const planSlug = searchParams.get('plan') || 'monthly';

    async function handlePayNow() {
        try {
            await api.post('/mock/confirm', { planSlug });
            await refreshMe();
            navigate('/dashboard');
        } catch (e) {
            alert(e?.response?.data?.message || 'تعذر إتمام الدفع التجريبي');
        }
    }
    return (
        <div className="bg-[#F8FAFC] min-h-screen py-10 relative overflow-hidden" dir="rtl">
            {/* Educational Pattern Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M30 30h10v10H30V30zm60 60h10v10H90V90zm60-60h10v10h-10V30zM30 150h10v10H30v-10zm120 0h10v10h-10v-10zM100 20l5 10h-10l5-10zm0 160l5 10h-10l5-10zm80-80l10 5L180 115l-10-5zm-160 0l10 5-10 10-10-5z'/%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '300px'
                }}>
            </div>

            <Container className="relative z-10">
                <div className="max-w-4xl mx-auto bg-white rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 md:p-16 border border-slate-50">
                    <div className="space-y-10">
                        {/* Card Number */}
                        <div className="space-y-4">
                            <label className="block text-right text-xl font-black text-slate-800 mr-2">
                                رقم البطاقة
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="١٢٣٤ ١٢٣٤ ١٢٣٤ ١٢٣٤"
                                    className="w-full bg-white border-2 border-slate-100/80 rounded-2xl py-4 px-6 text-right text-2xl font-medium tracking-widest placeholder:text-slate-300 focus:border-[#FFD131] focus:ring-4 focus:ring-yellow-50/50 transition-all outline-none"
                                />
                                <div className="absolute left-8 top-1/2 -translate-y-1/2 flex items-center gap-3">
                                    <div className="flex items-center gap-1.5 p-1.5 bg-slate-50 rounded-lg border border-slate-100">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-70" />
                                        <div className="w-px h-4 bg-slate-200"></div>
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Middle Row: CVC and Expiry */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-4">
                                <label className="block text-right text-xl font-black text-slate-800 mr-2">
                                    رمز CVC
                                </label>
                                <input
                                    type="text"
                                    placeholder="CVC رمز"
                                    className="w-full bg-white border-2 border-slate-100/80 rounded-2xl py-4 px-6 text-right text-2xl font-medium placeholder:text-slate-300 focus:border-[#FFD131] focus:ring-4 focus:ring-yellow-50/50 transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="block text-right text-xl font-black text-slate-800 mr-2">
                                    تاريخ انتهاء الصلاحية
                                </label>
                                <input
                                    type="text"
                                    placeholder="تنس / رهش"
                                    className="w-full bg-white border-2 border-slate-100/80 rounded-2xl py-4 px-6 text-right text-2xl font-medium placeholder:text-slate-300 focus:border-[#FFD131] focus:ring-4 focus:ring-yellow-50/50 transition-all outline-none"
                                />
                            </div>
                        </div>

                        {/* Bottom Row: Postal and Country */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <label className="block text-right text-xl font-black text-slate-800 mr-2">
                                    الرمز البريدي
                                </label>
                                <input
                                    type="text"
                                    placeholder="٩٠٢١٠"
                                    className="w-full bg-white border-2 border-slate-100/80 rounded-2xl py-4 px-6 text-right text-2xl font-medium placeholder:text-slate-300 focus:border-[#FFD131] focus:ring-4 focus:ring-yellow-50/50 transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-4">
                                <label className="block text-right text-xl font-black text-slate-800 mr-2">
                                    الدولة
                                </label>
                                <div className="relative">
                                    <select className="w-full bg-white border-2 border-slate-100/80 rounded-2xl py-4 px-6 text-right text-2xl font-black text-slate-700 focus:border-[#FFD131] focus:ring-4 focus:ring-yellow-50/50 transition-all outline-none appearance-none cursor-pointer">
                                        <option>المملكة العربية السعودية</option>
                                        <option>الإمارات العربية المتحدة</option>
                                        <option>الكويت</option>
                                        <option>قطر</option>
                                        <option>البحرين</option>
                                        <option>عمان</option>
                                        <option>مصر</option>
                                    </select>
                                    <div className="absolute left-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pay Button */}
                        <div className="pt-6 flex justify-end">
                            <button onClick={handlePayNow} className="w-full md:w-auto min-w-[280px] bg-[#FFD131] hover:bg-slate-900 hover:text-white text-slate-900 py-4 px-6 rounded-[1.5rem] font-black text-3xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95 shadow-xl shadow-yellow-200/50 hover:shadow-slate-200">
                                ادفع الآن
                            </button>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Checkout;
