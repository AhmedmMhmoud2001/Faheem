import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Copy, Save, X, Sigma } from 'lucide-react';
import Container from '../components/Container';
import MathText from '../components/MathText.jsx';
import { api } from '../lib/api.js';

const SAMPLE_STEM =
  'أوجد قيمة: $$x=\\\\frac{-b\\\\pm\\\\sqrt{b^2-4ac}}{2a}$$\\n\\nومثال inline: مساحة الدائرة هي $A=\\\\pi r^2$.';
const SAMPLE_EXPLANATION =
  'نستخدم القانون العام لحل المعادلة التربيعية:\\n\\n$$x=\\\\frac{-b\\\\pm\\\\sqrt{b^2-4ac}}{2a}$$\\n\\nمثال جذر: $\\\\sqrt{16}=4$.';

function linesToOptions(value) {
  return String(value || '')
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function insertAtSelection(textarea, valueToInsert) {
  if (!textarea) return null;
  const start = textarea.selectionStart ?? 0;
  const end = textarea.selectionEnd ?? start;
  const v = textarea.value ?? '';
  const next = v.slice(0, start) + valueToInsert + v.slice(end);
  const nextPos = start + valueToInsert.length;
  return { next, nextPos };
}

function sanitizeMathLiveLatex(latex) {
  // MathLive may output \left/\right which are fine for KaTeX.
  // Keep it as-is; just ensure it's a string.
  return String(latex || '').trim();
}

export default function QuestionAuthoring() {
  const navigate = useNavigate();
  const [stem, setStem] = useState(SAMPLE_STEM);
  const [optionsText, setOptionsText] = useState(
    ['الإجابة 1: $\\\\frac{1}{2}$', 'الإجابة 2: $\\\\sqrt{2}$', 'الإجابة 3: $2$', 'الإجابة 4: $\\\\pi$'].join('\n'),
  );
  const [correctIndex, setCorrectIndex] = useState(0);
  const [explanation, setExplanation] = useState(SAMPLE_EXPLANATION);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  // MathLive modal state
  const [mathOpen, setMathOpen] = useState(false);
  const [mathMode, setMathMode] = useState('block'); // 'inline' | 'block'
  const [activeField, setActiveField] = useState(null); // 'stem' | 'options' | 'explanation'
  const mathFieldRef = useRef(null);
  const stemRef = useRef(null);
  const optionsRef = useRef(null);
  const explanationRef = useRef(null);

  useEffect(() => {
    // Registers <math-field> web component
    // eslint-disable-next-line import/no-unresolved
    import('mathlive');
  }, []);

  useEffect(() => {
    if (!mathOpen) return;
    const el = mathFieldRef.current;
    if (!el) return;
    try {
      el.setOptions?.({
        virtualKeyboardMode: 'onfocus',
        virtualKeyboards: 'all',
      });
      // Focus to show keyboard
      setTimeout(() => {
        try {
          el.focus?.();
          el.executeCommand?.('showVirtualKeyboard');
        } catch {
          /* ignore */
        }
      }, 0);
    } catch {
      /* ignore */
    }
  }, [mathOpen]);

  const openMathFor = (field) => {
    setActiveField(field);
    setMathMode('block');
    setMathOpen(true);
  };

  const closeMath = () => {
    setMathOpen(false);
    setTimeout(() => {
      const target =
        activeField === 'stem'
          ? stemRef.current
          : activeField === 'options'
            ? optionsRef.current
            : activeField === 'explanation'
              ? explanationRef.current
              : null;
      target?.focus?.();
    }, 0);
  };

  const applyMath = () => {
    const el = mathFieldRef.current;
    if (!el) return;
    const rawLatex = el.getValue?.('latex') ?? el.value ?? '';
    const latex = sanitizeMathLiveLatex(rawLatex);
    if (!latex) return;
    const wrapped = mathMode === 'inline' ? `$${latex}$` : `$$${latex}$$`;

    if (activeField === 'stem') {
      const ins = insertAtSelection(stemRef.current, wrapped);
      if (ins) {
        setStem(ins.next);
        setTimeout(() => {
          stemRef.current?.focus?.();
          stemRef.current?.setSelectionRange?.(ins.nextPos, ins.nextPos);
        }, 0);
      }
    } else if (activeField === 'options') {
      const ins = insertAtSelection(optionsRef.current, wrapped);
      if (ins) {
        setOptionsText(ins.next);
        setTimeout(() => {
          optionsRef.current?.focus?.();
          optionsRef.current?.setSelectionRange?.(ins.nextPos, ins.nextPos);
        }, 0);
      }
    } else if (activeField === 'explanation') {
      const ins = insertAtSelection(explanationRef.current, wrapped);
      if (ins) {
        setExplanation(ins.next);
        setTimeout(() => {
          explanationRef.current?.focus?.();
          explanationRef.current?.setSelectionRange?.(ins.nextPos, ins.nextPos);
        }, 0);
      }
    }
    setMathOpen(false);
  };

  const options = useMemo(() => linesToOptions(optionsText), [optionsText]);

  const payload = useMemo(
    () => ({
      stem,
      options,
      correctIndex: Number(correctIndex) || 0,
      explanation,
    }),
    [stem, options, correctIndex, explanation],
  );

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      setStatus('تم نسخ JSON بنجاح');
      setTimeout(() => setStatus(''), 2500);
    } catch {
      setStatus('تعذر النسخ. انسخ يدويًا من مربع JSON.');
    }
  };

  const saveToApi = async () => {
    setSaving(true);
    setStatus('');
    try {
      await api.post('/questions', payload);
      setStatus('تم الحفظ بنجاح');
    } catch (e) {
      const msg = e.response?.data?.message || e.message || 'تعذر الحفظ';
      setStatus(`فشل الحفظ: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans" dir="rtl">
      <Container className="pt-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-lg font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft size={20} />
            <span>العودة للداشبورد</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={copyJson}
              className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2 font-black text-slate-800 hover:bg-slate-50 transition-all shadow-sm"
            >
              <Copy size={18} />
              <span>نسخ JSON</span>
            </button>

            <button
              type="button"
              onClick={saveToApi}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-[#00A651] px-4 py-2 font-black text-white hover:bg-slate-900 transition-all shadow-lg shadow-green-200/40 disabled:opacity-60"
            >
              <Save size={18} />
              <span>{saving ? 'جاري الحفظ...' : 'حفظ (API)'}</span>
            </button>
          </div>
        </div>

        {status ? (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white px-6 py-4 font-bold text-slate-700">
            {status}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h2 className="text-xl font-black text-slate-900">نص السؤال (يدعم $...$ و $$...$$)</h2>
                <button
                  type="button"
                  onClick={() => openMathFor('stem')}
                  className="flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2 font-black hover:bg-slate-800 transition-colors"
                >
                  <Sigma size={18} />
                  <span>لوحة المعادلات</span>
                </button>
              </div>
              <textarea
                value={stem}
                onChange={(e) => setStem(e.target.value)}
                ref={stemRef}
                rows={7}
                className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#00A651]"
              />
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h2 className="text-xl font-black text-slate-900">الاختيارات (كل سطر اختيار)</h2>
                <button
                  type="button"
                  onClick={() => openMathFor('options')}
                  className="flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2 font-black hover:bg-slate-800 transition-colors"
                >
                  <Sigma size={18} />
                  <span>لوحة المعادلات</span>
                </button>
              </div>
              <textarea
                value={optionsText}
                onChange={(e) => setOptionsText(e.target.value)}
                ref={optionsRef}
                rows={7}
                className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#00A651]"
              />

              <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
                <label className="font-black text-slate-800">رقم الإجابة الصحيحة (0-based)</label>
                <input
                  type="number"
                  min={0}
                  max={Math.max(0, options.length - 1)}
                  value={correctIndex}
                  onChange={(e) => setCorrectIndex(e.target.value)}
                  className="w-28 rounded-xl bg-white border border-slate-200 px-3 py-2 font-black text-slate-800 outline-none focus:ring-2 focus:ring-[#00A651]"
                />
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h2 className="text-xl font-black text-slate-900">الشرح / الحل</h2>
                <button
                  type="button"
                  onClick={() => openMathFor('explanation')}
                  className="flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-2 font-black hover:bg-slate-800 transition-colors"
                >
                  <Sigma size={18} />
                  <span>لوحة المعادلات</span>
                </button>
              </div>
              <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                ref={explanationRef}
                rows={8}
                className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#00A651]"
              />
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 mb-3">JSON (للمراجعة)</h2>
              <pre className="w-full overflow-auto rounded-2xl bg-slate-950 text-slate-100 p-4 text-xs leading-relaxed">
                {JSON.stringify(payload, null, 2)}
              </pre>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 mb-4">معاينة السؤال</h2>
              <MathText value={stem} dir="rtl" className="prose max-w-none font-bold text-slate-800" />
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 mb-4">معاينة الاختيارات</h2>
              <div className="space-y-3">
                {options.map((opt, idx) => (
                  <div
                    key={idx}
                    className={`rounded-2xl border-2 p-4 ${
                      idx === Number(correctIndex) ? 'border-[#00A651] bg-green-50' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <MathText value={opt} dir="rtl" className="font-bold text-slate-800 flex-1" />
                      <span className="font-black text-slate-500">{idx}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-slate-900 mb-4">معاينة الشرح</h2>
              <MathText value={explanation} dir="rtl" className="prose max-w-none font-bold text-slate-800" />
            </div>
          </div>
        </div>

        {mathOpen ? (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4" dir="rtl">
            <button
              type="button"
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={closeMath}
              aria-label="close"
            />

            <div className="relative w-full max-w-3xl rounded-[2rem] bg-white border border-slate-200 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center text-[#00A651] font-black">
                    ∑
                  </div>
                  <div>
                    <div className="font-black text-slate-900 text-lg">إدراج معادلة</div>
                    <div className="text-slate-500 font-bold text-sm">
                      اكتب بالكيبورد الرياضي ثم اضغط “إدراج” لإضافتها داخل النص
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeMath}
                  className="p-2 rounded-full bg-slate-50 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-black text-slate-700">وضع الإدراج:</span>
                  <button
                    type="button"
                    onClick={() => setMathMode('inline')}
                    className={`px-4 py-2 rounded-xl font-black border transition-colors ${
                      mathMode === 'inline'
                        ? 'bg-[#00A651] text-white border-[#00A651]'
                        : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Inline ($...$)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMathMode('block')}
                    className={`px-4 py-2 rounded-xl font-black border transition-colors ${
                      mathMode === 'block'
                        ? 'bg-[#00A651] text-white border-[#00A651]'
                        : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Block ($$...$$)
                  </button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  {/* MathLive Web Component */}
                  <math-field
                    ref={mathFieldRef}
                    class="w-full"
                    style={{
                      width: '100%',
                      minHeight: '64px',
                      padding: '12px 14px',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      background: 'white',
                      fontSize: '22px',
                    }}
                  >
                    x=
                  </math-field>
                  <div className="mt-3 text-xs font-bold text-slate-500">
                    تلميح: استخدم الجذر والكسور من لوحة المفاتيح. سيتم إدراج LaTeX داخل النص مباشرة.
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeMath}
                    className="px-5 py-2.5 rounded-xl font-black border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    type="button"
                    onClick={applyMath}
                    className="px-5 py-2.5 rounded-xl font-black bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                  >
                    إدراج
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Container>
    </div>
  );
}

