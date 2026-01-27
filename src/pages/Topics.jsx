import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Container from '../components/Container';
import { ChevronLeft, Ruler, TrendingUp } from 'lucide-react';

const Topics = () => {
    const navigate = useNavigate();
    const { subject } = useParams();

    const subjects = [
        {
            name: 'الجبر',
            nameEn: 'algebra',
            color: 'bg-red-500',
            icon: 'x-y',
            iconType: 'text',
            description: 'لوريم ايبسوم دولار سيت أميت دو لوم'
        },
        {
            name: 'الهندسة',
            nameEn: 'engineering',
            color: 'bg-orange-500',
            icon: Ruler,
            iconType: 'component',
            description: 'لوريم ايبسوم دولار سيت أميت كوير'
        },
        {
            name: 'الإحصاء',
            nameEn: 'statistics',
            color: 'bg-blue-500',
            icon: TrendingUp,
            iconType: 'component',
            description: 'لوريم ايبسوم دولار سيت أميت فولي'
        },
        {
            name: 'التفاضل و التكامل',
            nameEn: 'calculus',
            color: 'bg-green-500',
            icon: 'fx',
            iconType: 'text',
            description: 'لوريم ايبسوم دولار سيت أميت كلارين'
        }
    ];

    const handleSubjectClick = (subjectNameEn) => {
        navigate(`/topics/${subjectNameEn}/difficulty`);
    };

    // If subject is provided, show sub-topics (same subjects for now)
    const displaySubjects = subject ? subjects.filter(s => s.nameEn === subject) : subjects;
    const pageTitle = subject
        ? `اختر الموضوع الذي تريد التدرب عليه`
        : `اختر الموضوع الذي تريد التدرب عليه`;
    const pageSubtitle = subject
        ? `كل موضوع يحتوي على مئات الأسئلة بمستويات صعوبة مختلفة`
        : `كل موضوع يحتوي على مئات الأسئلة بمستويات صعوبة مختلفة`;

    return (
        <div className=" bg-slate-50/50 py-12 relative overflow-hidden" dir="rtl">
            <Container>
                {/* Breadcrumb Navigation */}
                <div className="mb-6 flex items-center gap-2 text-slate-600 font-bold">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="hover:text-slate-900 transition-colors"
                    >
                        الرئيسية
                    </button>
                    {subject && (
                        <>
                            <ChevronLeft size={20} className="text-slate-400" />
                            <button
                                onClick={() => navigate('/topics')}
                                className="hover:text-slate-900 transition-colors"
                            >
                                المواضيع
                            </button>
                            <ChevronLeft size={20} className="text-slate-400" />
                            <span className="text-slate-900">
                                {subjects.find(s => s.nameEn === subject)?.name || subject}
                            </span>
                            <ChevronLeft size={20} className="text-slate-400" />
                            <span className="text-slate-900">المواضيع الفرعية</span>
                        </>
                    )}
                    {!subject && (
                        <>
                            <ChevronLeft size={20} className="text-slate-400" />
                            <span className="text-slate-900">المواضيع</span>
                        </>
                    )}
                </div>

                {/* Page Title */}
                <div className="text-center mb-10 relative z-10">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                        {pageTitle}
                    </h1>
                    <p className="text-lg text-slate-600 font-bold max-w-3xl mx-auto">
                        {pageSubtitle}
                    </p>
                </div>

                {/* Subject Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto relative z-10">
                    {displaySubjects.map((subjectItem, idx) => (
                        <div
                            key={idx}
                            onClick={() => handleSubjectClick(subjectItem.nameEn)}
                            className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:border-yellow-400 transition-all cursor-pointer group"
                        >
                            <div className="flex items-start gap-4">
                                {/* Colored Icon Square */}
                                <div className={`${subjectItem.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                    {subjectItem.iconType === 'component' ? (
                                        React.createElement(subjectItem.icon, { size: 32, strokeWidth: 2.5 })
                                    ) : (
                                        <span>{subjectItem.icon}</span>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <h3 className="text-2xl font-black text-slate-900 mb-2">
                                        {subjectItem.name}
                                    </h3>
                                    <p className="text-slate-500 font-bold text-base">
                                        {subjectItem.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
};

export default Topics;

