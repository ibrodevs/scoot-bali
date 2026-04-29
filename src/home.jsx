import React from 'react';
import { useSite } from './site-context';
import { Badge, Btn, C, Divider, FlagMark, Icon, ScooterImg, Stars } from './ui';

function renderStatValue(value, color) {
  const text = String(value || '');
  if (!text.includes('★')) {
    return text;
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span>{text.replace('★', '').trim()}</span>
      <Icon name="star-filled" size={20} color={color} strokeWidth={1.6} />
    </span>
  );
}

export function ScooterCard({ scooter, onOpenScooter }) {
  const { content } = useSite();
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
          <Badge variant={scooter.available ? 'green' : 'red'}>
            <Icon name={scooter.available ? 'check-circle' : 'clock'} size={12} color="currentColor" />
            {scooter.available ? content?.common?.availability?.available : content?.common?.availability?.booked}
          </Badge>
        </div>
        <div style={{ position: 'absolute', top: 14, left: 14 }}>
          <Badge variant="black">{scooter.typeLabel}</Badge>
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
            <div style={{ fontFamily: 'Inter', fontSize: 12, color: C.gray500 }}>{content?.common?.perDay}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
          <Badge>{scooter.engine}</Badge>
          {scooter.features.slice(0, 2).map((feature) => <Badge key={feature}>{feature}</Badge>)}
        </div>
        <Divider style={{ marginBottom: 18 }} />
        <Btn variant="primary" size="md" fullWidth onClick={(event) => { event.stopPropagation(); handle(); }}>
          {content?.detail?.reserveNow}
        </Btn>
      </div>
    </div>
  );
}

