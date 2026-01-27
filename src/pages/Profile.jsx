import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Pencil, UserPen, TrendingUp, History, Settings2, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import Container from '../components/Container';

const AccordionItem = ({ isOpen: initialOpen = false }) => {
    const [isOpen, setIsOpen] = useState(initialOpen);

    return (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all duration-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-[#FFD131]"></div>
                    <span className="text-lg font-bold text-slate-700">لوريم ايبسوم دولار سيت ؟</span>
                </div>
                <div className="text-slate-400">
                    {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
            </button>
            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-6 pt-0 space-y-4">
                    <p className="text-slate-500 leading-relaxed text-lg">
                        لوريم ايبسوم دولار سيت أميت نيسيوت دونك، دونك، دولار نوسترو يوت ييريتيتيس. سيت. أولامكو ديكتوم دولار سيد كونسيكوات. رييبوديامت كويرات سيد إكس فوليام نويس دولار كونسيكوات. ماغنيت، كونسيفيكات كومودو فوليام نوستراد فوليام آيت كويرات. فوليام سيت لومينيير لابوريس ديتيكتورمي ليجاتوس أولامكو أليكويب نيس.
                    </p>
                    <button className="flex items-center gap-2 bg-[#FFD131] hover:bg-slate-900 hover:text-white px-6 py-2.5 rounded-xl font-bold transition-all transform active:scale-95 shadow-lg shadow-yellow-100/50">
                        <HelpCircle size={20} />
                        <span>الشرح</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

const Profile = () => {
    const [activeTab, setActiveTab] = useState('edit-profile');

    const tabs = [
        { id: 'edit-profile', label: 'تعديل الملف الشخصي', icon: UserPen },
        { id: 'progress', label: 'تقدمي', icon: TrendingUp },
        { id: 'error-log', label: 'سجل الأخطاء', icon: History },
        { id: 'settings', label: 'الإعدادات', icon: Settings2 },
    ];

    const profileFields = [
        { label: 'الاسم', value: 'محمد الفهيم', icon: User },
        { label: 'البريد الإلكتروني', value: 'example@email.com', icon: Mail },
        { label: 'رقم الهاتف', value: '+20 123 456 789', icon: Phone },
        { label: 'تغيير كلمة المرور', value: '********', icon: Lock },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 font-sans relative" dir="rtl">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-40" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            <Container className="relative z-10">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
                            <div className="flex flex-col">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center gap-4 px-8 py-6 transition-all duration-300 relative ${activeTab === tab.id
                                                ? 'bg-slate-50 text-slate-900 font-black'
                                                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                                                }`}
                                        >
                                            {activeTab === tab.id && (
                                                <div className="absolute top-0 right-0 w-1.5 h-full bg-[#00AEEF]"></div>
                                            )}
                                            <Icon size={24} className={activeTab === tab.id ? 'text-slate-700' : 'text-slate-300'} />
                                            <span className="text-xl">{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="w-full lg:w-2/3">
                        {activeTab === 'edit-profile' && (
                            <div className="space-y-4">
                                {profileFields.map((field, index) => {
                                    const FieldIcon = field.icon;
                                    return (
                                        <div key={index} className="bg-white rounded-2xl shadow-sm border border-slate-50 p-6 flex items-center justify-between group hover:border-[#FFD131]/30 transition-all">
                                            <div className="flex items-center gap-6 flex-1">
                                                <div className="text-slate-300">
                                                    <FieldIcon size={24} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-slate-400 mb-0.5">{field.label}</p>
                                                    <p className="text-lg font-bold text-slate-700">{field.value}</p>
                                                </div>
                                            </div>
                                            <button className="p-2 text-slate-300 hover:text-[#00AEEF] transition-colors">
                                                <Pencil size={18} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {activeTab === 'progress' && (
                            <div className="bg-white rounded-3xl p-8 lg:p-12 border border-slate-100 flex flex-col items-center">
                                <div className="w-full max-w-4xl aspect-[16/9] relative">
                                    {/* Chart Header */}
                                    <div className="flex items-center justify-center gap-6 mb-8">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-[#FFD131]"></div>
                                            <span className="text-sm font-bold text-slate-500">Dataset 1</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-slate-800"></div>
                                            <span className="text-sm font-bold text-slate-500">Dataset 2</span>
                                        </div>
                                    </div>

                                    {/* SVG Chart */}
                                    <svg viewBox="0 0 800 400" className="w-full h-full overflow-visible">
                                        {/* Grid Lines */}
                                        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                                            <g key={i}>
                                                <line x1="50" y1={50 + i * 43} x2="750" y2={50 + i * 43} stroke="#f1f5f9" strokeWidth="1" />
                                                <text x="35" y={55 + i * 43} className="text-[12px] fill-slate-400 font-bold" textAnchor="end">
                                                    {800 - i * 200}
                                                </text>
                                            </g>
                                        ))}

                                        {/* X Axis Labels */}
                                        {['January', 'February', 'March', 'April', 'May', 'June', 'July'].map((month, i) => (
                                            <text key={i} x={50 + i * 116.6} y="375" className="text-[12px] fill-slate-400 font-bold" textAnchor="middle">
                                                {month}
                                            </text>
                                        ))}

                                        {/* Yellow Line (Dataset 1) */}
                                        <path
                                            d="M 50 320 L 166 280 L 283 180 L 400 220 L 516 120 L 633 240 L 750 250"
                                            fill="none"
                                            stroke="#FFD131"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        {[
                                            [50, 320], [166, 280], [283, 180], [400, 220], [516, 120], [633, 240], [750, 250]
                                        ].map(([x, y], i) => (
                                            <circle key={i} cx={x} cy={y} r="6" fill="#FFD131" stroke="white" strokeWidth="2" />
                                        ))}

                                        {/* Dark Line (Dataset 2) */}
                                        <path
                                            d="M 50 350 L 166 220 L 283 130 L 400 150 L 516 330 L 633 260 L 750 240"
                                            fill="none"
                                            stroke="#1e293b"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        {[
                                            [50, 350], [166, 220], [283, 130], [400, 150], [516, 330], [633, 260], [750, 240]
                                        ].map(([x, y], i) => (
                                            <circle key={i} cx={x} cy={y} r="6" fill="#1e293b" stroke="white" strokeWidth="2" />
                                        ))}
                                    </svg>
                                </div>
                            </div>
                        )}

                        {activeTab === 'error-log' && (
                            <div className="space-y-4">
                                {[1, 2, 3].map((item) => (
                                    <AccordionItem key={item} isOpen={item === 2} />
                                ))}
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="bg-white rounded-3xl p-12 border border-slate-100 text-center">
                                <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Settings2 size={40} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-2">الإعدادات</h3>
                                <p className="text-slate-500">تخصيص تجربة التطبيق والتنبيهات.</p>
                            </div>
                        )}
                    </div>

                </div>
            </Container>
        </div>
    );
};

export default Profile;
