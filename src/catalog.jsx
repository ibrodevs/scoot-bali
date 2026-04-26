import React from 'react';
import { SCOOTERS } from './data';
import { Btn, C } from './ui';
import { ScooterCard } from './home';

export default function CatalogPage({ onOpenScooter }) {
  const [filters, setFilters] = React.useState({ type: 'all', maxPrice: 15, available: false });
  const [sort, setSort] = React.useState('popular');

  const filtered = SCOOTERS.filter(s => {
    if (filters.type !== 'all' && s.type !== filters.type) return false;
    if (filters.available && !s.available) return false;
    if (s.priceUSD > filters.maxPrice) return false;
    return true;
  }).sort((a, b) => {
    if (sort === 'price_asc') return a.priceUSD - b.priceUSD;
    if (sort === 'price_desc') return b.priceUSD - a.priceUSD;
    if (sort === 'rating') return b.rating - a.rating;
    return b.reviews - a.reviews;
  });

  const setF = patch => setFilters(f => ({ ...f, ...patch }));

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', background: C.gray100 }}>
      <div className="page-header" style={{ background: C.white, borderBottom: `1px solid ${C.gray200}`, padding: '36px 80px' }}>
        <div className="catalog-header__row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 40, letterSpacing: '-0.04em', color: C.black, margin: '0 0 6px' }}>Our Fleet</h1>
            <p style={{ fontFamily: 'Inter', fontSize: 15, color: C.gray500, margin: 0 }}>{SCOOTERS.length} premium vehicles available across Bali</p>
          </div>
          <div className="catalog-header__chips" style={{ display: 'flex', gap: 10 }}>
            {['scooter','maxi','moto'].map(t => (
              <div key={t} onClick={() => setF({ type: filters.type === t ? 'all' : t })}
                style={{ padding: '9px 18px', borderRadius: 10, fontFamily: 'Inter', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', background: filters.type === t ? C.black : C.gray100, color: filters.type === t ? C.white : C.gray700, textTransform: 'capitalize' }}>
                {t === 'maxi' ? 'Maxi Scooter' : t === 'moto' ? 'Motorcycle' : 'Scooter'}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="catalog-layout" style={{ display: 'grid', gridTemplateColumns: '268px 1fr', gap: 28, padding: '32px 80px' }}>
        {/* Sidebar */}
        <div style={{ background: C.white, borderRadius: 18, padding: '28px', height: 'fit-content', border: `1px solid ${C.gray200}`, position: 'sticky', top: 96 }}>
          <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 17, color: C.black, marginBottom: 32, letterSpacing: '-0.02em' }}>Filters</div>

          <div style={{ marginBottom: 32 }}>
            <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.gray500, marginBottom: 14 }}>Vehicle Type</div>
            {[['all','All Types'],['scooter','Scooter'],['maxi','Maxi Scooter'],['moto','Motorcycle']].map(([v, l]) => (
              <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, cursor: 'pointer' }}>
                <div onClick={() => setF({ type: v })} style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${filters.type === v ? C.black : C.gray300}`, background: filters.type === v ? C.black : C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.18s' }}>
                  {filters.type === v && <div style={{ width: 7, height: 7, background: C.white, borderRadius: '50%' }} />}
                </div>
                <span style={{ fontFamily: 'Inter', fontSize: 14, color: C.black }}>{l}</span>
              </label>
            ))}
          </div>

          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.gray500 }}>Max Price</div>
              <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 14, color: C.black }}>${filters.maxPrice}<span style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 12, color: C.gray500 }}>/day</span></div>
            </div>
            <input type="range" min={4} max={15} value={filters.maxPrice} onChange={e => setF({ maxPrice: +e.target.value })}
              style={{ width: '100%', accentColor: C.gold, height: 4 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontFamily: 'Inter', fontSize: 11, color: C.gray500 }}>$4</span>
              <span style={{ fontFamily: 'Inter', fontSize: 11, color: C.gray500 }}>$15</span>
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.gray500, marginBottom: 14 }}>Availability</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
              <div onClick={() => setF({ available: !filters.available })} style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${filters.available ? C.gold : C.gray300}`, background: filters.available ? C.gold : C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.18s' }}>
                {filters.available && <span style={{ fontSize: 12, color: C.black, fontWeight: 800, lineHeight: 1 }}>✓</span>}
              </div>
              <span style={{ fontFamily: 'Inter', fontSize: 14, color: C.black }}>Available Now Only</span>
            </label>
          </div>

          <Btn variant="dark" fullWidth onClick={() => setFilters({ type: 'all', maxPrice: 15, available: false })}>Reset All</Btn>
        </div>

        {/* Grid */}
        <div>
          <div className="catalog-results__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <span style={{ fontFamily: 'Inter', fontSize: 14, color: C.gray500 }}><strong style={{ color: C.black }}>{filtered.length}</strong> vehicles found</span>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: '9px 16px', border: `1.5px solid ${C.gray300}`, borderRadius: 10, fontFamily: 'Inter', fontSize: 14, outline: 'none', background: C.white, cursor: 'pointer' }}>
              <option value="popular">Most Popular</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          {filtered.length > 0 ? (
            <div className="catalog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
              {filtered.map(s => <ScooterCard key={s.id} scooter={s} onOpenScooter={onOpenScooter} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 0', background: C.white, borderRadius: 18, border: `1px solid ${C.gray200}` }}>
              <div style={{ fontSize: 52, marginBottom: 18 }}>🔍</div>
              <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 20, color: C.black, marginBottom: 8 }}>No vehicles match</div>
              <div style={{ fontFamily: 'Inter', fontSize: 14, color: C.gray500, marginBottom: 24 }}>Try adjusting your filters</div>
              <Btn variant="dark" onClick={() => setFilters({ type: 'all', maxPrice: 15, available: false })}>Clear Filters</Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
