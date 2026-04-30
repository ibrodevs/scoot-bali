import React from 'react';
import { useSite } from './site-context';

export const C = {
  black: '#000000', white: '#FFFFFF',
  gray100: '#F5F5F5', gray200: '#EBEBEB', gray300: '#CCCCCC',
  gray500: '#888888', gray700: '#444444',
  gold: '#FFD700', goldLight: 'rgba(255,215,0,0.12)', goldGlow: 'rgba(255,215,0,0.35)',
};

const ICON_NAME_MAP = {
  '📍': 'location',
  '📅': 'calendar',
  '⏱': 'clock',
  '🛵': 'scooter',
  '✨': 'sparkles',
  '⚡': 'bolt',
  '🚗': 'truck',
  '🚚': 'truck',
  '🛡️': 'shield',
  '📱': 'phone',
  '📋': 'document-text',
  '📄': 'document',
  '🔔': 'bell',
  '💬': 'chat',
  '👤': 'user',
  '💳': 'credit-card',
  '💵': 'wallet',
  '📲': 'payment-terminal',
  '🔒': 'lock',
  '📶': 'wifi',
  '🎒': 'bag',
  '⛑️': 'helmet',
  '🪖': 'helmet-open',
  '🧥': 'coat',
  '🔍': 'search',
  '✓': 'check',
  '★': 'star-filled',
};

const FLAG_CODE_MAP = {
  '🇦🇺': 'AU',
  '🇷🇺': 'RU',
  '🇨🇳': 'CN',
  '🇬🇧': 'UK',
  '🇮🇩': 'ID',
  '🇩🇪': 'DE',
  '🇫🇷': 'FR',
};

export function resolveIconName(value) {
  if (!value) return '';
  return ICON_NAME_MAP[value] || String(value);
}

