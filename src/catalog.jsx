import React from 'react';
import { useSite } from './site-context';
import { Btn, C, Icon } from './ui';
import { ScooterCard } from './home';

export default function CatalogPage({ onOpenScooter }) {
  const { fleet, content } = useSite();
  const [filters, setFilters] = React.useState({ type: 'all', maxPrice: 15, available: false });
  const [sort, setSort] = React.useState('popular');
  const catalog = content?.catalog;
  const common = content?.common;

  const filtered = fleet.filter((item) => {
    if (filters.type !== 'all' && item.type !== filters.type) return false;
    if (filters.available && !item.available) return false;
    if (item.priceUSD > filters.maxPrice) return false;
    return true;
  }).sort((left, right) => {
    if (sort === 'price_asc') return left.priceUSD - right.priceUSD;
    if (sort === 'price_desc') return right.priceUSD - left.priceUSD;
    if (sort === 'rating') return right.rating - left.rating;
    return right.reviews - left.reviews;
  });

  const setFilter = (patch) => setFilters((current) => ({ ...current, ...patch }));
  const typeOptions = ['all', 'scooter', 'maxi', 'moto'];

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', background: C.gray100 }}>
      <div className="page-header" style={{ background: C.white, borderBottom: `1px solid ${C.gray200}`, padding: '36px 80px' }}>
        <div className="catalog-header__row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: 40, letterSpacing: '-0.04em', color: C.black, margin: '0 0 6px' }}>{catalog?.title}</h1>
            <p style={{ fontFamily: 'Inter', fontSize: 15, color: C.gray500, margin: 0 }}>{fleet.length} {catalog?.subtitle}</p>
          </div>
          <div className="catalog-header__chips" style={{ display: 'flex', gap: 10 }}>
            {typeOptions.slice(1).map((typeCode) => (
              <div key={typeCode} onClick={() => setFilter({ type: filters.type === typeCode ? 'all' : typeCode })}
                style={{ padding: '9px 18px', borderRadius: 10, fontFamily: 'Inter', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', background: filters.type === typeCode ? C.black : C.gray100, color: filters.type === typeCode ? C.white : C.gray700 }}>
                {common?.types?.[typeCode]}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="catalog-layout" style={{ display: 'grid', gridTemplateColumns: '268px 1fr', gap: 28, padding: '32px 80px' }}>
        <div style={{ background: C.white, borderRadius: 18, padding: '28px', height: 'fit-content', border: `1px solid ${C.gray200}`, position: 'sticky', top: 96 }}>
          <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 17, color: C.black, marginBottom: 32, letterSpacing: '-0.02em' }}>{catalog?.filtersTitle}</div>

          <div style={{ marginBottom: 32 }}>
            <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.gray500, marginBottom: 14 }}>{catalog?.vehicleType}</div>
            {typeOptions.map((value) => (
              <label key={value} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, cursor: 'pointer' }}>
                <div onClick={() => setFilter({ type: value })} style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${filters.type === value ? C.black : C.gray300}`, background: filters.type === value ? C.black : C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.18s' }}>
                  {filters.type === value && <div style={{ width: 7, height: 7, background: C.white, borderRadius: '50%' }} />}
                </div>
                <span style={{ fontFamily: 'Inter', fontSize: 14, color: C.black }}>{common?.types?.[value]}</span>
              </label>
            ))}
          </div>

          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.gray500 }}>{catalog?.maxPrice}</div>
              <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 14, color: C.black }}>${filters.maxPrice}<span style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 12, color: C.gray500 }}> {common?.perDay}</span></div>
            </div>
            <input type="range" min={4} max={15} value={filters.maxPrice} onChange={(event) => setFilter({ maxPrice: Number(event.target.value) })}
              style={{ width: '100%', accentColor: C.gold, height: 4 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontFamily: 'Inter', fontSize: 11, color: C.gray500 }}>$4</span>
              <span style={{ fontFamily: 'Inter', fontSize: 11, color: C.gray500 }}>$15</span>
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.gray500, marginBottom: 14 }}>{catalog?.availability}</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
              <div onClick={() => setFilter({ available: !filters.available })} style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${filters.available ? C.gold : C.gray300}`, background: filters.available ? C.gold : C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.18s' }}>
                {filters.available && <Icon name="check" size={12} color={C.black} strokeWidth={2.4} />}
              </div>
              <span style={{ fontFamily: 'Inter', fontSize: 14, color: C.black }}>{catalog?.availableNowOnly}</span>
            </label>
          </div>

          <Btn variant="dark" fullWidth onClick={() => setFilters({ type: 'all', maxPrice: 15, available: false })}>{catalog?.resetAll}</Btn>
        </div>

        <div>
          <div className="catalog-results__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <span style={{ fontFamily: 'Inter', fontSize: 14, color: C.gray500 }}><strong style={{ color: C.black }}>{filtered.length}</strong> {catalog?.vehiclesFound}</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)} style={{ padding: '9px 16px', border: `1.5px solid ${C.gray300}`, borderRadius: 10, fontFamily: 'Inter', fontSize: 14, outline: 'none', background: C.white, cursor: 'pointer' }}>
              {Object.entries(common?.sort || {}).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {filtered.length > 0 ? (
            <div className="catalog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
              {filtered.map((item) => <ScooterCard key={item.id} scooter={item} onOpenScooter={onOpenScooter} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 0', background: C.white, borderRadius: 18, border: `1px solid ${C.gray200}` }}>
              <div style={{ marginBottom: 18, display: 'flex', justifyContent: 'center' }}>
                <Icon name="search" size={52} color={C.gray300} strokeWidth={1.7} />
              </div>
              <div style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 20, color: C.black, marginBottom: 8 }}>{catalog?.emptyTitle}</div>
              <div style={{ fontFamily: 'Inter', fontSize: 14, color: C.gray500, marginBottom: 24 }}>{catalog?.emptyBody}</div>
              <Btn variant="dark" onClick={() => setFilters({ type: 'all', maxPrice: 15, available: false })}>{catalog?.clearFilters}</Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
