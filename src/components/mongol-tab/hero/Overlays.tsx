'use client';

export function HeroOverlays() {
  return (
    <>
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'rgba(8,11,24,0.18)' }} />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '42%',
          zIndex: 3,
          background: 'linear-gradient(to bottom, #080b18 0%, rgba(8,11,24,0.55) 40%, transparent 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '42%',
          zIndex: 3,
          background: 'linear-gradient(to top, #080b18 0%, rgba(8,11,24,0.55) 40%, transparent 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '18%',
          zIndex: 3,
          background: 'linear-gradient(to right, #080b18 0%, transparent 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '18%',
          zIndex: 3,
          background: 'linear-gradient(to left, #080b18 0%, transparent 100%)',
        }}
      />
    </>
  );
}