function iconNode(name) {
  switch (name) {
    case 'location':
      return (
        <>
          <path d="M12 21s6-4.4 6-10a6 6 0 1 0-12 0c0 5.6 6 10 6 10Z" />
          <circle cx="12" cy="11" r="2.5" />
        </>
      );
    case 'calendar':
      return (
        <>
          <rect x="3" y="5" width="18" height="16" rx="3" />
          <path d="M16 3v4M8 3v4M3 10h18" />
        </>
      );
    case 'clock':
      return (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.8v4.8l3 1.8" />
        </>
      );
    case 'scooter':
      return (
        <>
          <circle cx="7.5" cy="17.2" r="2.3" />
          <circle cx="17" cy="17.2" r="2.3" />
          <path d="M9.8 17.2h4.4l2.4-4.7h-4.1l-1.4 2.7H8.8" />
          <path d="M10.8 12.5 9 8.8H6.6" />
          <path d="M16.4 12.5h1.8a2.2 2.2 0 0 1 2.2 2.2v2.5" />
        </>
      );
    case 'sparkles':
      return (
        <>
          <path d="m12 3 1.2 4 4 1.2-4 1.2L12 13l-1.2-3.6L6.8 8.2l4-1.2L12 3Z" />
          <path d="m18 13 .7 2.1 2.1.7-2.1.7L18 18.7l-.7-2.2-2.1-.7 2.1-.7.7-2.1Z" />
          <path d="m6 14 .6 1.7 1.7.6-1.7.6L6 18.6l-.6-1.7-1.7-.6 1.7-.6L6 14Z" />
        </>
      );
    case 'bolt':
      return <path d="M13 2 6.5 12h4l-1.5 10L17.5 11h-4L13 2Z" />;
    case 'truck':
      return (
        <>
          <path d="M3 8.5h10v6.5H3Z" />
          <path d="M13 11h3.5l2 2.2V15H13Z" />
          <circle cx="7" cy="17" r="2" />
          <circle cx="17" cy="17" r="2" />
        </>
      );
    case 'shield':
      return <path d="M12 3 5.5 5.8v4.4c0 4.4 2.7 8 6.5 10 3.8-2 6.5-5.6 6.5-10V5.8L12 3Z" />;
    case 'phone':
      return (
        <>
          <rect x="7" y="2.8" width="10" height="18.4" rx="2.6" />
          <path d="M10.2 17.7h3.6" />
        </>
      );
    case 'document-text':
      return (
        <>
          <path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
          <path d="M14 3.5V8h4M9 11.5h6M9 15h6" />
        </>
      );
    case 'document':
      return (
        <>
          <path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
          <path d="M14 3.5V8h4" />
        </>
      );
    case 'bell':
      return (
        <>
          <path d="M12 4.5a4.5 4.5 0 0 0-4.5 4.5v2.2c0 .8-.3 1.6-.9 2.2L5.5 15h13l-1.1-1.6c-.6-.6-.9-1.4-.9-2.2V9A4.5 4.5 0 0 0 12 4.5Z" />
          <path d="M10 18a2.2 2.2 0 0 0 4 0" />
        </>
      );
    case 'chat':
      return (
        <>
          <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6A2.5 2.5 0 0 1 16.5 15H10l-3.5 3v-3H7.5A2.5 2.5 0 0 1 5 12.5Z" />
        </>
      );
    case 'user':
      return (
        <>
          <circle cx="12" cy="8" r="3.2" />
          <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
        </>
      );
    case 'search':
      return (
        <>
          <circle cx="11" cy="11" r="6" />
          <path d="m20 20-4.2-4.2" />
        </>
      );
    case 'check':
      return <path d="m5 12.5 4.2 4.2L19 7.8" />;
    case 'check-circle':
      return (
        <>
          <circle cx="12" cy="12" r="8.5" />
          <path d="m8.6 12.2 2.3 2.3 4.6-4.9" />
        </>
      );
    case 'credit-card':
      return (
        <>
          <rect x="3" y="6" width="18" height="12" rx="2.5" />
          <path d="M3 10h18M7 14.2h3.2" />
        </>
      );
    case 'wallet':
      return (
        <>
          <path d="M4 7.5h12.5A2.5 2.5 0 0 1 19 10v7a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 16.5Z" />
          <path d="M4 7.5V6A2 2 0 0 1 6 4h10" />
          <circle cx="15.5" cy="13.2" r="1" />
        </>
      );
    case 'payment-terminal':
      return (
        <>
          <rect x="7" y="3" width="10" height="18" rx="2.6" />
          <path d="M9.5 7.5h5M18.4 8.4c1.7.8 2.6 2.2 2.6 3.8 0 1.7-.9 3.1-2.6 3.9" />
        </>
      );
    case 'lock':
      return (
        <>
          <rect x="5.5" y="11" width="13" height="9" rx="2" />
          <path d="M8.5 11V8.5a3.5 3.5 0 1 1 7 0V11" />
        </>
      );
    case 'wifi':
      return (
        <>
          <path d="M4.5 9.5a11 11 0 0 1 15 0" />
          <path d="M7.5 12.5a6.8 6.8 0 0 1 9 0" />
          <path d="M10.2 15.4a2.9 2.9 0 0 1 3.6 0" />
          <circle cx="12" cy="18.2" r="1.1" fill="currentColor" stroke="none" />
        </>
      );
    case 'bag':
      return (
        <>
          <path d="M6.5 8h11l-1 11.5a1.5 1.5 0 0 1-1.5 1.5H9a1.5 1.5 0 0 1-1.5-1.5Z" />
          <path d="M9 8V7a3 3 0 0 1 6 0v1" />
        </>
      );
    case 'helmet':
      return (
        <>
          <path d="M5 13a7 7 0 0 1 14 0v2a2 2 0 0 1-2 2h-3.8A2.2 2.2 0 0 0 11 19.2V21H9v-1.8a4.2 4.2 0 0 1 4.2-4.2H17V13" />
          <path d="M8 12h6.5" />
        </>
      );
    case 'helmet-open':
      return (
        <>
          <path d="M5 13a7 7 0 0 1 14 0v2h-5.2A3.8 3.8 0 0 0 10 18.8V21H8v-2.2A5.8 5.8 0 0 1 13.8 13H19" />
          <path d="M8 12h5.5" />
        </>
      );
    case 'coat':
      return (
        <>
          <path d="m9 4 3 2.2L15 4l3 3.3-1.8 2V20h-3v-6h-2.4v6h-3V9.3L6 7.3 9 4Z" />
        </>
      );
    case 'star':
      return <path d="m12 3 2.6 5.3 5.9.9-4.3 4.2 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.5 9.2l5.9-.9L12 3Z" />;
    case 'star-filled':
      return <path d="m12 2.8 2.8 5.7 6.3.9-4.6 4.4 1.1 6.2L12 17l-5.6 3 1-6.2-4.5-4.4 6.3-.9L12 2.8Z" fill="currentColor" stroke="none" />;
    default:
      return null;
  }
}

