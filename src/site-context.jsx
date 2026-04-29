import React from 'react';
import { apiRequest } from './api';

const SiteContext = React.createContext(null);
const STORAGE_KEY = 'scoot-bali-lang';

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
  });

  async function load(nextLang = lang) {
    setState((current) => ({ ...current, loading: true, error: '' }));
    try {
      const data = await apiRequest(`/public/bootstrap/?lang=${encodeURIComponent(nextLang)}`);
      setState({ loading: false, error: '', data });
    } catch (error) {
      setState({ loading: false, error: error.message || 'Failed to load', data: null });
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
