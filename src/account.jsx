import React from 'react';
import { SCOOTERS } from './data';
import { Badge, Btn, C, FormField, ScooterImg, StyledInput } from './ui';

export default function AccountPage({ onCatalog, onHome }) {
  const [tab, setTab] = React.useState('bookings');

  const bookings = [
    { id: 'SB-28491', scooter: SCOOTERS[0], dates: 'Nov 12 – 15, 2024', status: 'active', days: 3, total: 16.5, zone: 'Seminyak' },
    { id: 'SB-21034', scooter: SCOOTERS[1], dates: 'Oct 5 – 8, 2024', status: 'completed', days: 3, total: 18.6, zone: 'Canggu' },
    { id: 'SB-19208', scooter: SCOOTERS[3], dates: 'Sep 20 – 22, 2024', status: 'completed', days: 2, total: 10.4, zone: 'Kuta' },
  ];

  const navItems = [
    { id: 'bookings', icon: '📋', label: 'My Bookings' },
    { id: 'history', icon: '🕐', label: 'History' },
    { id: 'documents', icon: '📄', label: 'Documents' },
    { id: 'notifications', icon: '🔔', label: 'Notifications' },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', background: C.gray100 }}>
      <div className="account-layout" style={{ padding: '36px 80px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: 28 }}>
        {/* Sidebar */}
        <div>
          <div style={{ background: C.white, borderRadius: 18, padding: 24, marginBottom: 16, border: `1px solid ${C.gray200}`, textAlign: 'center' }}>
            <div style={{ width: 76, height: 76, background: `linear-gradient(135deg, ${C.gold} 0%, #e6b800 100%)`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', boxShadow: '0 8px 24px rgba(255,215,0,0.35)' }}>
              <span style={{ fontFamily: 'Sora', fontWeight: 900, fontSize: 26, color: C.black }}>AK</span>
            </div>
            <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 17, color: C.black, marginBottom: 2 }}>Alex K.</div>
            <div style={{ fontFamily: 'Inter', fontSize: 13, color: C.gray500, marginBottom: 12 }}>alex@example.com</div>
            <Badge variant="gold">★ VIP Member</Badge>
            <div style={{ marginTop: 16, padding: '12px', background: C.gray100, borderRadius: 10 }}>
              <div style={{ fontFamily: 'Inter', fontSize: 11, color: C.gray500, marginBottom: 4 }}>Total Rentals</div>
              <div style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 22, color: C.black }}>3</div>
            </div>
          </div>

          <div style={{ background: C.white, borderRadius: 18, overflow: 'hidden', border: `1px solid ${C.gray200}` }}>
            {navItems.map((item, i) => (
              <div key={item.id} onClick={() => setTab(item.id)} style={{ padding: '15px 20px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', background: tab === item.id ? C.gold : C.white, borderTop: i > 0 ? `1px solid ${C.gray200}` : 'none', transition: 'background 0.2s' }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                <span style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 14, color: C.black }}>{item.label}</span>
                {tab === item.id && <span style={{ marginLeft: 'auto', fontSize: 12, color: C.black, opacity: 0.5 }}>→</span>}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16 }}>
            <Btn variant="outline" fullWidth onClick={onHome}>← Back to Home</Btn>
          </div>
        </div>

        {/* Content */}
        <div>
          {tab === 'bookings' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 32, letterSpacing: '-0.04em', color: C.black, margin: 0 }}>My Bookings</h2>
                <Btn variant="primary" onClick={onCatalog}>+ New Booking</Btn>
              </div>
              {bookings.map(b => (
                <div className="account-booking-card" key={b.id} style={{ background: C.white, borderRadius: 18, padding: '24px', marginBottom: 16, border: `1px solid ${C.gray200}`, display: 'flex', gap: 20, alignItems: 'center' }}>
                  <div style={{ width: 110, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
                    <ScooterImg scooter={b.scooter} height={78} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div>
                        <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 17, color: C.black, marginBottom: 4, letterSpacing: '-0.02em' }}>{b.scooter.name}</div>
                        <div style={{ fontFamily: 'Inter', fontSize: 13, color: C.gray500 }}>{b.dates} · {b.zone} · #{b.id}</div>
                      </div>
                      <Badge variant={b.status === 'active' ? 'green' : 'default'}>{b.status === 'active' ? '● Active' : 'Completed'}</Badge>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <span style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 18, color: C.black }}>${b.total}</span>
                      <span style={{ fontFamily: 'Inter', fontSize: 13, color: C.gray500 }}>{b.days} days</span>
                      <div className="account-booking-actions" style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
                        {b.status === 'active' && <Btn variant="dark" size="sm">Track Delivery</Btn>}
                        {b.status === 'completed' && <Btn variant="outline" size="sm" onClick={onCatalog}>Book Again</Btn>}
                        <Btn variant="ghost" size="sm">Details</Btn>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'documents' && (
            <div>
              <h2 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 32, letterSpacing: '-0.04em', color: C.black, margin: '0 0 24px' }}>Documents</h2>
              <div style={{ background: C.white, borderRadius: 18, padding: 32, border: `1px solid ${C.gray200}` }}>
                {[
                  { name: 'Passport / ID', status: 'verified', date: 'Oct 2024' },
                  { name: "Driver's License", status: 'verified', date: 'Oct 2024' },
                  { name: 'International Driving Permit', status: 'pending', date: '' },
                ].map(doc => (
                  <div key={doc.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 0', borderBottom: `1px solid ${C.gray200}` }}>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                      <div style={{ width: 44, height: 44, background: C.gray100, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📄</div>
                      <div>
                        <div style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: 15, color: C.black }}>{doc.name}</div>
                        {doc.date && <div style={{ fontFamily: 'Inter', fontSize: 12, color: C.gray500 }}>Uploaded {doc.date}</div>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <Badge variant={doc.status === 'verified' ? 'green' : 'orange'}>{doc.status}</Badge>
                      {doc.status !== 'verified' && <Btn variant="dark" size="sm">Upload</Btn>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'notifications' && (
            <div>
              <h2 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 32, letterSpacing: '-0.04em', color: C.black, margin: '0 0 24px' }}>Notifications</h2>
              <div style={{ background: C.white, borderRadius: 18, overflow: 'hidden', border: `1px solid ${C.gray200}` }}>
                {[
                  { icon: '🛵', title: 'Delivery in progress', body: 'Your Honda PCX 160 is on the way · ETA 15 min', time: '2 min ago', unread: true },
                  { icon: '✅', title: 'Booking Confirmed', body: 'Booking #SB-28491 confirmed for Nov 12', time: '1h ago', unread: true },
                  { icon: '💳', title: 'Payment Received', body: '$16.5 payment processed successfully', time: '1h ago', unread: false },
                  { icon: '⭐', title: 'Rate your experience', body: 'How was your Yamaha NMAX 155?', time: '3 days ago', unread: false },
                ].map((n, i) => (
                  <div key={i} style={{ padding: '18px 24px', display: 'flex', gap: 16, alignItems: 'flex-start', borderBottom: `1px solid ${C.gray200}`, background: n.unread ? 'rgba(255,215,0,0.04)' : C.white }}>
                    <div style={{ width: 44, height: 44, background: n.unread ? C.gold : C.gray100, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{n.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 14, color: C.black, marginBottom: 3 }}>{n.title}</div>
                      <div style={{ fontFamily: 'Inter', fontSize: 13, color: C.gray500 }}>{n.body}</div>
                    </div>
                    <div style={{ fontFamily: 'Inter', fontSize: 11, color: C.gray500, flexShrink: 0, marginTop: 2 }}>{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'profile' && (
            <div>
              <h2 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 32, letterSpacing: '-0.04em', color: C.black, margin: '0 0 24px' }}>Profile</h2>
              <div style={{ background: C.white, borderRadius: 18, padding: 32, border: `1px solid ${C.gray200}` }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  {[['First Name','Alex'],['Last Name','K.'],['Email','alex@example.com'],['Phone','+7 999 000 0000'],['Nationality','Russian'],['Language','Русский']].map(([l, v]) => (
                    <FormField key={l} label={l}>
                      <StyledInput value={v} onChange={() => {}} placeholder={v} />
                    </FormField>
                  ))}
                </div>
                <div style={{ marginTop: 28 }}>
                  <Btn variant="primary">Save Changes</Btn>
                </div>
              </div>
            </div>
          )}

          {tab === 'history' && (
            <div>
              <h2 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 32, letterSpacing: '-0.04em', color: C.black, margin: '0 0 24px' }}>Rental History</h2>
              <div style={{ background: C.white, borderRadius: 18, overflow: 'hidden', border: `1px solid ${C.gray200}` }}>
                <div style={{ padding: '16px 24px', borderBottom: `1px solid ${C.gray200}`, display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 1fr 1fr', gap: 12 }}>
                  {['Vehicle','Dates','Zone','Duration','Total'].map(h => (
                    <span key={h} style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.gray500 }}>{h}</span>
                  ))}
                </div>
                {bookings.map(b => (
                  <div key={b.id} style={{ padding: '16px 24px', borderBottom: `1px solid ${C.gray200}`, display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr 1fr 1fr', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: 14, color: C.black }}>{b.scooter.name}</span>
                    <span style={{ fontFamily: 'Inter', fontSize: 13, color: C.gray700 }}>{b.dates}</span>
                    <span style={{ fontFamily: 'Inter', fontSize: 13, color: C.gray700 }}>{b.zone}</span>
                    <span style={{ fontFamily: 'Inter', fontSize: 13, color: C.gray700 }}>{b.days} days</span>
                    <span style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 14, color: C.black }}>${b.total}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
