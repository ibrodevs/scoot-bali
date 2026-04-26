import React from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import AccountPage from './account';
import BookingPage from './booking';
import CatalogPage from './catalog';
import { SCOOTERS } from './data';
import DetailPage from './detail';
import HomePage from './home';
import { Footer, Nav } from './layout';
import { Btn } from './ui';

function findScooterBySlug(slug) {
  return SCOOTERS.find((scooter) => scooter.slug === slug) ?? null;
}

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

function DetailRoute({ onCatalog, onHome, onBookScooter }) {
  const { slug } = useParams();
  return (
    <DetailPage
      scooter={findScooterBySlug(slug)}
      onBookScooter={onBookScooter}
      onCatalog={onCatalog}
      onHome={onHome}
    />
  );
}

function BookingRoute({ onAccount, onCatalog, onHome }) {
  const { slug } = useParams();
  return (
    <BookingPage
      scooter={findScooterBySlug(slug)}
      onAccount={onAccount}
      onCatalog={onCatalog}
      onHome={onHome}
    />
  );
}

function HardRedirect({ to }) {
  React.useEffect(() => {
    window.location.replace(to);
  }, [to]);

  return null;
}

function RoutedApp() {
  const location = useLocation();
  const navigate = useNavigate();
  const page = pageFromPath(location.pathname);

  const goHome = () => {
    navigate('/');
  };

  const goCatalog = () => {
    navigate('/fleet');
  };

  const goAccount = () => {
    navigate('/account');
  };

  const goSection = (sectionId) => {
    if (sectionId === 'top') {
      navigate('/');
      return;
    }

    navigate({ pathname: '/', hash: `#${sectionId}` });
  };

  const openScooter = (scooter) => {
    navigate(`/fleet/${scooter.slug}`);
  };

  const openBooking = (scooter) => {
    navigate(`/booking/${scooter.slug}`);
  };

  return (
    <>
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
            Book Now →
          </Btn>
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <RoutedApp />
    </BrowserRouter>
  );
}
