import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Container from './Container';
import { api } from '../lib/api.js';

function pickLang(isEn, ar, en) {
  if (isEn) return (en && String(en).trim()) || ar || '';
  return ar || '';
}

export default function WhyUsSection() {
  const { t, i18n } = useTranslation();
  const [remote, setRemote] = useState(null);

  useEffect(() => {
    api
      .get('/why-us')
      .then((r) => setRemote(r.data))
      .catch(() => setRemote(null));
  }, []);

  const isEn = i18n.language?.startsWith('en');

  const title = useMemo(() => {
    if (!remote) return t('home.whyUsTitle');
    const v = pickLang(isEn, remote.titleAr, remote.titleEn);
    return v.trim() || t('home.whyUsTitle');
  }, [remote, isEn, t]);

  const items = useMemo(() => {
    if (!remote) {
      return [1, 2, 3, 4].map((n) => t(`home.whyUs${n}`));
    }
    return [1, 2, 3, 4].map((n) => {
      const ar = remote[`item${n}Ar`];
      const en = remote[`item${n}En`];
      const v = pickLang(isEn, ar, en);
      return v.trim() || t(`home.whyUs${n}`);
    });
  }, [remote, isEn, t]);

  return (
    <section className="relative overflow-hidden bg-white py-4 md:py-6" dir={i18n.dir()}>
      <Container className="text-center">
        <h2 className="mb-10 text-3xl font-black text-slate-800 md:mb-12 md:text-4xl">{title}</h2>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
          {items.map((text, idx) => (
            <div
              key={idx}
              className="cursor-default rounded-3xl border border-slate-50 bg-white p-4 text-center shadow-sm transition-all hover:border-[#00A651] md:p-6"
            >
              <span className="text-xl font-black text-slate-800 md:text-2xl">{text}</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
