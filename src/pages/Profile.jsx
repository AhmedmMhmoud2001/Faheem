import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  User,
  Mail,
  Phone,
  Lock,
  Pencil,
  UserPen,
  TrendingUp,
  History,
  Settings2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Camera,
  Loader2,
} from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Container from '../components/Container';
import ProfileProgressChart from '../components/ProfileProgressChart';
import { useAuth } from '../context/AuthContext';
import { api, uploadUserPhoto, resolveMediaUrl } from '../lib/api';

const slugToColor = {
  statistics: 'bg-blue-700',
  algebra: 'bg-slate-400',
  calculus: 'bg-green-700',
  engineering: 'bg-orange-600',
};

function stripHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function formatLocaleDate(iso, lang) {
  if (!iso) return '—';
  const loc = String(lang || 'ar').startsWith('ar') ? 'ar-SA' : 'en-US';
  try {
    return new Date(iso).toLocaleString(loc, { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return '—';
  }
}

function MistakeAccordionItem({ mistake, defaultOpen }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const q = mistake.question;
  const raw = q?.stem || '';
  const plain = stripHtml(raw);
  const preview = plain.length > 180 ? `${plain.slice(0, 180)}…` : plain;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all duration-300">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 p-6 text-start transition-colors hover:bg-slate-50"
      >
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="h-2 w-2 shrink-0 rounded-full bg-amber-500" />
          <span className="truncate text-lg font-bold text-slate-800">
            {preview || t('profile.mistakes.questionNum', { id: q?.id ?? '—' })}
          </span>
        </div>
        <div className="shrink-0 text-slate-400">{isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}</div>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[480px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="space-y-4 px-6 pb-6 pt-0">
          <p className="text-sm font-bold text-slate-500">
            {t('profile.mistakes.lastWrong')}: {formatLocaleDate(mistake.lastWrongAt, i18n.language)} ·{' '}
            {t('profile.mistakes.wrongTimes')}: {mistake.wrongCount} · {t('profile.mistakes.level')}:{' '}
            {q?.difficulty ?? '—'}
          </p>
          <p className="text-base font-bold leading-relaxed text-slate-600">{plain || '—'}</p>
          <button
            type="button"
            onClick={() => navigate(`/explanation/${q.id}`, { state: { questionId: q.id } })}
            className="flex transform items-center gap-2 rounded-xl bg-[#FFD131] px-6 py-2.5 font-bold shadow-lg shadow-yellow-100/50 transition-all hover:bg-slate-900 hover:text-white active:scale-95"
          >
            <HelpCircle size={20} />
            <span>{t('profile.mistakes.explain')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const defaultAvatar = 'https://i.pravatar.cc/150?u=faheem';

const Profile = () => {
  const { t, i18n } = useTranslation();
  const { isLoggedIn, loading: authLoading, refreshMe } = useAuth();
  const [activeTab, setActiveTab] = useState('edit-profile');

  const [progressRows, setProgressRows] = useState([]);
  const [progressLoading, setProgressLoading] = useState(false);

  const [mistakeRows, setMistakeRows] = useState([]);
  const [mistakesMeta, setMistakesMeta] = useState(null);
  const [mistakesLoading, setMistakesLoading] = useState(false);
  const [mistakesPage, setMistakesPage] = useState(1);

  const [meLoading, setMeLoading] = useState(true);
  const [me, setMe] = useState(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const [pwdOpen, setPwdOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdSaving, setPwdSaving] = useState(false);

  const fileRef = useRef(null);

  const loadMe = useCallback(async () => {
    setMeLoading(true);
    setFeedback({ type: '', text: '' });
    try {
      const { data } = await api.get('/users/me');
      setMe(data);
      setFullName(data.fullName || '');
      setPhone(data.phone || '');
    } catch {
      setMe(null);
      setFeedback({ type: 'err', text: t('profile.loadError') });
    } finally {
      setMeLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (!authLoading && isLoggedIn) {
      loadMe();
    }
  }, [authLoading, isLoggedIn, loadMe]);

  const subjectLabel = useCallback(
    (slug, nameAr) => {
      const key = `subjectLabels.${slug}`;
      const translated = t(key);
      return translated === key ? nameAr || slug : translated;
    },
    [t],
  );

  useEffect(() => {
    if (activeTab === 'error-log') setMistakesPage(1);
  }, [activeTab]);

  useEffect(() => {
    if (authLoading || !isLoggedIn || activeTab !== 'progress') return;
    setProgressLoading(true);
    api
      .get('/users/me/progress')
      .then((r) => setProgressRows(r.data.data || []))
      .catch(() => setProgressRows([]))
      .finally(() => setProgressLoading(false));
  }, [authLoading, isLoggedIn, activeTab]);

  useEffect(() => {
    if (authLoading || !isLoggedIn || activeTab !== 'error-log') return;
    setMistakesLoading(true);
    api
      .get('/users/me/mistakes', { params: { page: mistakesPage, limit: 15 } })
      .then((r) => {
        setMistakeRows(r.data.data || []);
        setMistakesMeta(r.data.meta || null);
      })
      .catch(() => {
        setMistakeRows([]);
        setMistakesMeta(null);
      })
      .finally(() => setMistakesLoading(false));
  }, [authLoading, isLoggedIn, activeTab, mistakesPage]);

  const avatarDisplay = me?.avatarUrl ? resolveMediaUrl(me.avatarUrl) : defaultAvatar;

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setPhotoBusy(true);
    setFeedback({ type: '', text: '' });
    try {
      const url = await uploadUserPhoto(file);
      await api.patch('/users/me', { avatarUrl: url });
      await loadMe();
      await refreshMe();
      setFeedback({ type: 'ok', text: t('profile.photo.updated') });
    } catch {
      setFeedback({ type: 'err', text: t('profile.photo.uploadFail') });
    } finally {
      setPhotoBusy(false);
    }
  }

  async function removePhoto() {
    if (!window.confirm(t('profile.photo.removeConfirm'))) return;
    setPhotoBusy(true);
    setFeedback({ type: '', text: '' });
    try {
      await api.patch('/users/me', { avatarUrl: null });
      await loadMe();
      await refreshMe();
      setFeedback({ type: 'ok', text: t('profile.photo.removed') });
    } catch {
      setFeedback({ type: 'err', text: t('profile.photo.removeFail') });
    } finally {
      setPhotoBusy(false);
    }
  }

  async function saveProfile(e) {
    e.preventDefault();
    setSaving(true);
    setFeedback({ type: '', text: '' });
    try {
      await api.patch('/users/me', {
        fullName: fullName.trim(),
        phone: phone.trim() ? phone.trim() : null,
      });
      await loadMe();
      await refreshMe();
      setFeedback({ type: 'ok', text: t('profile.form.saved') });
    } catch (err) {
      const msg = err.response?.data?.message || t('profile.form.saveFail');
      setFeedback({ type: 'err', text: msg });
    } finally {
      setSaving(false);
    }
  }

  async function savePassword(e) {
    e.preventDefault();
    if (newPassword.length < 8) {
      setFeedback({ type: 'err', text: t('profile.security.shortPassword') });
      return;
    }
    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'err', text: t('profile.security.mismatch') });
      return;
    }
    setPwdSaving(true);
    setFeedback({ type: '', text: '' });
    try {
      await api.post('/users/me/password', { currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPwdOpen(false);
      setFeedback({ type: 'ok', text: t('profile.security.success') });
    } catch (err) {
      const msg = err.response?.data?.message || t('profile.security.fail');
      setFeedback({ type: 'err', text: msg });
    } finally {
      setPwdSaving(false);
    }
  }

  if (!authLoading && !isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: '/profile' }} />;
  }

  const tabs = useMemo(
    () => [
      { id: 'edit-profile', label: t('profile.tabs.editProfile'), icon: UserPen },
      { id: 'progress', label: t('profile.tabs.progress'), icon: TrendingUp },
      { id: 'error-log', label: t('profile.tabs.errorLog'), icon: History },
      { id: 'settings', label: t('profile.tabs.settings'), icon: Settings2 },
    ],
    [t],
  );

  return (
    <div className="relative min-h-screen bg-slate-50 pb-20 pt-32 font-sans" dir={i18n.dir()}>
      <div
        className="absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <Container className="relative z-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="w-full lg:w-1/3">
            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg shadow-slate-200/50">
              <div className="flex flex-col">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex w-full items-center gap-4 px-8 py-6 transition-all duration-300 ${
                        activeTab === tab.id
                          ? 'bg-slate-50 font-black text-slate-900'
                          : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                      }`}
                    >
                      {activeTab === tab.id && (
                        <div className="absolute start-0 top-0 h-full w-1.5 bg-[#00AEEF]" />
                      )}
                      <Icon size={24} className={activeTab === tab.id ? 'text-slate-700' : 'text-slate-300'} />
                      <span className="text-xl">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-2/3">
            {activeTab === 'edit-profile' && (
              <div className="space-y-6">
                {feedback.text && (
                  <div
                    className={`rounded-2xl border px-4 py-3 text-sm font-bold ${
                      feedback.type === 'ok'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                        : 'border-red-200 bg-red-50 text-red-800'
                    }`}
                  >
                    {feedback.text}
                  </div>
                )}

                {meLoading ? (
                  <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white py-16 text-slate-500">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="font-bold">{t('profile.loading')}</span>
                  </div>
                ) : (
                  <>
                    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                      <p className="mb-4 text-sm font-bold text-slate-400">{t('profile.photo.sectionTitle')}</p>
                      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
                        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-[#FFD131] bg-slate-100">
                          <img
                            src={avatarDisplay}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                          {photoBusy && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                              <Loader2 className="h-8 w-8 animate-spin text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                          <input
                            ref={fileRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={handlePhotoChange}
                          />
                          <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            disabled={photoBusy}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#00AEEF] px-4 py-2.5 font-bold text-white transition-colors hover:bg-slate-900 disabled:opacity-50"
                          >
                            <Camera size={18} />
                            {t('profile.photo.change')}
                          </button>
                          {me?.avatarUrl && (
                            <button
                              type="button"
                              onClick={removePhoto}
                              disabled={photoBusy}
                              className="rounded-xl border border-slate-200 px-4 py-2.5 font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                            >
                              {t('profile.photo.remove')}
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="mt-3 text-xs text-slate-400">{t('profile.photo.hint')}</p>
                    </div>

                    <form
                      onSubmit={saveProfile}
                      className="space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
                    >
                      <h3 className="text-lg font-black text-slate-800">{t('profile.form.basicTitle')}</h3>

                      <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-500">{t('profile.form.fullName')}</label>
                        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3">
                          <User className="text-slate-300" size={22} />
                          <input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            minLength={2}
                            className="min-w-0 flex-1 bg-transparent font-bold text-slate-800 outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-500">{t('profile.form.email')}</label>
                        <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-100/80 px-4 py-3">
                          <Mail className="text-slate-300" size={22} />
                          <span className="font-bold text-slate-600">{me?.email || '—'}</span>
                        </div>
                        <p className="text-xs text-slate-400">{t('profile.form.emailLocked')}</p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-500">{t('profile.form.phone')}</label>
                        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3">
                          <Phone className="text-slate-300" size={22} />
                          <input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder={t('profile.form.phonePlaceholder')}
                            className="min-w-0 flex-1 bg-transparent font-bold text-slate-800 outline-none placeholder:font-normal"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={saving}
                        className="w-full rounded-xl bg-[#FFD131] py-3.5 font-black text-slate-900 transition-colors hover:bg-slate-900 hover:text-white disabled:opacity-50 sm:w-auto sm:px-10"
                      >
                        {saving ? t('profile.form.saving') : t('profile.form.save')}
                      </button>
                    </form>

                    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                      <button
                        type="button"
                        onClick={() => setPwdOpen(!pwdOpen)}
                        className="flex w-full items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <Lock className="text-slate-300" size={24} />
                          <div className="text-start">
                            <p className="text-sm text-slate-400">{t('profile.security.caption')}</p>
                            <p className="text-lg font-bold text-slate-700">{t('profile.security.changePassword')}</p>
                          </div>
                        </div>
                        <Pencil size={18} className="text-slate-300" />
                      </button>

                      {pwdOpen && (
                        <form onSubmit={savePassword} className="mt-6 space-y-4 border-t border-slate-100 pt-6">
                          <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            placeholder={t('profile.security.current')}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-[#00AEEF]"
                          />
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength={8}
                            placeholder={t('profile.security.new')}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-[#00AEEF]"
                          />
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder={t('profile.security.confirm')}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 font-bold outline-none focus:ring-2 focus:ring-[#00AEEF]"
                          />
                          <button
                            type="submit"
                            disabled={pwdSaving}
                            className="rounded-xl bg-slate-900 px-6 py-3 font-bold text-white hover:bg-slate-800 disabled:opacity-50"
                          >
                            {pwdSaving ? t('profile.security.submitting') : t('profile.security.submit')}
                          </button>
                        </form>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'progress' && (
              <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm lg:p-10">
                <h3 className="mb-2 text-2xl font-black text-slate-900">{t('profile.progress.title')}</h3>
                <p className="mb-6 text-sm font-bold text-slate-500">{t('profile.progress.subtitle')}</p>

                <div className="mb-10 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 md:p-6">
                  <h4 className="mb-1 text-lg font-black text-slate-900">
                    {t('profile.progressChart.sectionTitle')}
                  </h4>
                  <p className="mb-4 text-xs font-bold text-slate-500 md:text-sm">
                    {t('profile.progressChart.sectionSubtitle')}
                  </p>
                  <ProfileProgressChart t={t} />
                </div>

                {progressLoading ? (
                  <div className="flex items-center justify-center gap-2 py-16 text-slate-500">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="font-bold">{t('profile.loading')}</span>
                  </div>
                ) : progressRows.length === 0 ? (
                  <p className="py-12 text-center font-bold text-slate-500">{t('profile.progress.empty')}</p>
                ) : (
                  <div className="space-y-6">
                    {progressRows.map((row) => {
                      const pct = Math.min(100, Math.max(0, row.percentSnapshot ?? 0));
                      const barClass = slugToColor[row.slug] || 'bg-slate-500';
                      const label = subjectLabel(row.slug, row.nameAr);
                      return (
                        <div key={row.subjectId} className="space-y-2">
                          <div className="flex w-full flex-row items-center justify-between gap-3">
                            <h4 className={`text-xl font-black ${barClass.replace('bg-', 'text-')}`}>{label}</h4>
                            <span className="text-xl font-black text-slate-900">{pct}%</span>
                          </div>
                          <p className="text-xs font-bold text-slate-400">
                            {t('profile.progress.correctFrom', {
                              correct: row.answeredCorrect ?? 0,
                              total: row.answeredTotal ?? 0,
                            })}
                            {row.lastActivityAt
                              ? ` · ${t('profile.progress.lastActivity', { date: formatLocaleDate(row.lastActivityAt, i18n.language) })}`
                              : ''}
                          </p>
                          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 shadow-inner">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${barClass}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'error-log' && (
              <div className="space-y-4">
                <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                  <h3 className="mb-1 text-xl font-black text-slate-900">{t('profile.mistakes.title')}</h3>
                  <p className="text-sm font-bold text-slate-500">{t('profile.mistakes.subtitle')}</p>
                </div>
                {mistakesLoading ? (
                  <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-100 bg-white py-16 text-slate-500">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="font-bold">{t('profile.loading')}</span>
                  </div>
                ) : mistakeRows.length === 0 ? (
                  <div className="rounded-2xl border border-slate-100 bg-white py-16 text-center font-bold text-slate-500">
                    {t('profile.mistakes.empty')}
                  </div>
                ) : (
                  <>
                    {mistakeRows.map((m, idx) => (
                      <MistakeAccordionItem key={m.id} mistake={m} defaultOpen={idx === 0} />
                    ))}
                    {mistakesMeta && mistakesMeta.total > mistakesMeta.limit && (
                      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <button
                          type="button"
                          disabled={mistakesPage <= 1 || mistakesLoading}
                          onClick={() => setMistakesPage((p) => Math.max(1, p - 1))}
                          className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-700 disabled:opacity-40"
                        >
                          {t('profile.mistakes.prev')}
                        </button>
                        <span className="text-sm font-bold text-slate-500">
                          {t('profile.mistakes.pageOf', {
                            page: mistakesMeta.page,
                            total: mistakesMeta.total,
                          })}
                        </span>
                        <button
                          type="button"
                          disabled={
                            mistakesLoading ||
                            mistakesMeta.page * mistakesMeta.limit >= mistakesMeta.total
                          }
                          onClick={() => setMistakesPage((p) => p + 1)}
                          className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-700 disabled:opacity-40"
                        >
                          {t('profile.mistakes.next')}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                  <Settings2 size={40} />
                </div>
                <h3 className="mb-2 text-2xl font-black text-slate-900">{t('profile.settings.title')}</h3>
                <p className="text-slate-500">{t('profile.settings.body')}</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Profile;
