'use client';

export function HeroScrollHint() {
  return (
    <div
      className="hint-anim"
      style={{
        position: 'absolute',
        bottom: '30px',
        left: '50%',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        pointerEvents: 'none',
      }}
    >
      <span
        style={{
          fontSize: '9px',
          letterSpacing: '0.22em',
          color: 'rgba(255,255,255,0.2)',
          textTransform: 'uppercase',
        }}
      >
        Доош гүйлгэх
      </span>
      <svg
        width="20"
        height="12"
        viewBox="0 0 24 14"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 2l10 10L22 2" />
      </svg>
    </div>
  );
}

