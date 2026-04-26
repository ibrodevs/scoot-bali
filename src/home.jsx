import React from 'react';
import { SCOOTERS, TESTIMONIALS } from './data';
import { Badge, Btn, C, Divider, ScooterImg, Stars } from './ui';

export function ScooterCard({ scooter, onOpenScooter }) {
  const [hov, setHov] = React.useState(false);
  const handle = () => onOpenScooter(scooter);
  return (
    <div onClick={handle} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: C.white, borderRadius: 18, overflow: 'hidden', cursor: 'pointer',
        border: `1px solid ${hov ? 'rgba(0,0,0,0.1)' : C.gray200}`,
        boxShadow: hov ? '0 24px 64px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
        transform: hov ? 'translateY(-6px)' : 'none',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}>
      <div style={{ position: 'relative' }}>
        <ScooterImg scooter={scooter} height={210} />
        <div style={{ position: 'absolute', top: 14, right: 14 }}>
          <Badge variant={scooter.available ? 'green' : 'red'}>{scooter.available ? '● Available' : '● Booked'}</Badge>
        </div>
        <div style={{ position: 'absolute', top: 14, left: 14 }}>
          <Badge variant="black">{scooter.type}</Badge>
        </div>
      </div>
      <div style={{ padding: '22px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div>
            <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 17, color: C.black, letterSpacing: '-0.02em' }}>{scooter.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <Stars rating={scooter.rating} size={12} />
              <span style={{ fontFamily: 'Inter', fontSize: 12, color: C.gray500 }}>{scooter.rating} ({scooter.reviews})</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 24, color: C.black, letterSpacing: '-0.03em' }}>${scooter.priceUSD}</div>
            <div style={{ fontFamily: 'Inter', fontSize: 12, color: C.gray500 }}>per day</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
          <Badge>{scooter.engine}</Badge>
          {scooter.features.slice(0, 2).map(f => <Badge key={f}>{f}</Badge>)}
        </div>
        <Divider style={{ marginBottom: 18 }} />
        <Btn variant="primary" size="md" fullWidth onClick={e => { e.stopPropagation(); handle(); }}>
          Reserve Now →
        </Btn>
      </div>
    </div>
  );
}

