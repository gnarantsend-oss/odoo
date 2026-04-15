'use client';

export function HeroTitleBlock() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '16px',
        pointerEvents: 'none',
      }}
    >
      <p
        style={{
          fontSize: 'clamp(10px, 1vw, 13px)',
          fontWeight: 600,
          letterSpacing: '0.5em',
          color: 'rgba(255,255,255,0.35)',
          textTransform: 'uppercase',
        }}
      >
        🇲🇳 Монгол кино
      </p>

      <h1
        style={{
          fontSize: 'clamp(52px, 9vw, 108px)',
          fontWeight: 900,
          letterSpacing: '-0.035em',
          lineHeight: 1,
          color: '#fff',
          textShadow: '0 0 80px rgba(0,0,0,1), 0 4px 40px rgba(0,0,0,0.8)',
        }}
      >
        NARHAN <span style={{ color: '#e50914' }}>TV</span>
      </h1>

      <p
        style={{
          fontSize: 'clamp(12px, 1.3vw, 16px)',
          color: 'rgba(255,255,255,0.4)',
          letterSpacing: '0.05em',
        }}
      >
        Монгол кино үнэгүй үзнэ үү
      </p>
    </div>
  );
}

