import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, DotIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Container from './Container';
import { api } from '../lib/api.js';

const pickLang = (isEn, ar, en) => {
  if (isEn) return (en && String(en).trim()) || ar || '';
  return ar || '';
};

const FAQSection = () => {
  const { t, i18n } = useTranslation();
  const [openIndex, setOpenIndex] = useState(0);
  const [remote, setRemote] = useState(null);

  useEffect(() => {
    api
      .get('/faq', { params: { scope: 'general' } })
      .then((r) => setRemote(r.data))
      .catch(() => setRemote(null));
  }, []);

  const isEn = i18n.language?.startsWith('en');

  const faqs = useMemo(() => {
    const apiItems = remote?.items;
    if (apiItems && apiItems.length > 0) {
      return apiItems.map((item) => ({
        key: `api-${item.id}`,
        question: pickLang(isEn, item.questionAr, item.questionEn),
        answer: pickLang(isEn, item.answerAr, item.answerEn),
      }));
    }
    return Array.from({ length: 5 }, (_, idx) => ({
      key: `i18n-${idx}`,
      question: t('faq.q1'),
      answer: t('faq.a1'),
    }));
  }, [remote, isEn, t]);

  useEffect(() => {
    setOpenIndex((prev) => {
      if (!faqs.length) return -1;
      return prev >= faqs.length ? 0 : prev;
    });
  }, [faqs.length]);

  const titleHighlight = useMemo(() => {
    const s = remote?.settings;
    if (!s) return t('faq.titleHighlight');
    const v = pickLang(isEn, s.titleHighlightAr, s.titleHighlightEn);
    return v.trim() || t('faq.titleHighlight');
  }, [remote, isEn, t]);

  const titleRest = useMemo(() => {
    const s = remote?.settings;
    if (!s) return t('faq.titleRest');
    const v = pickLang(isEn, s.titleRestAr, s.titleRestEn);
    return v.trim() || t('faq.titleRest');
  }, [remote, isEn, t]);

  const intro = useMemo(() => {
    const s = remote?.settings;
    if (!s) return t('faq.intro');
    const v = pickLang(isEn, s.introAr, s.introEn);
    return v.trim() || t('faq.intro');
  }, [remote, isEn, t]);

  return (
    <section id="faq" className="py-4 md:py-6 bg-white" dir={i18n.dir()}>
      <Container>
        <div className="flex flex-col lg:flex-row-reverse gap-10 md:gap-16">
          <div className="flex-1 space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={faq.key}
                className="bg-white rounded-xl md:rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                  className="w-full p-2 text-start flex items-center justify-between group"
                >
                  <span className="flex justify-between items-center w-full text-lg md:text-xl font-black text-slate-800 group-hover:text-yellow-500 transition-colors gap-2">
                    <div className="flex items-center">
                      <DotIcon size={40} md:size={60} />
                      {faq.question}
                    </div>
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-blue-900 flex items-center justify-center text-slate-100 group-hover:bg-yellow-400 group-hover:text-slate-900 transition-all">
                      {openIndex === idx ? <ChevronUp size={18} md:size={20} /> : <ChevronDown size={18} md:size={20} />}
                    </div>
                  </span>
                </button>
                {openIndex === idx && (
                  <div className="px-4 md:px-6 pb-4 md:pb-6 pt-0">
                    <div className="h-px bg-slate-900/5 mb-4 md:mb-6"></div>
                    <p className="text-slate-500 text-sm md:text-base font-bold leading-relaxed pr-8 md:pr-12 whitespace-pre-wrap">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex-[0.8] text-start self-start lg:self-center">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-4">
              <span className="text-[#FFD131]">{titleHighlight}</span>
              {titleRest}
            </h2>
            <p className="text-slate-400 font-bold text-base md:text-lg mb-6 md:mb-8 max-w-md ms-auto whitespace-pre-wrap">
              {intro}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FAQSection;
