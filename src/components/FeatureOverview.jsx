import React from 'react';
import Container from './Container';
import { Folder, Star, FileText, User } from 'lucide-react';

const FeatureOverview = () => {
    const features = [
        {
            icon: Folder,
            value: '4',
            label: 'مواضيع',
            iconBg: 'bg-slate-900',
            iconColor: 'text-white'
        },
        {
            icon: User,
            value: '4.8',
            label: '',
            iconBg: 'bg-yellow-50',
            iconColor: 'text-yellow-500',
            showStars: true
        },
        {
            icon: FileText,
            value: '100%',
            label: 'محاكي للإمتحان الكمية',
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-500'
        },
        {
            icon: User,
            value: '+1000',
            label: 'سؤال',
            iconBg: 'bg-green-50',
            iconColor: 'text-green-500'
        }
    ];

    return (
        <section className="py-16 bg-white" dir="rtl">
            <Container>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:border-yellow-400 transition-all cursor-default text-center"
                        >
                            <div className={`${feature.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                                {feature.showStars ? (
                                    <div className="flex items-center gap-1">
                                        <Star size={24} fill="#FFD131" className="text-yellow-500" />
                                        <span className="text-xl font-black text-slate-900">{feature.value}</span>
                                    </div>
                                ) : (
                                    <feature.icon className={`${feature.iconColor}`} size={32} />
                                )}
                            </div>
                            {feature.showStars ? null : (
                                <>
                                    <div className="text-3xl font-black text-slate-900 mb-2">{feature.value}</div>
                                    <div className="text-slate-600 font-bold">{feature.label}</div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default FeatureOverview;

