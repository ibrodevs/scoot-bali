import React from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import AccountPage from './account';
import { AuthProvider } from './auth-context';
import BookingPage from './booking';
import CatalogPage from './catalog';
import DetailPage from './detail';
import HomePage from './home';
import { Footer, Nav } from './layout';
import { SiteProvider, useSite } from './site-context';
import { Btn, C } from './ui';

const BOOTSTRAP_COPY = {
  en: { loading: 'Loading live data...', loadingErrorTitle: 'Unable to load site data', retry: 'Retry' },
  ru: { loading: 'Загружаю данные...', loadingErrorTitle: 'Не удалось загрузить данные сайта', retry: 'Повторить' },
  zh: { loading: '正在加载数据...', loadingErrorTitle: '无法加载网站数据', retry: '重试' },
  id: { loading: 'Memuat data...', loadingErrorTitle: 'Tidak dapat memuat data situs', retry: 'Coba lagi' },
  de: { loading: 'Daten werden geladen...', loadingErrorTitle: 'Webseitendaten konnten nicht geladen werden', retry: 'Erneut versuchen' },
  fr: { loading: 'Chargement des données...', loadingErrorTitle: 'Impossible de charger les données du site', retry: 'Réessayer' },
};

function pageFromPath(pathname) {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/fleet')) return 'catalog';
  if (pathname.startsWith('/booking')) return 'booking';
  if (pathname.startsWith('/account')) return 'account';
  return 'home';
}

function ScrollManager() {
  const location = useLocation();

  React.useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      requestAnimationFrame(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [location.pathname, location.hash]);

  return null;
}

function HardRedirect({ to }) {
  React.useEffect(() => {
    window.location.replace(to);
  }, [to]);

  return null;
}

function AppShell({ children }) {
  const { loading, error, content, reload, lang } = useSite();
  const common = content?.common;
  const bootstrapCopy = BOOTSTRAP_COPY[lang] || BOOTSTRAP_COPY.en;

  if (loading && !content) {
    return (
      <div style={{ minHeight: '100vh', background: C.gray100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 20, padding: '32px 36px', textAlign: 'center', maxWidth: 420 }}>
          <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 28, color: C.black, marginBottom: 12 }}>Scoot Bali</div>
          <div style={{ fontFamily: 'Inter', fontSize: 15, color: C.gray500 }}>{common?.loading || bootstrapCopy.loading}</div>
        </div>
      </div>
    );
  }

  if (error && !content) {
    return (
      <div style={{ minHeight: '100vh', background: C.gray100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 20, padding: '32px 36px', textAlign: 'center', maxWidth: 460 }}>
          <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 26, color: C.black, marginBottom: 10 }}>{common?.loadingErrorTitle || bootstrapCopy.loadingErrorTitle}</div>
          <div style={{ fontFamily: 'Inter', fontSize: 15, lineHeight: 1.7, color: C.gray500, marginBottom: 24 }}>{error}</div>
          <Btn variant="dark" onClick={reload}>{common?.retry || bootstrapCopy.retry}</Btn>
        </div>
      </div>
    );
  }

  return children;
}

function DetailRoute({ onCatalog, onHome, onBookScooter }) {
  const { slug } = useParams();
  const { fleet } = useSite();
  const scooter = fleet.find((item) => item.slug === slug) || null;

  return (
    <DetailPage
      scooter={scooter}
      onBookScooter={onBookScooter}
      onCatalog={onCatalog}
      onHome={onHome}
    />
  );
}

function BookingRoute({ onAccount, onCatalog, onHome }) {
  const { slug } = useParams();
  const { fleet } = useSite();
  const scooter = fleet.find((item) => item.slug === slug) || null;

  return (
    <BookingPage
      scooter={scooter}
      onAccount={onAccount}
      onCatalog={onCatalog}
      onHome={onHome}
    />
  );
}

function RoutedApp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { content } = useSite();
  const page = pageFromPath(location.pathname);
  const nav = content?.nav;

  const goHome = () => navigate('/');
  const goCatalog = () => navigate('/fleet');
  const goAccount = () => navigate('/account');

  const goSection = (sectionId) => {
    if (sectionId === 'top') {
      navigate('/');
      return;
    }

    navigate({ pathname: '/', hash: `#${sectionId}` });
  };

  const openScooter = (scooter) => navigate(`/fleet/${scooter.slug}`);
  const openBooking = (scooter) => navigate(`/booking/${scooter.slug}`);

  return (
    <AppShell>
      <ScrollManager />

      <Nav
        onAccount={goAccount}
        onCatalog={goCatalog}
        onSection={goSection}
        page={page}
      />

      <Routes>
        <Route path="/" element={<HomePage onCatalog={goCatalog} onOpenScooter={openScooter} />} />
        <Route path="/admin" element={<HardRedirect to="/admin/" />} />
        <Route path="/mobile" element={<HardRedirect to="/mobile/" />} />
        <Route path="/fleet" element={<CatalogPage onOpenScooter={openScooter} />} />
        <Route
          path="/fleet/:slug"
          element={<DetailRoute onBookScooter={openBooking} onCatalog={goCatalog} onHome={goHome} />}
        />
        <Route
          path="/booking/:slug"
          element={<BookingRoute onAccount={goAccount} onCatalog={goCatalog} onHome={goHome} />}
        />
        <Route path="/account" element={<AccountPage onCatalog={goCatalog} onHome={goHome} />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>

      <Footer onAccount={goAccount} onCatalog={goCatalog} onSection={goSection} />

      {location.pathname === '/' && (
        <div className="floating-cta">
          <Btn
            onClick={goCatalog}
            size="lg"
            style={{
              borderRadius: 100,
              padding: '16px 32px',
              boxShadow: '0 12px 40px rgba(255,215,0,0.45)',
              fontSize: 15,
            }}
            variant="primary"
          >
            {nav?.bookNow}
          </Btn>
        </div>
      )}
    </AppShell>
  );
}

export default function App() {
  return (
    <SiteProvider>
      <AuthProvider>
        <BrowserRouter>
          <RoutedApp />
        </BrowserRouter>
      </AuthProvider>
    </SiteProvider>
  );
}
