import React from 'react';
import { ADDONS } from './data';
import { Badge, Btn, C, Divider, ScooterImg, Stars } from './ui';

export default function DetailPage({ scooter, onCatalog, onHome, onBookScooter }) {
  const [imgIdx, setImgIdx] = React.useState(0);
  const [tab, setTab] = React.useState('specs');
  const [addons, setAddons] = React.useState([]);
  const days = 3;
  const toggleAddon = id => setAddons(a => a.includes(id) ? a.filter(x => x !== id) : [...a, id]);
  const addonsTotal = ADDONS.filter(a => addons.includes(a.id)).reduce((s, a) => s + a.priceUSD, 0);
  if (!scooter) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: 72, background: C.gray100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: C.white, borderRadius: 20, border: `1px solid ${C.gray200}`, padding: '40px 32px', textAlign: 'center', maxWidth: 480 }}>
          <h2 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 28, color: C.black, margin: '0 0 12px' }}>Scooter not found</h2>
          <p style={{ fontFamily: 'Inter', fontSize: 15, lineHeight: 1.7, color: C.gray500, margin: '0 0 24px' }}>The vehicle you requested is no longer available or the link is invalid.</p>
          <Btn variant="dark" onClick={onCatalog}>Back to Fleet</Btn>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', background: C.gray100 }}>
      <div className="page-subheader" style={{ background: C.white, borderBottom: `1px solid ${C.gray200}`, padding: '14px 80px', display: 'flex', alignItems: 'center', gap: 10 }}>
        {[['Home','home'],['Fleet','catalog'],[scooter.name,null]].map(([label, pg], i) => (
          <React.Fragment key={label}>
            {i > 0 && <span style={{ color: C.gray300, fontSize: 13 }}>/</span>}
            <span onClick={() => {
              if (pg === 'home') onHome();
              if (pg === 'catalog') onCatalog();
            }} style={{ fontFamily: 'Inter', fontSize: 13, color: pg ? C.gray500 : C.black, cursor: pg ? 'pointer' : 'default', fontWeight: pg ? 400 : 500 }}>{label}</span>
          </React.Fragment>
        ))}
      </div>

      <div className="detail-layout" style={{ padding: '36px 80px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 36 }}>
        {/* Left */}
        <div>
          {/* Gallery */}
          <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 10 }}>
            <ScooterImg scooter={scooter} height={460} />
          </div>
          <div className="detail-thumbs" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 36 }}>
            {[0,1,2,3].map(i => (
              <div key={i} onClick={() => setImgIdx(i)} style={{ borderRadius: 12, overflow: 'hidden', border: `2.5px solid ${imgIdx === i ? C.gold : 'transparent'}`, cursor: 'pointer', transition: 'border-color 0.2s' }}>
                <div style={{ height: 80, background: `linear-gradient(${140 + i * 25}deg, ${scooter.accent} 0%, #1e1e1e 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'Inter', fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>View {i + 1}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ background: C.white, borderRadius: 18, overflow: 'hidden', border: `1px solid ${C.gray200}`, marginBottom: 24 }}>
            <div style={{ display: 'flex', borderBottom: `1px solid ${C.gray200}` }}>
              {['specs','conditions','description'].map(t => (
                <div key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '18px', textAlign: 'center', cursor: 'pointer', fontFamily: 'Inter', fontSize: 14, fontWeight: tab === t ? 700 : 500, color: tab === t ? C.black : C.gray500, borderBottom: `2.5px solid ${tab === t ? C.gold : 'transparent'}`, textTransform: 'capitalize', transition: 'all 0.2s' }}>{t}</div>
              ))}
            </div>
            <div style={{ padding: 32 }}>
              {tab === 'specs' && (
                <div className="detail-specs" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                  {Object.entries(scooter.specs).map(([k, v]) => (
                    <div key={k} style={{ background: C.gray100, borderRadius: 12, padding: '18px 22px' }}>
                      <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.gray500, marginBottom: 8 }}>{k}</div>
                      <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 22, color: C.black, letterSpacing: '-0.02em' }}>{v}</div>
                    </div>
                  ))}
                </div>
              )}
              {tab === 'conditions' && (
                <div>
                  {[
                    ['Minimum Age', '18 years + valid driving license'],
                    ['Deposit', `Rp ${scooter.deposit.toLocaleString()} (fully refundable)`],
                    ['Fuel Policy', 'Full to Full — return with same level'],
                    ['Late Return', 'Pro-rated at daily rate per hour'],
                    ['Cancellation', 'Free cancellation up to 24h before delivery'],
                    ['Extension', 'Available at same daily rate, subject to availability'],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', gap: 24, padding: '14px 0', borderBottom: `1px solid ${C.gray200}` }}>
                      <div style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 14, color: C.black, minWidth: 160, flexShrink: 0 }}>{k}</div>
                      <div style={{ fontFamily: 'Inter', fontSize: 14, color: C.gray700, lineHeight: 1.6 }}>{v}</div>
                    </div>
                  ))}
                </div>
              )}
              {tab === 'description' && (
                <p style={{ fontFamily: 'Inter', fontSize: 15, lineHeight: 1.8, color: C.gray700, margin: 0 }}>{scooter.description}</p>
              )}
            </div>
          </div>

          {/* Add-ons */}
          <div style={{ background: C.white, borderRadius: 18, padding: 32, border: `1px solid ${C.gray200}` }}>
            <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 22, color: C.black, margin: '0 0 8px', letterSpacing: '-0.02em' }}>Add-ons</h3>
            <p style={{ fontFamily: 'Inter', fontSize: 14, color: C.gray500, margin: '0 0 24px' }}>Enhance your ride — added to booking automatically</p>
            <div className="detail-addons" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
              {ADDONS.map(a => {
                const on = addons.includes(a.id);
                return (
                  <div key={a.id} onClick={() => toggleAddon(a.id)} style={{ padding: '18px', borderRadius: 14, cursor: 'pointer', border: `1.5px solid ${on ? C.gold : C.gray200}`, background: on ? 'rgba(255,215,0,0.06)' : C.gray100, transition: 'all 0.22s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{ fontSize: 26 }}>{a.icon}</span>
                      <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${on ? C.gold : C.gray300}`, background: on ? C.gold : C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.18s' }}>
                        {on && <span style={{ fontSize: 12, fontWeight: 800, color: C.black }}>✓</span>}
                      </div>
                    </div>
                    <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 14, color: C.black, marginBottom: 3 }}>{a.name}</div>
                    <div style={{ fontFamily: 'Inter', fontSize: 12, color: C.gray500, marginBottom: 8 }}>{a.desc}</div>
                    <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 15, color: C.black }}>+${a.priceUSD}<span style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 11, color: C.gray500 }}>/day</span></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sticky Sidebar */}
        <div style={{ position: 'sticky', top: 92, height: 'fit-content' }}>
          <div style={{ background: C.white, borderRadius: 20, padding: 32, border: `1px solid ${C.gray200}`, boxShadow: '0 8px 40px rgba(0,0,0,0.09)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontFamily: 'Sora', fontWeight: 900, fontSize: 40, color: C.black, letterSpacing: '-0.04em' }}>${scooter.priceUSD}</span>
                  <span style={{ fontFamily: 'Inter', fontSize: 15, color: C.gray500 }}>/day</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <Stars rating={scooter.rating} size={13} />
                  <span style={{ fontFamily: 'Inter', fontSize: 13, color: C.gray500 }}>{scooter.reviews} reviews</span>
                </div>
              </div>
              <Badge variant={scooter.available ? 'green' : 'red'}>{scooter.available ? '● Available' : '● Booked'}</Badge>
            </div>

            <Divider style={{ margin: '20px 0' }} />

            <div style={{ background: C.gray100, borderRadius: 14, overflow: 'hidden', marginBottom: 18 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: `1px solid ${C.gray200}` }}>
                {[['CHECK-IN','Select date'],['CHECK-OUT','Select date']].map(([l,h],i) => (
                  <div key={l} style={{ padding: '14px 16px', borderRight: i === 0 ? `1px solid ${C.gray200}` : 'none', cursor: 'pointer' }}>
                    <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.gray500, marginBottom: 5 }}>{l}</div>
                    <div style={{ fontFamily: 'Inter', fontSize: 14, color: C.gray500 }}>{h}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '14px 16px', cursor: 'pointer' }}>
                <div style={{ fontFamily: 'Inter', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.gray500, marginBottom: 5 }}>DELIVERY LOCATION</div>
                <div style={{ fontFamily: 'Inter', fontSize: 14, color: C.gray500 }}>Your villa or hotel address</div>
              </div>
            </div>

            {addons.length > 0 && (
              <div style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.25)', borderRadius: 12, padding: '14px 16px', marginBottom: 18 }}>
                {ADDONS.filter(a => addons.includes(a.id)).map(a => (
                  <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Inter', fontSize: 13, color: C.black, marginBottom: 5 }}>
                    <span>{a.icon} {a.name}</span><span>+${a.priceUSD}/d</span>
                  </div>
                ))}
              </div>
            )}

            <Btn variant="primary" size="lg" fullWidth onClick={() => onBookScooter(scooter)} style={{ marginBottom: 12 }}>Reserve Now →</Btn>
            <div style={{ textAlign: 'center', fontFamily: 'Inter', fontSize: 12, color: C.gray500, marginBottom: 20 }}>Free cancellation · No card required to reserve</div>

            <Divider style={{ marginBottom: 20 }} />

            {[
              [`$${scooter.priceUSD} × ${days} days`, `$${(scooter.priceUSD * days).toFixed(1)}`],
              addons.length > 0 ? [`Add-ons × ${days} days`, `+$${(addonsTotal * days).toFixed(1)}`] : null,
              ['Delivery', 'Free'],
            ].filter(Boolean).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Inter', fontSize: 14, color: C.gray700, marginBottom: 10 }}>
                <span>{k}</span><span>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Sora', fontWeight: 800, fontSize: 18, color: C.black, paddingTop: 14, borderTop: `1px solid ${C.gray200}`, marginTop: 8 }}>
              <span>Total ({days} days)</span>
              <span>${((scooter.priceUSD + addonsTotal) * days).toFixed(1)}</span>
            </div>

            <div style={{ marginTop: 20, padding: '12px 16px', background: C.gray100, borderRadius: 10, fontFamily: 'Inter', fontSize: 12, color: C.gray700, textAlign: 'center' }}>
              🔒 Secure · SSL Encrypted · PCI Compliant
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
