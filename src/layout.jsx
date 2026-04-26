import React from 'react';
import { LANGS } from './data';
import { Btn, C, Logo } from './ui';

export function Nav({ page, onAccount, onCatalog, onSection }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [langOpen, setLangOpen] = React.useState(false);
  const [lang, setLang] = React.useState('EN');
  const isHome = page === 'home';

  React.useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const light = isHome && !scrolled;

  return (
    <nav className="site-nav" style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
      height: 72, padding: '0 60px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: light ? 'transparent' : 'rgba(255,255,255,0.94)',
      backdropFilter: light ? 'none' : 'blur(20px)',
      borderBottom: light ? 'none' : `1px solid rgba(0,0,0,0.07)`,
      transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
    }}>
      <Logo light={light} onClick={() => onSection('top')} />

      <div className="site-nav__links" style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
        {['Fleet', 'How It Works', 'Locations', 'FAQ'].map(item => (
          <span key={item}
            onClick={() => {
              if (item === 'Fleet') onCatalog();
              if (item === 'How It Works') onSection('how-it-works');
              if (item === 'Locations') onSection('why-scoot-bali');
              if (item === 'FAQ') onSection('faq');
            }}
            style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: light ? 'rgba(255,255,255,0.85)' : C.gray700, cursor: 'pointer', transition: 'color 0.2s' }}>
            {item}
          </span>
        ))}
      </div>

      <div className="site-nav__actions" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ position: 'relative' }}>
          <span onClick={() => setLangOpen(o => !o)} style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: 600, color: light ? 'rgba(255,255,255,0.75)' : C.gray500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
            {LANGS.find(l => l.code === lang)?.flag} {lang} <span style={{ fontSize: 9 }}>▾</span>
          </span>
          {langOpen && (
            <div style={{ position: 'absolute', top: 28, right: 0, background: C.white, borderRadius: 12, boxShadow: '0 12px 40px rgba(0,0,0,0.15)', border: `1px solid ${C.gray200}`, overflow: 'hidden', minWidth: 160, zIndex: 100 }}>
              {LANGS.map(l => (
                <div key={l.code} onClick={() => { setLang(l.code); setLangOpen(false); }} style={{ padding: '11px 16px', fontFamily: 'Inter', fontSize: 14, color: C.black, cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'center', background: lang === l.code ? C.gray100 : C.white }}>
                  <span>{l.flag}</span> {l.label}
                </div>
              ))}
            </div>
          )}
        </div>
        <span className="site-nav__signin" onClick={onAccount} style={{ fontFamily: 'Inter', fontSize: 14, fontWeight: 500, color: light ? 'rgba(255,255,255,0.85)' : C.gray700, cursor: 'pointer' }}>Sign In</span>
        <Btn variant="primary" size="sm" onClick={onCatalog}>Book Now</Btn>
      </div>
    </nav>
  );
}

export function Footer({ onCatalog, onAccount, onSection }) {
  return (
    <footer style={{ background: '#080808', color: C.white }}>
      <div className="site-footer__main" style={{ padding: '80px 80px 56px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 56 }}>
        <div>
          <Logo light onClick={() => onSection('top')} />
          <p style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: 1.75, color: 'rgba(255,255,255,0.45)', maxWidth: 260, margin: '20px 0 28px' }}>
            Premium scooter rental in Bali. Delivered to your door, fueled and ready to ride.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            {['Instagram', 'WhatsApp', 'Telegram'].map(s => (
              <div key={s} style={{ padding: '7px 13px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, fontSize: 11, fontFamily: 'Inter', color: 'rgba(255,255,255,0.45)', cursor: 'pointer' }}>{s}</div>
            ))}
          </div>
        </div>
        {[
          { title: 'Fleet', links: ['Scooters', 'Maxi Scooters', 'Motorcycles', 'All Vehicles'] },
          { title: 'Company', links: ['About Us', 'How It Works', 'Locations', 'Blog'] },
          { title: 'Support', links: ['WhatsApp Chat', 'FAQ', 'Terms & Conditions', 'Privacy Policy'] },
        ].map(col => (
          <div key={col.title}>
            <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 20 }}>{col.title}</div>
            {col.links.map(link => (
              <div key={link} style={{ fontFamily: 'Inter', fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 13, cursor: 'pointer' }}>{link}</div>
            ))}
          </div>
        ))}
      </div>
      <div className="site-footer__bottom" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '24px 80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>© 2025 Scoot Bali. All rights reserved.</span>
        <div style={{ display: 'flex', gap: 16 }}>
          <span onClick={onCatalog} style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>Fleet</span>
          <span onClick={onAccount} style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>Account</span>
          <span onClick={() => onSection('faq')} style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>FAQ</span>
        </div>
      </div>
    </footer>
  );
}
