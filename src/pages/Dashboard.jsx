import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/Container';
import { HelpCircle, FileText, BarChart2 } from 'lucide-react';
import bg from '../assets/bgpage.png';
import img1 from '../assets/img1.png';
import img2 from '../assets/img2.png';


const Dashboard = () => {
    const navigate = useNavigate();
    const subjects = [
        { name: 'الإحصاء', color: 'bg-blue-700', percentage: '50%', label: 'الإحصاء' },
        { name: 'الجبر', color: 'bg-slate-300', percentage: '', label: 'الجبر', status: 'لم تبدأ بعد' },
        { name: 'التفاضل و التكامل', color: 'bg-green-700', percentage: '50%', label: 'التفاضل و التكامل' },
        { name: 'الهندسة', color: 'bg-orange-600', percentage: '50%', label: 'الهندسة' },
    ];

    return (
        <div className=" bg-white relative overflow-hidden pb-20" dir="rtl">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{
                    backgroundImage: `url(${bg})`,
                    backgroundSize: '400px'
                }}>
            </div>

            <Container className="relative z-10 pt-1">
                {/* Welcome Message */}
                <div className="text-right mb-4 mt-6">
                    <h1 className="text-5xl font-black text-slate-900">مرحباً، نورهان !</h1>
                </div>

                {/* Free Trial Banner */}
                <div className="bg-[#FBFBFC] rounded-[1.2rem] p-3 md:p-4 mb-3 shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-slate-50 flex flex-col md:flex-row justify-between items-center gap-3 bg-orange-50">
                    <div className="text-right flex-1">
                        <h2 className="text-2xl font-black text-slate-800 mb-2">التجربة المجانية</h2>
                        <p className="text-slate-400 font-bold text-xl">متبقي 3 أيام</p>
                    </div>
                    <button
                        onClick={() => navigate('/subscriptions')}
                        className="bg-[#FFD131] hover:bg-slate-900 hover:text-white px-12 py-3 rounded-2xl font-black text-xl transition-all shadow-xl shadow-yellow-200/40 transform hover:-translate-y-1 active:scale-95"
                    >
                        اشترك الآن
                    </button>
                </div>

                {/* Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {/* Solve Questions Card */}
                    <div
                        onClick={() => navigate('/topics')}
                        className="bg-white  rounded-[1.2rem] p-3 md:p-4 shadow-[0_15px_50px_rgba(0,0,0,0.04)] border border-slate-200 flex items-center justify-between group hover:border-[#FFD131] transition-all cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                {/* <HelpCircle size={36} className="text-yellow-400" strokeWidth={1.5} /> */}
                                <img src={img2} alt="" />
                                {/* <div className="absolute -top-1 -right-1 flex gap-0.5">
                                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
                                </div> */}
                            </div>
                            <div className="text-right">
                                <h3 className="text-xl font-black text-slate-800 mb-0">حل اسئلة</h3>
                                <p className="text-slate-500 font-bold text-md">اختر موضوع و ابدأ التدريب</p>
                            </div>
                        </div>
                    </div>

                    {/* Trial Test Card */}
                    <div
                        onClick={() => navigate('/trial-test')}
                        className="bg-white rounded-[1.2rem] p-3 md:p-4 shadow-[0_15px_50px_rgba(0,0,0,0.04)] border border-slate-200 flex items-center justify-between group hover:border-[#FFD131] transition-all cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                {/* <FileText size={36} className="text-slate-700" strokeWidth={1.5} /> */}
                                <img src={img1} alt="" />
                                {/* <div className="absolute -bottom-1 -left-1 bg-yellow-400 p-1.5 rounded-lg">
                                    <div className="w-4 h-4 text-slate-900 overflow-hidden">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                            <path d="M12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round" />
                                            <circle cx="12" cy="12" r="9" />
                                        </svg>
                                    </div>
                                </div> */}
                            </div>
                            <div className="text-right">
                                <h3 className="text-xl font-black text-slate-800 mb-1">اختبار تجريبي</h3>
                                <p className="text-slate-500 font-bold text-md">يحتوي علي 24 سؤال</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Tracking */}
                <div className="space-y-4">
                    <h3 className="text-lg font-black text-slate-800 text-right mb-2 flex items-center justify-start gap-3">
                        تابع رحلة تقدمك في كل موضوع !
                    </h3>

                    <div className="space-y-2">
                        {subjects.map((subject, idx) => (
                            <div key={idx} className="space-y-4">
                                <div className="flex flex-row-reverse justify-between items-center px-2">
                                    <span className="text-2xl font-black text-slate-900">{subject.percentage}</span>
                                    {subject.status && <span className="text-xl font-bold text-slate-400">{subject.status}</span>}
                                    <h4 className={`text-2xl font-black ${subject.color.replace('bg-', 'text-')}`}>{subject.label}</h4>
                                </div>
                                <div className="w-full h-10 bg-slate-100/80 rounded-full overflow-hidden shadow-inner flex items-center">
                                    <div
                                        className={`h-full transition-all duration-1000 ${subject.color} rounded-full`}
                                        style={{
                                            width: subject.percentage ? subject.percentage : '0%',
                                            marginLeft: subject.percentage && subject.name === 'الهندسة' ? '0' : 'auto',

                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Dashboard;