export function FAQBlock() {
  const { content } = useSite();
  const [open, setOpen] = React.useState(0);
  const items = content?.home?.faq?.items || [];

  return (
    <div>
      {items.map((item, index) => (
        <div key={item.id || item.q} style={{ borderBottom: `1px solid ${C.gray200}` }}>
          <div onClick={() => setOpen(open === index ? null : index)} style={{ padding: '22px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', gap: 20 }}>
            <span style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: 15, color: C.black, lineHeight: 1.4 }}>{item.q}</span>
            <span style={{ fontSize: 22, color: C.gray500, flexShrink: 0, transition: 'transform 0.25s', transform: open === index ? 'rotate(45deg)' : 'none', lineHeight: 1 }}>+</span>
          </div>
          {open === index && (
            <p style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: 1.75, color: C.gray700, margin: '0 0 20px', maxWidth: 640 }}>{item.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default function HomePage({ onCatalog, onOpenScooter }) {
  const { content, featuredFleet } = useSite();
  const home = content?.home;

  return (
    <div>
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
            <span style={{ fontFamily: 'Inter', fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.gold }}>{home?.hero?.badge}</span>
          </div>

          <h1 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 'clamp(56px, 7.5vw, 100px)', lineHeight: 0.95, letterSpacing: '-0.05em', color: C.white, margin: '0 0 28px' }}>
            {home?.hero?.titleLead}<br /><em style={{ color: C.gold, fontStyle: 'italic', fontWeight: 700 }}>{home?.hero?.titleAccent}</em>
          </h1>
          <p style={{ fontFamily: 'Inter', fontSize: 20, lineHeight: 1.65, color: 'rgba(255,255,255,0.5)', margin: '0 0 56px', maxWidth: 520 }}>
            {home?.hero?.subtitle}
          </p>

          <div className="home-hero__search" style={{
            background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(28px)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18,
            padding: '28px 32px', display: 'flex', alignItems: 'center',
            gap: 0, maxWidth: 880,
          }}>
            {(home?.hero?.searchFields || []).map((field, index) => (
              <React.Fragment key={field.label}>
                {index > 0 && <div className="home-hero__search-divider" style={{ width: 1, height: 52, background: 'rgba(255,255,255,0.12)', margin: '0 28px' }} />}
                <div className="home-hero__search-field" style={{ flex: index === 0 ? 2 : index === 1 ? 1.5 : 1 }}>
                  <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 7 }}>{field.label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon name={field.icon} size={16} color={C.gold} />
                    <span style={{ fontFamily: 'Inter', fontSize: 15, fontWeight: 500, color: 'rgba(255,255,255,0.85)' }}>{field.hint}</span>
                  </div>
                </div>
              </React.Fragment>
            ))}
            <div className="home-hero__search-action" style={{ marginLeft: 28 }}>
              <Btn variant="primary" size="lg" onClick={onCatalog} style={{ borderRadius: 12, fontSize: 15 }}>{home?.hero?.searchButton}</Btn>
            </div>
          </div>

          <div className="home-hero__stats" style={{ display: 'flex', gap: 48, marginTop: 52 }}>
            {(home?.stats || []).map((item) => (
              <div key={item.value}>
                <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 22, color: C.white, letterSpacing: '-0.03em' }}>{renderStatValue(item.value, C.gold)}</div>
                <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(255,255,255,0.38)', marginTop: 3, letterSpacing: '0.04em' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 44, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'Inter', fontSize: 10, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.25)' }}>{home?.hero?.scroll}</span>
          <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, rgba(255,255,255,0.25), transparent)' }} />
        </div>
      </section>

      <section className="page-section" style={{ padding: '120px 80px', background: C.white }}>
        <div className="home-popular__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 64 }}>
          <div>
            <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.gold, marginBottom: 14 }}>{home?.fleet?.eyebrow}</div>
            <h2 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 52, letterSpacing: '-0.04em', color: C.black, margin: 0, lineHeight: 1 }}>{home?.fleet?.title}</h2>
          </div>
          <Btn variant="outline" onClick={onCatalog}>{home?.fleet?.cta}</Btn>
        </div>
        <div className="home-popular__grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
          {featuredFleet.map((item) => <ScooterCard key={item.id} scooter={item} onOpenScooter={onOpenScooter} />)}
        </div>
      </section>

      <section className="page-section" id="how-it-works" style={{ padding: '120px 80px', background: C.gray100 }}>
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.gold, marginBottom: 14 }}>{home?.process?.eyebrow}</div>
          <h2 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 52, letterSpacing: '-0.04em', color: C.black, margin: '0 0 16px' }}>{home?.process?.title}</h2>
          <p style={{ fontFamily: 'Inter', fontSize: 17, color: C.gray500 }}>{home?.process?.subtitle}</p>
        </div>
        <div className="home-steps__grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderRadius: 20, overflow: 'hidden', maxWidth: 1040, margin: '0 auto' }}>
          {(home?.process?.steps || []).map((step) => (
            <div key={step.n} style={{ background: step.dark ? C.black : C.white, padding: '56px 44px' }}>
              <div style={{ fontFamily: 'Sora', fontWeight: 900, fontSize: 72, color: step.dark ? C.gold : C.gray200, letterSpacing: '-0.06em', lineHeight: 1, marginBottom: 28 }}>{step.n}</div>
              <div style={{ marginBottom: 18 }}>
                <Icon name={step.icon} size={32} color={step.dark ? C.gold : C.black} />
              </div>
              <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 24, color: step.dark ? C.white : C.black, margin: '0 0 14px', letterSpacing: '-0.02em' }}>{step.title}</h3>
              <p style={{ fontFamily: 'Inter', fontSize: 15, lineHeight: 1.75, color: step.dark ? 'rgba(255,255,255,0.55)' : C.gray500, margin: 0 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section" id="why-scoot-bali" style={{ padding: '120px 80px', background: C.white }}>
        <div className="home-why__grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 96, alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.gold, marginBottom: 16 }}>{home?.why?.eyebrow}</div>
            <h2 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 48, letterSpacing: '-0.04em', color: C.black, margin: '0 0 52px', lineHeight: 1.05 }}>{home?.why?.title}</h2>
            {(home?.why?.features || []).map((feature) => (
              <div key={feature.title} style={{ display: 'flex', gap: 20, marginBottom: 32 }}>
                <div style={{ width: 48, height: 48, background: C.gold, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={feature.icon} size={22} color={C.black} />
                </div>
                <div>
                  <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 16, color: C.black, marginBottom: 5, letterSpacing: '-0.01em' }}>{feature.title}</div>
                  <div style={{ fontFamily: 'Inter', fontSize: 14, color: C.gray500, lineHeight: 1.65 }}>{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ height: 580, background: 'linear-gradient(145deg, #0a0a0a 0%, #181818 50%, #0d0d0d 100%)', borderRadius: 24, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                {Array.from({ length: 22 }, (_, index) => <line key={index} x1={index * 30} y1="0" x2={index * 30 - 180} y2="580" stroke="rgba(255,255,255,0.022)" strokeWidth="18" />)}
              </svg>
              <div style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{ fontFamily: 'Inter', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', marginBottom: 12 }}>{home?.why?.lifestyleEyebrow}</div>
                <div style={{ fontFamily: 'Sora', fontSize: 16, fontWeight: 500, color: 'rgba(255,255,255,0.4)' }}>{home?.why?.lifestyleLabel}</div>
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 240, background: 'linear-gradient(to top, rgba(255,215,0,0.06), transparent)' }} />
            </div>
            <div style={{ position: 'absolute', bottom: -20, right: -20, background: C.gold, borderRadius: 16, padding: '20px 24px', boxShadow: '0 12px 40px rgba(255,215,0,0.3)' }}>
              <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 28, color: C.black, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span>4.9</span>
                <Icon name="star-filled" size={24} color={C.black} strokeWidth={1.6} />
              </div>
              <div style={{ fontFamily: 'Inter', fontSize: 12, color: 'rgba(0,0,0,0.6)', marginTop: 2 }}>2,400+ {home?.why?.ratingBadge}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section" style={{ padding: '120px 80px', background: '#060608' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.gold, marginBottom: 14 }}>{home?.reviews?.eyebrow}</div>
          <h2 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 52, letterSpacing: '-0.04em', color: C.white, margin: 0 }}>{home?.reviews?.title}</h2>
        </div>
        <div className="home-testimonials__grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {(home?.reviews?.items || []).map((item) => (
            <div key={`${item.name}-${item.country}`} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '32px 28px' }}>
              <Stars rating={item.rating} size={15} />
              <p style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: 1.75, color: 'rgba(255,255,255,0.7)', margin: '18px 0 24px' }}>"{item.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 42, height: 42, background: C.gold, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Sora', fontWeight: 800, fontSize: 13, color: C.black, flexShrink: 0 }}>{item.avatar}</div>
                <div>
                  <div style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: 14, color: C.white }}>{item.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Inter', fontSize: 12, color: 'rgba(255,255,255,0.38)', marginTop: 2 }}>
                    <FlagMark value={item.flag} size={18} />
                    <span>{item.country}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section" id="faq" style={{ padding: '120px 80px', background: C.white }}>
        <div className="home-faq__grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 96 }}>
          <div>
            <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.gold, marginBottom: 16 }}>{home?.faq?.eyebrow}</div>
            <h2 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 48, letterSpacing: '-0.04em', color: C.black, margin: '0 0 20px', lineHeight: 1.05 }}>{home?.faq?.title}</h2>
            <p style={{ fontFamily: 'Inter', fontSize: 15, color: C.gray500, lineHeight: 1.7, margin: '0 0 32px' }}>{home?.faq?.subtitle}</p>
            <Btn variant="dark">{home?.faq?.button}</Btn>
          </div>
          <FAQBlock />
        </div>
      </section>
    </div>
  );
}
