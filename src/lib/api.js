import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

let accessToken = sessionStorage.getItem('accessToken');
let refreshToken = localStorage.getItem('refreshToken');

export function setTokens(access, refresh) {
  accessToken = access;
  if (access) sessionStorage.setItem('accessToken', access);
  else sessionStorage.removeItem('accessToken');
  refreshToken = refresh;
  if (refresh) localStorage.setItem('refreshToken', refresh);
  else localStorage.removeItem('refreshToken');
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  sessionStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

export function getAccessToken() {
  const fromSession = sessionStorage.getItem('accessToken');
  if (fromSession) {
    accessToken = fromSession;
    return fromSession;
  }
  return accessToken;
}

export function getRefreshToken() {
  return refreshToken || localStorage.getItem('refreshToken');
}

export const publicBase = baseURL.replace(/\/api\/v1\/?$/, '');

const LEARNER_LANG_KEY = 'learnerLang';

export function getLearnerLang() {
  if (typeof localStorage === 'undefined') return 'ar';
  const v = localStorage.getItem(LEARNER_LANG_KEY);
  return v === 'en' ? 'en' : 'ar';
}

export function setLearnerLang(lang) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(LEARNER_LANG_KEY, lang === 'en' ? 'en' : 'ar');
}

const LANG_QUERY_PATHS = [/^\/exams\/attempts\//, /^\/questions\//, /^\/subjects\/[^/]+\/questions/];

function pathNeedsLangQuery(url) {
  if (!url || typeof url !== 'string') return false;
  const path = url.split('?')[0];
  return LANG_QUERY_PATHS.some((re) => re.test(path));
}

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const t = getAccessToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  const method = (config.method || 'get').toLowerCase();
  const url = config.url || '';
  if (method === 'get' && pathNeedsLangQuery(url)) {
    config.params = { ...config.params, lang: getLearnerLang() };
  }
  return config;
});

let refreshing = null;

function isAuthIdentityRequest(config) {
  const u = `${config?.baseURL || ''}${config?.url || ''}`;
  return ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password'].some(
    (p) => u.includes(p),
  );
}

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    const rt = getRefreshToken();
    if (
      error.response?.status !== 401 ||
      original._retry ||
      !rt ||
      isAuthIdentityRequest(original)
    ) {
      return Promise.reject(error);
    }
    original._retry = true;
    try {
      if (!refreshing) {
        refreshing = axios
          .post(`${baseURL}/auth/refresh`, { refreshToken: rt })
          .then((res) => {
            setTokens(res.data.accessToken, res.data.refreshToken || rt);
            refreshing = null;
          })
          .catch((e) => {
            refreshing = null;
            clearTokens();
            throw e;
          });
      }
      await refreshing;
      original.headers.Authorization = `Bearer ${getAccessToken()}`;
      return api(original);
    } catch {
      return Promise.reject(error);
    }
  },
);

/** Learner profile photo (JPEG/PNG/WebP). Uses api instance for auth + token refresh. */
export async function uploadUserPhoto(file) {
  const fd = new FormData();
  fd.append('file', file);
  const { data } = await api.post('/users/me/photo', fd, {
    transformRequest: [
      (body, headers) => {
        if (headers && typeof headers.delete === 'function') {
          headers.delete('Content-Type');
        } else if (headers && typeof headers === 'object') {
          delete headers['Content-Type'];
        }
        return body;
      },
    ],
  });
  return data.url;
}

export function resolveMediaUrl(pathOrUrl) {
  if (!pathOrUrl) return null;
  if (pathOrUrl.startsWith('http')) return pathOrUrl;
  const p = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${publicBase}${p}`;
}
