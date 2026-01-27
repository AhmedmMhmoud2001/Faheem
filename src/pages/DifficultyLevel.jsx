import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Container from '../components/Container';
import { ChevronLeft } from 'lucide-react';

const DifficultyLevel = () => {
    const navigate = useNavigate();
    const { subject } = useParams();

    const difficultyLevels = [
        {
            name: 'ضعيف',
            subtitle: 'للمبتدئين',
            level: 1,
            bars: [1, 0, 0, 0]
        },
        {
            name: 'متوسط',
            subtitle: 'تحديات معتدلة',
            level: 2,
            bars: [1, 1, 0, 0]
        },
        {
            name: 'صعب',
            subtitle: 'للطلبة المتقدمين',
            level: 3,
            bars: [1, 1, 1, 0]
        },
        {
            name: 'صعب جدا',
            subtitle: 'مستوي احترافي لأقصى حد',
            level: 4,
            bars: [1, 1, 1, 1]
        }
    ];

    const subjects = {
        algebra: 'الجبر',
        engineering: 'الهندسة',
        statistics: 'الإحصاء',
        calculus: 'التفاضل و التكامل'
    };

    const subjectName = subjects[subject] || 'الموضوع';

    const handleDifficultyClick = (level) => {
        // Navigate to practice page (Solve Questions flow)
        navigate(`/practice/${subject}/${level}`);
    };

    return (
        <div className="min-h-screen bg-slate-50/50 py-8 relative overflow-hidden" dir="rtl">
            <Container>
                {/* Breadcrumb Navigation */}
                <div className="mb-6 flex items-center gap-2 text-slate-600 font-bold">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="hover:text-slate-900 transition-colors"
                    >
                        الرئيسية
                    </button>
                    <ChevronLeft size={20} className="text-slate-400" />
                    <button
                        onClick={() => navigate('/topics')}
                        className="hover:text-slate-900 transition-colors"
                    >
                        المواضيع
                    </button>
                    <ChevronLeft size={20} className="text-slate-400" />
                    <span className="text-slate-900">{subjectName}</span>
                    <ChevronLeft size={20} className="text-slate-400" />
                    <span className="text-slate-900">اختيار المستوى</span>
                </div>

                {/* Page Title */}
                <div className="text-center mb-10 relative z-10">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                        اختر مستوى الصعوبة المناسب لك
                    </h1>
                    <p className="text-lg text-slate-600 font-bold max-w-3xl mx-auto">
                        يمكنك البدء من أي مستوى والانتقال للمستوى التالي بعد الانتهاء منه
                    </p>
                </div>

                {/* Difficulty Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto relative z-10">
                    {difficultyLevels.map((difficulty, idx) => (
                        <div
                            key={idx}
                            onClick={() => handleDifficultyClick(difficulty.level)}
                            className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:border-yellow-400 transition-all cursor-pointer group"
                        >
                            <div className="space-y-4">
                                {/* Title and Subtitle */}
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 mb-2">
                                        {difficulty.name}
                                    </h3>
                                    <p className="text-slate-500 font-bold text-lg">
                                        {difficulty.subtitle}
                                    </p>
                                </div>

                                {/* Difficulty Bar Chart */}
                                <div className="flex items-end gap-2 h-16">
                                    {difficulty.bars.map((bar, barIdx) => (
                                        <div
                                            key={barIdx}
                                            className={`flex-1 rounded-t-lg transition-all ${bar === 1
                                                    ? 'bg-[#FFD131] h-full'
                                                    : 'bg-slate-200 h-4'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
};

export default DifficultyLevel;

