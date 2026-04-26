import React from 'react';
import { ADDONS, ZONES } from './data';
import { Badge, Btn, C, Divider, FormField, ScooterImg } from './ui';

export default function BookingPage({ scooter, onAccount, onCatalog, onHome }) {
  const [step, setStep] = React.useState(1);
  const [data, setData] = React.useState({ checkIn: '', checkOut: '', time: '09:00', zone: '', address: '', addons: [], payment: 'card', name: '', card: '', expiry: '', cvv: '' });
  const [done, setDone] = React.useState(false);
  const set = patch => setData(d => ({ ...d, ...patch }));
  const addonsTotal = ADDONS.filter(a => data.addons.includes(a.id)).reduce((s, a) => s + a.priceUSD, 0);
  const days = 3;
  const total = ((scooter?.priceUSD || 0) + addonsTotal) * days;
  const [bookingId] = React.useState(`SB-${Math.floor(Math.random()*90000+10000)}`);
  if (!scooter) {
    return (
      <div style={{ minHeight: '100vh', paddingTop: 72, background: C.gray100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: C.white, borderRadius: 20, border: `1px solid ${C.gray200}`, padding: '40px 32px', textAlign: 'center', maxWidth: 480 }}>
          <h2 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 28, color: C.black, margin: '0 0 12px' }}>Booking unavailable</h2>
          <p style={{ fontFamily: 'Inter', fontSize: 15, lineHeight: 1.7, color: C.gray500, margin: '0 0 24px' }}>Select a scooter from the fleet first, then continue to checkout.</p>
          <Btn variant="dark" onClick={onCatalog}>Go to Fleet</Btn>
        </div>
      </div>
    );
  }

  if (done) return (
    <div style={{ paddingTop: 72, minHeight: '100vh', background: C.gray100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: C.white, borderRadius: 24, padding: '72px 56px', maxWidth: 520, width: '100%', textAlign: 'center', boxShadow: '0 24px 80px rgba(0,0,0,0.1)' }}>
        <div style={{ width: 88, height: 88, background: C.gold, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, margin: '0 auto 28px', boxShadow: '0 12px 40px rgba(255,215,0,0.4)' }}>✓</div>
        <h2 style={{ fontFamily: 'Sora', fontWeight: 900, fontSize: 36, letterSpacing: '-0.04em', color: C.black, margin: '0 0 12px' }}>Booking Confirmed!</h2>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.gray100, borderRadius: 100, padding: '8px 20px', marginBottom: 20 }}>
          <span style={{ fontFamily: 'Inter', fontSize: 14, color: C.gray700 }}>Booking ID:</span>
          <span style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 14, color: C.black }}>#{bookingId}</span>
        </div>
        <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: 1.7, color: C.gray500, margin: '0 0 20px' }}>
          Your <strong style={{ color: C.black }}>{scooter.name}</strong> will be delivered to your address.<br />
          Expect a WhatsApp confirmation shortly.
        </p>
        <div style={{ background: C.gray100, borderRadius: 14, padding: '20px', margin: '0 0 32px', textAlign: 'left' }}>
          {[['Vehicle', scooter.name], ['Duration', `${days} days`], ['Delivery', data.zone || 'Seminyak'], ['Total', `$${total.toFixed(1)}`]].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Inter', fontSize: 14, color: C.gray700, marginBottom: 8 }}>
              <span>{k}</span><strong style={{ color: C.black }}>{v}</strong>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Btn variant="dark" fullWidth onClick={onAccount}>My Bookings</Btn>
          <Btn variant="outline" fullWidth onClick={onHome}>Home</Btn>
        </div>
      </div>
    </div>
  );

  const steps = ['Dates & Delivery', 'Add-ons', 'Payment'];

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', background: C.gray100 }}>
      {/* Header */}
      <div className="page-header" style={{ background: C.white, borderBottom: `1px solid ${C.gray200}`, padding: '22px 80px' }}>
        <div className="booking-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 960, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 22, letterSpacing: '-0.03em', color: C.black, margin: 0 }}>Complete Booking</h2>
          <div className="booking-stepper" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {steps.map((s, i) => (
              <React.Fragment key={s}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: i + 1 < step ? C.black : i + 1 === step ? C.gold : C.gray200, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Sora', fontWeight: 800, fontSize: 12, color: i + 1 < step ? C.white : i + 1 === step ? C.black : C.gray500, transition: 'all 0.3s' }}>
                    {i + 1 < step ? '✓' : i + 1}
                  </div>
                  <span style={{ fontFamily: 'Inter', fontSize: 13, fontWeight: i + 1 === step ? 700 : 400, color: i + 1 === step ? C.black : C.gray500 }}>{s}</span>
                </div>
                {i < steps.length - 1 && <div style={{ width: 28, height: 1.5, background: i + 1 < step ? C.black : C.gray300, margin: '0 4px' }} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="booking-layout" style={{ maxWidth: 960, margin: '36px auto', padding: '0 80px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        {/* Form */}
        <div>
          {step === 1 && (
            <div>
              <div style={{ background: C.white, borderRadius: 18, padding: 32, border: `1px solid ${C.gray200}`, marginBottom: 20 }}>
                <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 20, color: C.black, margin: '0 0 24px', letterSpacing: '-0.02em' }}>Rental Dates</h3>
                <div className="booking-dates" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  {[['Start Date','checkIn'],['End Date','checkOut']].map(([l, k]) => (
                    <FormField key={k} label={l}>
                      <input type="date" value={data[k]} onChange={e => set({ [k]: e.target.value })}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '13px 16px', border: `1.5px solid ${C.gray300}`, borderRadius: 10, fontFamily: 'Inter', fontSize: 15, outline: 'none', cursor: 'pointer' }} />
                    </FormField>
                  ))}
                </div>
                <FormField label="Delivery Time" style={{ maxWidth: 200 }}>
                  <select value={data.time} onChange={e => set({ time: e.target.value })}
                    style={{ width: '100%', padding: '13px 16px', border: `1.5px solid ${C.gray300}`, borderRadius: 10, fontFamily: 'Inter', fontSize: 15, outline: 'none', background: C.white, cursor: 'pointer' }}>
                    {['07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </FormField>
              </div>
              <div style={{ background: C.white, borderRadius: 18, padding: 32, border: `1px solid ${C.gray200}` }}>
                <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 20, color: C.black, margin: '0 0 24px', letterSpacing: '-0.02em' }}>Delivery Address</h3>
                <FormField label="Area / Zone" style={{ marginBottom: 16 }}>
                  <select value={data.zone} onChange={e => set({ zone: e.target.value })}
                    style={{ width: '100%', padding: '13px 16px', border: `1.5px solid ${C.gray300}`, borderRadius: 10, fontFamily: 'Inter', fontSize: 15, outline: 'none', background: C.white }}>
                    <option value="">Select your area...</option>
                    {ZONES.map(z => <option key={z.name} value={z.name}>{z.name} — {z.deliveryFee === 0 ? 'Free delivery' : `Rp ${z.deliveryFee.toLocaleString()} fee`} · {z.time}</option>)}
                  </select>
                </FormField>
                <FormField label="Full Address">
                  <textarea value={data.address} onChange={e => set({ address: e.target.value })} placeholder="Villa name, street number, Banjar, area..."
                    style={{ width: '100%', boxSizing: 'border-box', padding: '13px 16px', border: `1.5px solid ${C.gray300}`, borderRadius: 10, fontFamily: 'Inter', fontSize: 15, outline: 'none', resize: 'vertical', minHeight: 88 }} />
                </FormField>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ background: C.white, borderRadius: 18, padding: 32, border: `1px solid ${C.gray200}` }}>
              <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 20, color: C.black, margin: '0 0 8px', letterSpacing: '-0.02em' }}>Add-ons</h3>
              <p style={{ fontFamily: 'Inter', fontSize: 14, color: C.gray500, margin: '0 0 28px' }}>Enhance your experience — added to your daily rate</p>
              <div className="booking-addons" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
                {ADDONS.map(a => {
                  const on = data.addons.includes(a.id);
                  const toggle = () => set({ addons: on ? data.addons.filter(x => x !== a.id) : [...data.addons, a.id] });
                  return (
                    <div key={a.id} onClick={toggle} style={{ padding: '20px', borderRadius: 14, cursor: 'pointer', border: `1.5px solid ${on ? C.gold : C.gray200}`, background: on ? 'rgba(255,215,0,0.06)' : C.gray100, transition: 'all 0.22s' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <span style={{ fontSize: 28 }}>{a.icon}</span>
                        <div style={{ width: 24, height: 24, borderRadius: 7, border: `2px solid ${on ? C.gold : C.gray300}`, background: on ? C.gold : C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.18s' }}>
                          {on && <span style={{ fontSize: 13, fontWeight: 900, color: C.black }}>✓</span>}
                        </div>
                      </div>
                      <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 14, color: C.black, marginBottom: 3 }}>{a.name}</div>
                      <div style={{ fontFamily: 'Inter', fontSize: 12, color: C.gray500, marginBottom: 10 }}>{a.desc}</div>
                      <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 16, color: C.black }}>+${a.priceUSD}<span style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 11, color: C.gray500 }}>/day</span></div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div style={{ background: C.white, borderRadius: 18, padding: 32, border: `1px solid ${C.gray200}`, marginBottom: 20 }}>
                <h3 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 20, color: C.black, margin: '0 0 24px', letterSpacing: '-0.02em' }}>Payment Method</h3>
                <div className="booking-payments" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
                  {[['card','💳','Card'],['cash','💵','Cash'],['crypto','₿','Crypto']].map(([v, icon, l]) => (
                    <div key={v} onClick={() => set({ payment: v })} style={{ padding: '16px', borderRadius: 12, cursor: 'pointer', border: `1.5px solid ${data.payment === v ? C.black : C.gray200}`, background: data.payment === v ? C.black : C.gray100, textAlign: 'center', transition: 'all 0.2s' }}>
                      <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
                      <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 14, color: data.payment === v ? C.white : C.gray700 }}>{l}</div>
                    </div>
                  ))}
                </div>
                {data.payment === 'card' && (
                  <div style={{ display: 'grid', gap: 16 }}>
                    {[['Cardholder Name','name','text','Your full name'],['Card Number','card','text','1234 5678 9012 3456'],].map(([l, k, t, ph]) => (
                      <FormField key={k} label={l}>
                        <input type={t} value={data[k]} onChange={e => set({ [k]: e.target.value })} placeholder={ph}
                          style={{ width: '100%', boxSizing: 'border-box', padding: '13px 16px', border: `1.5px solid ${C.gray300}`, borderRadius: 10, fontFamily: 'Inter', fontSize: 15, outline: 'none' }} />
                      </FormField>
                    ))}
                    <div className="booking-card-fields" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <FormField label="Expiry">
                        <input type="text" value={data.expiry} onChange={e => set({ expiry: e.target.value })} placeholder="MM / YY"
                          style={{ width: '100%', boxSizing: 'border-box', padding: '13px 16px', border: `1.5px solid ${C.gray300}`, borderRadius: 10, fontFamily: 'Inter', fontSize: 15, outline: 'none' }} />
                      </FormField>
                      <FormField label="CVV">
                        <input type="password" value={data.cvv} onChange={e => set({ cvv: e.target.value })} placeholder="•••" maxLength={3}
                          style={{ width: '100%', boxSizing: 'border-box', padding: '13px 16px', border: `1.5px solid ${C.gray300}`, borderRadius: 10, fontFamily: 'Inter', fontSize: 15, outline: 'none' }} />
                      </FormField>
                    </div>
                  </div>
                )}
                {data.payment === 'cash' && (
                  <div style={{ background: C.gray100, borderRadius: 14, padding: 24 }}>
                    <p style={{ fontFamily: 'Inter', fontSize: 15, color: C.gray700, margin: 0, lineHeight: 1.75 }}>💵 Pay our rider upon delivery in IDR or USD. Exact amount preferred — drivers may not carry change. Amount due: <strong style={{ color: C.black }}>${total.toFixed(1)}</strong></p>
                  </div>
                )}
                {data.payment === 'crypto' && (
                  <div style={{ background: C.gray100, borderRadius: 14, padding: 24 }}>
                    <p style={{ fontFamily: 'Inter', fontSize: 15, color: C.gray700, margin: '0 0 14px', lineHeight: 1.75 }}>₿ We accept BTC, ETH, and USDT (TRC20). A wallet address will be sent via WhatsApp after booking. Rate is locked for 15 minutes.</p>
                    <Badge variant="orange">Rate locked · 15:00 remaining</Badge>
                  </div>
                )}
              </div>
              <Btn variant="primary" size="xl" fullWidth onClick={() => setDone(true)}>Complete Booking — ${total.toFixed(1)} →</Btn>
              <div style={{ textAlign: 'center', marginTop: 12, fontFamily: 'Inter', fontSize: 12, color: C.gray500 }}>🔒 256-bit SSL encryption · PCI DSS compliant</div>
            </div>
          )}

          {step < 3 && (
            <div className="booking-nav" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
              {step > 1 ? <Btn variant="outline" onClick={() => setStep(s => s - 1)}>← Back</Btn> : <div />}
              <Btn variant="dark" size="lg" onClick={() => setStep(s => s + 1)}>Continue →</Btn>
            </div>
          )}
        </div>

        {/* Summary */}
        <div style={{ background: C.white, borderRadius: 18, padding: 24, border: `1px solid ${C.gray200}`, height: 'fit-content', position: 'sticky', top: 92 }}>
          <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 15, color: C.black, marginBottom: 18, letterSpacing: '-0.01em' }}>Booking Summary</div>
          <ScooterImg scooter={scooter} height={140} />
          <div style={{ marginTop: 16, marginBottom: 20 }}>
            <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 16, color: C.black, marginBottom: 6 }}>{scooter.name}</div>
            <div style={{ display: 'flex', gap: 6 }}><Badge>{scooter.engine}</Badge><Badge>{scooter.type}</Badge></div>
          </div>
          <Divider style={{ marginBottom: 18 }} />
          {[
            [`$${scooter.priceUSD}/day × ${days}`, `$${(scooter.priceUSD * days).toFixed(1)}`],
            ...(data.addons.length > 0 ? [['Add-ons × ' + days, `+$${(addonsTotal * days).toFixed(1)}`]] : []),
            ['Delivery', 'Free'],
            ['Helmet', 'Included'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Inter', fontSize: 13, color: C.gray700, marginBottom: 10 }}>
              <span>{k}</span><span>{v}</span>
            </div>
          ))}
          <Divider style={{ margin: '14px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Sora', fontWeight: 800, fontSize: 17, color: C.black }}>
            <span>Total</span><span>${total.toFixed(1)}</span>
          </div>
          <div style={{ marginTop: 16, background: C.gray100, borderRadius: 10, padding: '12px', fontFamily: 'Inter', fontSize: 11, color: C.gray500, textAlign: 'center' }}>🔒 Secure checkout · Free cancellation</div>
        </div>
      </div>
    </div>
  );
}
