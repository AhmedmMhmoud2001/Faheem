import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Container from '../components/Container';
import { ClipboardList, Check, X } from 'lucide-react';

const ExamResult = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const {
        totalQuestions = 24,
        correctCount = 16,
        wrongCount = 8,
        answers = [],
    } = location.state || {};

    const resultDots =
        answers.length > 0 ? answers : Array(24).fill(null).map((_, i) => (i < 8 ? 'wrong' : 'correct'));

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 font-sans" dir={i18n.dir()}>
            <Container>
                <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-100 text-center max-w-5xl mx-auto">
                    <div className="mb-12">
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                            <span>{t('examResult.scorePrefix')}</span>
                            <span className="text-[#FFD131]">{correctCount}</span>
                            <span>{t('examResult.scoreMid')}</span>
                            <span>{totalQuestions}</span>
                            <span>{t('examResult.scoreSuffix')}</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-500 font-bold leading-relaxed max-w-4xl mx-auto">
                            {t('examResult.intro')}
                        </p>
                    </div>

                    <div className={`mb-16 ${i18n.dir() === 'rtl' ? 'text-right' : 'text-left'}`}>
                        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                            <div className="relative shrink-0">
                                <ClipboardList size={40} className="text-slate-300" />
                                <div className="absolute -bottom-1 -end-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center text-white">
                                    <Check size={12} strokeWidth={4} />
                                </div>
                                <div className="absolute -top-1 -start-1 w-5 h-5 bg-red-400 rounded-full border-2 border-white flex items-center justify-center text-white">
                                    <X size={12} strokeWidth={4} />
                                </div>
                            </div>
                            <h2 className="text-3xl font-black text-slate-800">{t('examResult.notesTitle')}</h2>
                        </div>

                        <div className="flex items-start gap-3 ps-1 pe-4">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#FFD131] mt-2.5 shrink-0" />
                            <p className="text-lg md:text-xl text-slate-600 font-bold leading-relaxed">
                                {t('examResult.noteBody')}
                            </p>
                        </div>
                    </div>

                    <div className={i18n.dir() === 'rtl' ? 'text-right' : 'text-left'}>
                        <h2
                            className={`text-3xl font-black text-slate-800 mb-8 border-b border-slate-100 pb-4 inline-block ${
                                i18n.dir() === 'rtl' ? 'ps-8' : 'pe-8'
                            }`}
                        >
                            {t('examResult.yourAnswers')}
                        </h2>

                        <div
                            className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 mb-8 ${
                                i18n.dir() === 'rtl' ? 'md:flex-row-reverse' : ''
                            }`}
                        >
                            <div className="flex items-center gap-6">
                                <span className="text-2xl font-black text-red-500">
                                    {t('examResult.wrongCount', { count: wrongCount })}
                                </span>
                                <span className="text-sm font-bold text-slate-400">{t('examResult.wrongHint')}</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className="text-2xl font-black text-green-500">
                                    {t('examResult.correctCount', { count: correctCount })}
                                </span>
                                <span className="text-sm font-bold text-slate-400">
                                    {t('examResult.correctHint')}
                                </span>
                            </div>
                        </div>

                        <div
                            className={`flex flex-wrap gap-3 bg-slate-50 p-6 rounded-3xl ${
                                i18n.dir() === 'rtl' ? 'justify-center md:justify-end' : 'justify-center md:justify-start'
                            }`}
                        >
                            {resultDots.map((status, index) => (
                                <div
                                    key={index}
                                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                                        status === 'wrong'
                                            ? 'bg-red-300 border-red-300'
                                            : 'bg-green-300/50 border-green-300'
                                    }`}
                                    title={t('examResult.dotTitle', {
                                        n: index + 1,
                                        status:
                                            status === 'correct'
                                                ? t('examResult.dotCorrect')
                                                : t('examResult.dotWrong'),
                                    })}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mt-12 flex flex-wrap justify-center gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
                        >
                            {t('examResult.backHome')}
                        </button>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="bg-[#FFD131] text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-[#ffc800] transition-colors"
                        >
                            {t('examResult.retry')}
                        </button>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default ExamResult;
