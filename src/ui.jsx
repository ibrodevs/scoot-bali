import React from 'react';

export const C = {
  black: '#000000', white: '#FFFFFF',
  gray100: '#F5F5F5', gray200: '#EBEBEB', gray300: '#CCCCCC',
  gray500: '#888888', gray700: '#444444',
  gold: '#FFD700', goldLight: 'rgba(255,215,0,0.12)', goldGlow: 'rgba(255,215,0,0.35)',
};

export function Btn({ children, variant = 'primary', size = 'md', onClick, disabled, fullWidth, style }) {
  const [hov, setHov] = React.useState(false);
  const sizes = { sm: '8px 18px', md: '12px 26px', lg: '15px 36px', xl: '18px 48px' };
  const fSizes = { sm: 13, md: 14, lg: 15, xl: 17 };
  const vars = {
    primary: { bg: hov ? '#e6c200' : C.gold, color: C.black, border: 'none', shadow: hov ? '0 8px 24px rgba(255,215,0,0.4)' : '0 4px 12px rgba(255,215,0,0.2)' },
    dark: { bg: hov ? '#222' : C.black, color: C.white, border: 'none', shadow: hov ? '0 8px 24px rgba(0,0,0,0.3)' : 'none' },
    outline: { bg: hov ? C.black : 'transparent', color: hov ? C.white : C.black, border: `1.5px solid ${C.black}`, shadow: 'none' },
    ghost: { bg: hov ? C.gray100 : 'transparent', color: C.gray700, border: `1.5px solid ${C.gray300}`, shadow: 'none' },
    'outline-white': { bg: hov ? 'rgba(255,255,255,0.1)' : 'transparent', color: C.white, border: '1.5px solid rgba(255,255,255,0.4)', shadow: 'none' },
  };
  const v = vars[variant] || vars.primary;
  return (
    <button
      onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: sizes[size], fontSize: fSizes[size], fontWeight: 600,
        fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em',
        background: v.bg, color: v.color, border: v.border || 'none',
        boxShadow: v.shadow, borderRadius: 10,
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
        transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
        transform: hov && !disabled ? 'translateY(-1px)' : 'none',
        width: fullWidth ? '100%' : 'auto',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >{children}</button>
  );
}

export function Badge({ children, variant = 'default', style }) {
  const vars = {
    default: { bg: C.gray100, color: C.gray700 },
    gold: { bg: C.gold, color: C.black },
    black: { bg: C.black, color: C.white },
    green: { bg: '#e6f7ee', color: '#166534' },
    red: { bg: '#fef2f2', color: '#991b1b' },
    orange: { bg: '#fff7ed', color: '#9a3412' },
    blue: { bg: '#eff6ff', color: '#1e40af' },
  };
  const v = vars[variant] || vars.default;
  return (
    <span style={{
      background: v.bg, color: v.color,
      padding: '3px 10px', borderRadius: 100,
      fontSize: 11, fontWeight: 700, letterSpacing: '0.05em',
      fontFamily: 'Inter, sans-serif', textTransform: 'uppercase',
      display: 'inline-flex', alignItems: 'center', gap: 4,
      ...style,
    }}>{children}</span>
  );
}

export function Stars({ rating, size = 12 }) {
  return (
    <span style={{ display: 'inline-flex', gap: 1 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? C.gold : C.gray300, fontSize: size, lineHeight: 1 }}>★</span>
      ))}
    </span>
  );
}

export function ScooterImg({ scooter, height = 220 }) {
  return (
    <div style={{
      width: '100%', height,
      background: `linear-gradient(145deg, ${scooter.accent} 0%, #1a1a1a 60%, #0a0a0a 100%)`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {Array.from({ length: 18 }, (_, i) => (
          <line key={i} x1={i * 28} y1={0} x2={i * 28 - 80} y2={height}
            stroke="rgba(255,255,255,0.025)" strokeWidth="18" />
        ))}
      </svg>
      <div style={{ position: 'relative', textAlign: 'center', padding: '0 20px' }}>
        <div style={{ color: 'rgba(255,255,255,0.15)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'Inter', marginBottom: 10 }}>vehicle photo</div>
        <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, fontFamily: 'Sora, sans-serif', fontWeight: 700, letterSpacing: '-0.02em' }}>{scooter.name}</div>
        <div style={{ color: C.gold, fontSize: 11, marginTop: 6, fontFamily: 'Inter', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{scooter.engine} · {scooter.type}</div>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }} />
    </div>
  );
}

export function Divider({ style }) {
  return <div style={{ height: 1, background: C.gray200, ...style }} />;
}

export function FormField({ label, children, style }) {
  return (
    <div style={style}>
      {label && <div style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.gray500, marginBottom: 8 }}>{label}</div>}
      {children}
    </div>
  );
}

export function StyledInput({ placeholder, value, onChange, type = 'text', icon, style }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <div style={{ position: 'relative', ...style }}>
      {icon && <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: C.gray500, pointerEvents: 'none' }}>{icon}</span>}
      <input
        type={type} placeholder={placeholder} value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', boxSizing: 'border-box',
          padding: icon ? '13px 16px 13px 44px' : '13px 16px',
          border: `1.5px solid ${focused ? C.black : C.gray300}`,
          borderRadius: 10, fontFamily: 'Inter, sans-serif', fontSize: 15,
          outline: 'none', background: C.white, color: C.black,
          transition: 'border-color 0.2s',
        }}
      />
    </div>
  );
}

export function Logo({ light, onClick }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
      <div style={{ width: 30, height: 30, background: C.gold, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 15, color: C.black }}>S</span>
      </div>
      <div style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 19, letterSpacing: '-0.04em', color: light ? C.white : C.black }}>
        SCOOT <span style={{ color: C.gold, fontWeight: 500 }}>BALI</span>
      </div>
    </div>
  );
}
