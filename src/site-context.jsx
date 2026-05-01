import React from 'react';
import { apiRequest } from './api';

const SiteContext = React.createContext(null);
const STORAGE_KEY = 'scoot-bali-lang';

const ERROR_COPY = {
  en: 'Failed to load data',
  ru: 'Не удалось загрузить данные',
  zh: '无法加载数据',
  id: 'Gagal memuat data',
  de: 'Daten konnten nicht geladen werden',
  fr: 'Impossible de charger les donnees',
};

function preferredLang() {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return stored;
  }
  return 'en';
}

export function SiteProvider({ children }) {
  const [lang, setLang] = React.useState(preferredLang);
  const [state, setState] = React.useState({
    loading: true,
    error: '',
    data: null,
    banners: [],
    reviews: [],
  });

  async function load(nextLang = lang) {
    setState((current) => ({ ...current, loading: true, error: '' }));
    try {
      const [data, banners, reviews] = await Promise.all([
        apiRequest(`/public/bootstrap/?lang=${encodeURIComponent(nextLang)}`),
        apiRequest('/banners/').catch(() => []),
        apiRequest('/reviews/').catch(() => []),
      ]);
      setState({ loading: false, error: '', data, banners: Array.isArray(banners) ? banners : banners?.results || [], reviews: Array.isArray(reviews) ? reviews : reviews?.results || [] });
    } catch (error) {
      setState({ loading: false, error: error.message || ERROR_COPY[nextLang] || ERROR_COPY.en, data: null, banners: [], reviews: [] });
    }
  }

  React.useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    load(lang);
  }, [lang]);

  const data = state.data || {};
  const value = {
    lang,
    setLang,
    loading: state.loading,
    error: state.error,
    reload: () => load(lang),
    languages: data.languages || [],
    content: data.content || null,
    fleet: data.fleet?.items || [],
    featuredFleet: data.fleet?.featured || [],
    addons: data.addons || [],
    deliveryZones: data.deliveryZones || [],
    deliverySlots: data.deliverySlots || [],
    supportLinks: data.supportLinks || [],
    banners: state.banners,
    reviews: state.reviews,
  };

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const context = React.useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used inside SiteProvider');
  }
  return context;
}
