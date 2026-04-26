import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Container from '../components/Container';
import { ClipboardList, Check, X } from 'lucide-react';
import { api, resolveMediaUrl } from '../lib/api.js';
import MathText from '../components/MathText.jsx';

const ExamResult = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const {
        totalQuestions = 24,
        correctCount = 16,
        wrongCount = 8,
        answers = [],
        attemptId = null,
    } = location.state || {};

    const resultDots =
        answers.length > 0 ? answers : Array(24).fill(null).map((_, i) => (i < 8 ? 'wrong' : 'correct'));

    const [attempt, setAttempt] = useState(null);
    const [loading, setLoading] = useState(Boolean(attemptId));

    useEffect(() => {
        let cancelled = false;
        if (!attemptId) {
            setAttempt(null);
            setLoading(false);
            return () => { cancelled = true; };
        }
        (async () => {
            try {
                const { data } = await api.get(`/exams/attempts/${attemptId}`);
                if (!cancelled) setAttempt(data);
            } catch {
                if (!cancelled) setAttempt(null);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [attemptId]);

    const wrongQuestions = useMemo(() => {
        const qs = attempt?.questions || [];
        return qs.filter((q) => q?.isCorrect === false);
    }, [attempt?.questions]);

    const percent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const grade = percent >= 85 ? 'ممتاز' : percent >= 70 ? 'جيد جدًا' : percent >= 50 ? 'جيد' : 'يحتاج تحسين';
    const normalizeOption = (option, idx, question) => {
        const lang = i18n.language === 'en' ? 'en' : 'ar';
        const letter = ['A', 'B', 'C', 'D'][idx] || 'A';
        const legacyImage = lang === 'en'
            ? question?.[`option${letter}ImageUrlEn`] || question?.[`option${letter}ImageUrl`]
            : question?.[`option${letter}ImageUrl`] || question?.[`option${letter}ImageUrlEn`];
        if (typeof option === 'string') {
            return { text: option, imageUrl: legacyImage ? resolveMediaUrl(legacyImage) : null };
        }
        return {
            text: option?.text ?? '',
            imageUrl: option?.imageUrl
                ? resolveMediaUrl(option.imageUrl)
                : legacyImage
                  ? resolveMediaUrl(legacyImage)
                  : null,
        };
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 font-sans" dir={i18n.dir()}>
            <Container>
                <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-100 text-center max-w-5xl mx-auto">
                    <div className="mb-12">
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                            <span>{t('examResult.scorePrefix')}</span>
                            <span className="text-[#00A651]">{correctCount}</span>
                            <span>{t('examResult.scoreMid')}</span>
                            <span>{totalQuestions}</span>
                            <span>{t('examResult.scoreSuffix')}</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-500 font-bold leading-relaxed max-w-4xl mx-auto">
                            {t('examResult.intro')}
                        </p>
                        <div className="mt-6 flex items-center justify-center gap-3">
                            <span className="rounded-2xl bg-slate-50 px-5 py-2 font-black text-slate-700 border border-slate-100">
                                التقييم: {grade} — {percent}%
                            </span>
                        </div>
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
                            <div className="w-2.5 h-2.5 rounded-full bg-[#00A651] mt-2.5 shrink-0" />
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

                    {/* Review wrong answers */}
                    <div className="mt-16 text-start">
                        <h2 className="text-3xl font-black text-slate-800 mb-6">
                            الأسئلة التي أخطأت فيها
                        </h2>

                        {loading ? (
                            <div className="rounded-3xl bg-slate-50 border border-slate-100 p-6 font-bold text-slate-600">
                                جاري تحميل المراجعة...
                            </div>
                        ) : wrongQuestions.length === 0 ? (
                            <div className="rounded-3xl bg-green-50 border border-green-100 p-6 font-black text-green-800">
                                ممتاز! لم تخطئ في أي سؤال.
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {wrongQuestions.map((q, idx) => {
                                    const userIdx = q.userAnswerIndex;
                                    const correctIdx = q.correctIndex;
                                    const userOption =
                                        userIdx == null
                                            ? { text: 'لم تُجب', imageUrl: null }
                                            : normalizeOption((q.options || [])[userIdx] ?? '—', userIdx, q);
                                    const correctOption =
                                        correctIdx == null
                                            ? { text: '—', imageUrl: null }
                                            : normalizeOption((q.options || [])[correctIdx] ?? '—', correctIdx, q);
                                    return (
                                        <div key={q.id || idx} className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
                                            <div className="flex items-start justify-between gap-4 mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-3 h-3 bg-red-500 rounded-full mt-2 shrink-0" />
                                                    <div className="text-xl font-black text-slate-900">
                                                        سؤال {idx + 1}
                                                    </div>
                                                </div>
                                            </div>

                                            <MathText value={q.stem} dir="rtl" className="font-black text-slate-900 text-lg mb-4" />

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
                                                    <div className="font-black text-red-700 mb-2">إجابتك</div>
                                                    <MathText value={userOption.text} dir="rtl" className="font-bold text-slate-800" />
                                                    {userOption.imageUrl && (
                                                        <img
                                                            src={userOption.imageUrl}
                                                            alt=""
                                                            className="mt-3 max-h-36 w-auto rounded-lg border border-red-100 object-contain"
                                                        />
                                                    )}
                                                </div>
                                                <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
                                                    <div className="font-black text-green-700 mb-2">الإجابة الصحيحة</div>
                                                    <MathText value={correctOption.text} dir="rtl" className="font-bold text-slate-800" />
                                                    {correctOption.imageUrl && (
                                                        <img
                                                            src={correctOption.imageUrl}
                                                            alt=""
                                                            className="mt-3 max-h-36 w-auto rounded-lg border border-green-100 object-contain"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
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
                            className="bg-[#00A651] text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-[#ffc800] transition-colors"
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