export function FAQBlock() {
  const [open, setOpen] = React.useState(0);
  const items = [
    { q: 'Do I need an international driving license?', a: 'Yes — a valid International Driving Permit (IDP) endorsed for motorcycles is required to legally ride in Bali. We\'re happy to clarify requirements for your country before booking.' },
    { q: 'What\'s included in the rental price?', a: 'Every rental includes one full-face helmet, basic third-party liability insurance, a full tank of fuel, and 24/7 WhatsApp support. Additional add-ons (GPS, full insurance, extra helmets, etc.) are available at checkout.' },
    { q: 'How does delivery work?', a: 'We deliver directly to your villa, hotel, or any Bali address. Seminyak, Canggu, and Kuta are typically 30 minutes. Ubud and Uluwatu up to 90 minutes. Delivery is free to most areas.' },
    { q: 'What payment methods do you accept?', a: 'We accept all major credit and debit cards, cash in IDR or USD, cryptocurrency (BTC, ETH, USDT via TRC20), and bank transfer. Payment is processed securely at booking.' },
    { q: 'What happens if there\'s an accident or breakdown?', a: 'Call us immediately — our team is available 24/7. With the Full Insurance add-on, damages above the deductible are covered. We\'ll arrange a replacement scooter ASAP so your trip continues.' },
    { q: 'Can I extend my rental?', a: 'Absolutely. Contact us via WhatsApp at any time and we\'ll arrange an extension based on availability. Extended days are charged at your original daily rate.' },
  ];
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: `1px solid ${C.gray200}` }}>
          <div onClick={() => setOpen(open === i ? null : i)} style={{ padding: '22px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', gap: 20 }}>
            <span style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: 15, color: C.black, lineHeight: 1.4 }}>{item.q}</span>
            <span style={{ fontSize: 22, color: C.gray500, flexShrink: 0, transition: 'transform 0.25s', transform: open === i ? 'rotate(45deg)' : 'none', lineHeight: 1 }}>+</span>
          </div>
          {open === i && (
            <p style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: 1.75, color: C.gray700, margin: '0 0 20px', maxWidth: 640 }}>{item.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default function HomePage({ onCatalog, onOpenScooter }) {
  return (
    <div>
      {/* ─── HERO ─── */}
      <section id="top" className="home-hero" style={{ minHeight: '100vh', background: '#060608', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 80px' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <defs>
            <pattern id="diag" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse" patternTransform="rotate(-28)">
              <line x1="0" y1="0" x2="0" y2="48" stroke="rgba(255,255,255,0.018)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diag)" />
        </svg>
        <div style={{ position: 'absolute', right: -120, bottom: -120, width: 700, height: 700, background: 'radial-gradient(circle, rgba(255,215,0,0.07) 0%, transparent 68%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: '45%', top: '15%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(255,215,0,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="home-hero__inner" style={{ position: 'relative', zIndex: 1, maxWidth: 860 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 36 }}>
            <div style={{ width: 36, height: 1.5, background: C.gold }} />
            <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold }}>Premium Scooter Rental · Bali, Indonesia</span>
          </div>

          <h1 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 'clamp(56px, 7.5vw, 100px)', lineHeight: 0.95, letterSpacing: '-0.05em', color: C.white, margin: '0 0 28px' }}>
            Bali,<br /><em style={{ color: C.gold, fontStyle: 'italic', fontWeight: 700 }}>Your Way.</em>
          </h1>
          <p style={{ fontFamily: 'Inter', fontSize: 20, lineHeight: 1.65, color: 'rgba(255,255,255,0.5)', margin: '0 0 56px', maxWidth: 500 }}>
            Premium scooters delivered to your villa. Book in 3 minutes, on the road within the hour.
          </p>

          {/* Search widget */}
          <div className="home-hero__search" style={{
            background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(28px)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18,
            padding: '28px 32px', display: 'flex', alignItems: 'center',
            gap: 0, maxWidth: 880,
          }}>
            {[
              { label: 'Delivery Location', hint: 'Your villa or hotel', icon: '📍', flex: 2 },
              { label: 'Start Date', hint: 'Pick a date', icon: '📅', flex: 1.5 },
              { label: 'Duration', hint: '3 days', icon: '⏱', flex: 1 },
            ].map((f, i) => (
              <React.Fragment key={f.label}>
                {i > 0 && <div className="home-hero__search-divider" style={{ width: 1, height: 52, background: 'rgba(255,255,255,0.12)', margin: '0 28px' }} />}
                <div className="home-hero__search-field" style={{ flex: f.flex }}>
                  <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 7 }}>{f.label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{f.icon}</span>
                    <span style={{ fontFamily: 'Inter', fontSize: 15, fontWeight: 500, color: 'rgba(255,255,255,0.85)' }}>{f.hint}</span>
                  </div>
                </div>
              </React.Fragment>
            ))}
            <div className="home-hero__search-action" style={{ marginLeft: 28 }}>
              <Btn variant="primary" size="lg" onClick={onCatalog} style={{ borderRadius: 12, fontSize: 15 }}>Search Fleet →</Btn>
            </div>
          </div>

          <div className="home-hero__stats" style={{ display: 'flex', gap: 48, marginTop: 52 }}>
            {[['2,400+','Happy Riders'],['4.9 ★','Avg. Rating'],['< 1hr','Delivery'],['24 / 7','Support']].map(([n, l]) => (
              <div key={n}>
                <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 22, color: C.white, letterSpacing: '-0.03em' }}>{n}</div>
                <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(255,255,255,0.38)', marginTop: 3, letterSpacing: '0.04em' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 44, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'Inter', fontSize: 10, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.25)' }}>SCROLL</span>
          <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)' }} />
        </div>
      </section>

      {/* ─── POPULAR FLEET ─── */}
      <section className="page-section" style={{ padding: '120px 80px', background: C.white }}>
        <div className="home-popular__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 64 }}>
          <div>
            <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.gold, marginBottom: 14 }}>Our Fleet</div>
            <h2 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 52, letterSpacing: '-0.04em', color: C.black, margin: 0, lineHeight: 1 }}>Popular Rides</h2>
          </div>
          <Btn variant="outline" onClick={onCatalog}>View All Fleet →</Btn>
        </div>
        <div className="home-popular__grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
          {SCOOTERS.slice(0, 3).map(s => <ScooterCard key={s.id} scooter={s} onOpenScooter={onOpenScooter} />)}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="page-section" id="how-it-works" style={{ padding: '120px 80px', background: C.gray100 }}>
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.gold, marginBottom: 14 }}>Process</div>
          <h2 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 52, letterSpacing: '-0.04em', color: C.black, margin: '0 0 16px' }}>Book in 3 Steps</h2>
          <p style={{ fontFamily: 'Inter', fontSize: 17, color: C.gray500 }}>From selection to riding, in under 3 minutes.</p>
        </div>
        <div className="home-steps__grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderRadius: 20, overflow: 'hidden', maxWidth: 1040, margin: '0 auto' }}>
          {[
            { n: '01', title: 'Choose & Book', desc: 'Browse our premium fleet, pick your dates, and complete your booking in minutes. Instant confirmation.', icon: '🛵', dark: false },
            { n: '02', title: 'We Deliver', desc: 'Your scooter arrives at your villa or hotel, fueled, cleaned, and road-ready. Helmet always included.', icon: '📍', dark: true },
            { n: '03', title: 'Ride Bali', desc: 'Explore temples, rice fields, beaches, and cliff roads on your own schedule. We\'re available 24/7.', icon: '✨', dark: false },
          ].map((s, i) => (
            <div key={s.n} style={{ background: s.dark ? C.black : C.white, padding: '56px 44px' }}>
              <div style={{ fontFamily: 'Sora', fontWeight: 900, fontSize: 72, color: s.dark ? C.gold : C.gray200, letterSpacing: '-0.06em', lineHeight: 1, marginBottom: 28 }}>{s.n}</div>
              <div style={{ fontSize: 32, marginBottom: 18 }}>{s.icon}</div>
              <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 24, color: s.dark ? C.white : C.black, margin: '0 0 14px', letterSpacing: '-0.02em' }}>{s.title}</h3>
              <p style={{ fontFamily: 'Inter', fontSize: 15, lineHeight: 1.75, color: s.dark ? 'rgba(255,255,255,0.55)' : C.gray500, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── WHY SCOOT BALI ─── */}
      <section className="page-section" id="why-scoot-bali" style={{ padding: '120px 80px', background: C.white }}>
        <div className="home-why__grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 96, alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.gold, marginBottom: 16 }}>Why Scoot Bali</div>
            <h2 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 48, letterSpacing: '-0.04em', color: C.black, margin: '0 0 52px', lineHeight: 1.05 }}>Rental,<br />reinvented.</h2>
            {[
              { icon: '⚡', title: 'Instant Confirmation', desc: 'Book and receive your confirmation in under 60 seconds. No back-and-forth, no waiting.' },
              { icon: '🚗', title: 'Villa Delivery', desc: 'We come to you. Any address in Bali — villa, hotel, airport pickup, or beach club.' },
              { icon: '🛡️', title: 'Premium Insurance', desc: 'Optional full comprehensive coverage. Ride with complete peace of mind.' },
              { icon: '📱', title: 'Live Tracking', desc: 'Track your delivery in real time via WhatsApp updates and our app.' },
            ].map(f => (
              <div key={f.icon} style={{ display: 'flex', gap: 20, marginBottom: 32 }}>
                <div style={{ width: 48, height: 48, background: C.gold, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{f.icon}</div>
                <div>
                  <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 16, color: C.black, marginBottom: 5, letterSpacing: '-0.01em' }}>{f.title}</div>
                  <div style={{ fontFamily: 'Inter', fontSize: 14, color: C.gray500, lineHeight: 1.65 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ height: 580, background: 'linear-gradient(145deg, #0a0a0a 0%, #181818 50%, #0d0d0d 100%)', borderRadius: 24, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                {Array.from({ length: 22 }, (_, i) => <line key={i} x1={i * 30} y1="0" x2={i * 30 - 180} y2="580" stroke="rgba(255,255,255,0.022)" strokeWidth="18" />)}
              </svg>
              <div style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{ fontFamily: 'Inter', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', marginBottom: 12 }}>lifestyle photography</div>
                <div style={{ fontFamily: 'Sora', fontSize: 16, fontWeight: 500, color: 'rgba(255,255,255,0.4)' }}>Rider exploring Bali</div>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 240, background: 'linear-gradient(to top, rgba(255,215,0,0.06), transparent)' }} />
            </div>
            <div style={{ position: 'absolute', bottom: -20, right: -20, background: C.gold, borderRadius: 16, padding: '20px 24px', boxShadow: '0 12px 40px rgba(255,215,0,0.3)' }}>
              <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 28, color: C.black }}>4.9 ★</div>
              <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(0,0,0,0.6)', marginTop: 2 }}>2,400+ reviews</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="page-section" style={{ padding: '120px 80px', background: '#060608' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.gold, marginBottom: 14 }}>Reviews</div>
          <h2 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 52, letterSpacing: '-0.04em', color: C.white, margin: 0 }}>Loved Worldwide</h2>
        </div>
        <div className="home-testimonials__grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {TESTIMONIALS.map(t => (
            <div key={t.name} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '32px 28px' }}>
              <Stars rating={t.rating} size={15} />
              <p style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: 1.75, color: 'rgba(255,255,255,0.7)', margin: '18px 0 24px' }}>"{t.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 42, height: 42, background: C.gold, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Sora', fontWeight: 800, fontSize: 13, color: C.black, flexShrink: 0 }}>{t.avatar}</div>
                <div>
                  <div style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: 14, color: C.white }}>{t.name}</div>
                  <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(255,255,255,0.38)', marginTop: 2 }}>{t.flag} {t.country}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="page-section" id="faq" style={{ padding: '120px 80px', background: C.white }}>
        <div className="home-faq__grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 96 }}>
          <div>
            <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.gold, marginBottom: 16 }}>FAQ</div>
            <h2 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 48, letterSpacing: '-0.04em', color: C.black, margin: '0 0 20px', lineHeight: 1.05 }}>Questions?<br />We answer.</h2>
            <p style={{ fontFamily: 'Inter', fontSize: 15, color: C.gray500, lineHeight: 1.7, margin: '0 0 32px' }}>Can't find what you're looking for? Chat with us on WhatsApp — we typically respond within 2 minutes.</p>
            <Btn variant="dark">Open WhatsApp ↗</Btn>
          </div>
          <FAQBlock />
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="page-section page-section--tight" style={{ padding: '100px 80px', background: C.gold, textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'Sora', fontWeight: 900, fontSize: 64, letterSpacing: '-0.05em', color: C.black, margin: '0 0 20px', lineHeight: 1 }}>Ready to Ride?</h2>
        <p style={{ fontFamily: 'Inter', fontSize: 18, color: 'rgba(0,0,0,0.55)', margin: '0 0 44px' }}>Join 2,400+ riders who chose Scoot Bali. Delivery in under an hour.</p>
        <div className="home-cta__actions" style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
          <Btn variant="dark" size="xl" onClick={onCatalog}>Browse Fleet →</Btn>
          <Btn variant="outline" size="xl">WhatsApp Us</Btn>
        </div>
      </section>
    </div>
  );
}