export function Icon({ name, size = 20, color = 'currentColor', strokeWidth = 1.8, style }) {
  const resolved = resolveIconName(name);
  const node = iconNode(resolved);
  if (!node) {
    return null;
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 0, color, ...style }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {node}
      </svg>
    </span>
  );
}

export function FlagMark({ value, size = 20, style }) {
  const code = FLAG_CODE_MAP[value] || String(value || '').toUpperCase().slice(0, 2) || '--';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: size * 1.45,
        height: size,
        padding: '0 6px',
        borderRadius: size / 2,
        background: C.goldLight,
        border: `1px solid ${C.goldGlow}`,
        color: C.black,
        fontFamily: 'Inter, sans-serif',
        fontSize: Math.max(10, Math.round(size * 0.45)),
        fontWeight: 800,
        letterSpacing: '0.08em',
        lineHeight: 1,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {code}
    </span>
  );
}

export function Btn({ children, variant = 'primary', size = 'md', onClick, disabled, fullWidth, style }) {
  const sizes = { sm: '8px 18px', md: '12px 26px', lg: '15px 36px', xl: '18px 48px' };
  const fSizes = { sm: 13, md: 14, lg: 15, xl: 17 };
  const vars = {
    primary: { bg: C.gold, color: C.black, border: 'none', shadow: '0 4px 12px rgba(255,215,0,0.2)' },
    dark: { bg: C.black, color: C.white, border: 'none', shadow: 'none' },
    outline: { bg: 'transparent', color: C.black, border: `1.5px solid ${C.black}`, shadow: 'none' },
    ghost: { bg: 'transparent', color: C.gray700, border: `1.5px solid ${C.gray300}`, shadow: 'none' },
    'outline-white': { bg: 'transparent', color: C.white, border: '1.5px solid rgba(255,255,255,0.4)', shadow: 'none' },
  };
  const v = vars[variant] || vars.primary;
  return (
    <button
      onClick={onClick} disabled={disabled}
      className={`scoot-btn scoot-btn--${variant}`}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: sizes[size], fontSize: fSizes[size], fontWeight: 600,
        fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em',
        background: v.bg, color: v.color, border: v.border || 'none',
        boxShadow: v.shadow, borderRadius: 10,
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
        transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
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
        <Icon
          key={i}
          name={i <= Math.round(rating) ? 'star-filled' : 'star'}
          size={size + 2}
          color={i <= Math.round(rating) ? C.gold : C.gray300}
          strokeWidth={1.7}
        />
      ))}
    </span>
  );
}

export function ScooterImg({ scooter, height = 220 }) {
  const { content } = useSite();
  const common = content?.common;
  const name = scooter?.name || scooter?.title || common?.vehicle;
  const typeLabel = scooter?.typeLabel || common?.types?.[scooter?.type] || scooter?.type || common?.types?.scooter || '';
  const engineLabel = scooter?.engine || '';
  const accent = scooter?.accent || '#111111';

  return (
    <div style={{
      width: '100%', height,
      background: `linear-gradient(145deg, ${accent} 0%, #1a1a1a 60%, #0a0a0a 100%)`,
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
        <div style={{ color: 'rgba(255,255,255,0.15)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'Inter', marginBottom: 10 }}>{common?.vehiclePhoto}</div>
        <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, fontFamily: 'Sora, sans-serif', fontWeight: 700, letterSpacing: '-0.02em' }}>{name}</div>
        {(engineLabel || typeLabel) && (
          <div style={{ color: C.gold, fontSize: 11, marginTop: 6, fontFamily: 'Inter', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            {[engineLabel, typeLabel].filter(Boolean).join(' · ')}
          </div>
        )}
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
      {icon && (
        <Icon
          name={icon}
          size={16}
          color={C.gray500}
          style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
        />
      )}
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
