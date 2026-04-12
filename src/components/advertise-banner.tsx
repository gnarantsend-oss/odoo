'use client';

import { useEffect, useState } from 'react';

const QR_PATH = "M1,1H2V2H1zM2,1H3V2H2zM3,1H4V2H3zM4,1H5V2H4zM5,1H6V2H5zM6,1H7V2H6zM7,1H8V2H7zM10,1H11V2H10zM12,1H13V2H12zM14,1H15V2H14zM17,1H18V2H17zM18,1H19V2H18zM20,1H21V2H20zM21,1H22V2H21zM22,1H23V2H22zM23,1H24V2H23zM25,1H26V2H25zM27,1H28V2H27zM28,1H29V2H28zM29,1H30V2H29zM30,1H31V2H30zM31,1H32V2H31zM32,1H33V2H32zM33,1H34V2H33zM1,2H2V3H1zM7,2H8V3H7zM10,2H11V3H10zM12,2H13V3H12zM16,2H17V3H16zM17,2H18V3H17zM18,2H19V3H18zM21,2H22V3H21zM25,2H26V3H25zM27,2H28V3H27zM33,2H34V3H33zM1,3H2V4H1zM3,3H4V4H3zM4,3H5V4H4zM5,3H6V4H5zM7,3H8V4H7zM9,3H10V4H9zM11,3H12V4H11zM12,3H13V4H12zM13,3H14V4H13zM14,3H15V4H14zM15,3H16V4H15zM16,3H17V4H16zM20,3H21V4H20zM22,3H23V4H22zM24,3H25V4H24zM25,3H26V4H25zM27,3H28V4H27zM29,3H30V4H29zM30,3H31V4H30zM31,3H32V4H31zM33,3H34V4H33zM1,4H2V5H1zM3,4H4V5H3zM4,4H5V5H4zM5,4H6V5H5zM7,4H8V5H7zM9,4H10V5H9zM11,4H12V5H11zM15,4H16V5H15zM16,4H17V5H16zM17,4H18V5H17zM19,4H20V5H19zM22,4H23V5H22zM24,4H25V5H24zM25,4H26V5H25zM27,4H28V5H27zM29,4H30V5H29zM30,4H31V5H30zM31,4H32V5H31zM33,4H34V5H33zM1,5H2V6H1zM3,5H4V6H3zM4,5H5V6H4zM5,5H6V6H5zM7,5H8V6H7zM10,5H11V6H10zM11,5H12V6H11zM12,5H13V6H12zM13,5H14V6H13zM15,5H16V6H15zM17,5H18V6H17zM18,5H19V6H18zM21,5H22V6H21zM24,5H25V6H24zM27,5H28V6H27zM29,5H30V6H29zM30,5H31V6H30zM31,5H32V6H31zM33,5H34V6H33zM1,6H2V7H1zM7,6H8V7H7zM12,6H13V7H12zM13,6H14V7H13zM14,6H15V7H14zM16,6H17V7H16zM19,6H20V7H19zM21,6H22V7H21zM25,6H26V7H25zM27,6H28V7H27zM33,6H34V7H33zM1,7H2V8H1zM2,7H3V8H2zM3,7H4V8H3zM4,7H5V8H4zM5,7H6V8H5zM6,7H7V8H6zM7,7H8V8H7zM9,7H10V8H9zM11,7H12V8H11zM13,7H14V8H13zM15,7H16V8H15zM17,7H18V8H17zM19,7H20V8H19zM21,7H22V8H21zM23,7H24V8H23zM25,7H26V8H25zM27,7H28V8H27zM28,7H29V8H28zM29,7H30V8H29zM30,7H31V8H30zM31,7H32V8H31zM32,7H33V8H32zM33,7H34V8H33zM12,8H13V9H12zM14,8H15V9H14zM16,8H17V9H16zM17,8H18V9H17zM18,8H19V9H18zM20,8H21V9H20zM24,8H25V9H24zM4,9H5V10H4zM5,9H6V10H5zM7,9H8V10H7zM8,9H9V10H8zM11,9H12V10H11zM14,9H15V10H14zM16,9H17V10H16zM18,9H19V10H18zM20,9H21V10H20zM21,9H22V10H21zM24,9H25V10H24zM25,9H26V10H25zM30,9H31V10H30zM31,9H32V10H31z";

export default function AdvertiseBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
        background: 'linear-gradient(135deg, #010f20 0%, #001a2e 40%, #010f20 100%)',
        borderTop: '1px solid rgba(73,198,229,0.12)',
        borderBottom: '1px solid rgba(73,198,229,0.12)',
        padding: '48px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 60% at 15% 50%, rgba(73,198,229,0.06) 0%, transparent 70%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 50% 80% at 85% 50%, rgba(73,198,229,0.04) 0%, transparent 70%)',
      }} />

      <div style={{
        maxWidth: '1100px', margin: '0 auto',
        display: 'flex', alignItems: 'center', gap: '48px',
        flexWrap: 'wrap', justifyContent: 'center',
      }}>
        {/* LEFT — Copy */}
        <div style={{ flex: '1 1 340px', minWidth: '280px' }}>
          {/* Advertise badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(73,198,229,0.1)', border: '1px solid rgba(73,198,229,0.25)',
              borderRadius: '999px', padding: '4px 12px',
              fontSize: '12px', fontWeight: 600, color: '#49C6E5',
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              ADVERTISE
            </span>
          </div>

          {/* Headline */}
          <h2 style={{
            fontSize: 'clamp(22px, 3.5vw, 34px)',
            fontWeight: 800,
            color: '#fff',
            lineHeight: 1.2,
            marginBottom: '12px',
            letterSpacing: '-0.5px',
          }}>
            Таны зар манай үзэгчдэд<br/>
            <span style={{ color: '#49C6E5' }}>хүрэх боломжтой</span>
          </h2>

          <p style={{
            fontSize: '14px', color: 'rgba(255,255,255,0.5)',
            marginBottom: '32px', lineHeight: 1.7, maxWidth: '380px',
          }}>
            Reach your audience on Mongolia&apos;s leading streaming platform.
            Advertise your business, product, or service to thousands of daily viewers.
          </p>

          {/* CTA */}
          <a
            href="https://t.me/Bannerbairluul"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              background: 'linear-gradient(135deg, #49C6E5 0%, #0ea5e9 100%)',
              color: '#010816', fontWeight: 700, fontSize: '15px',
              padding: '14px 28px', borderRadius: '12px',
              textDecoration: 'none',
              boxShadow: '0 4px 24px rgba(73,198,229,0.35)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              letterSpacing: '0.02em',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 32px rgba(73,198,229,0.5)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 24px rgba(73,198,229,0.35)';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.19 13.982l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.958.577z" />
            </svg>
            Telegram-р холбогдох
          </a>

          <p style={{
            marginTop: '12px', fontSize: '12px',
            color: 'rgba(255,255,255,0.25)', letterSpacing: '0.03em',
          }}>
            @Bannerbairluul
          </p>
        </div>

        {/* RIGHT — QR */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
          flex: '0 0 auto',
        }}>
          <div style={{
            position: 'relative',
            background: 'white',
            borderRadius: '20px',
            padding: '16px',
            boxShadow: '0 0 0 1px rgba(73,198,229,0.2), 0 20px 60px rgba(0,0,0,0.5)',
          }}>
            {([
              { top: '-3px', left: '-3px', borderRadius: '4px 0 0 0', borderRight: 'none', borderBottom: 'none' },
              { top: '-3px', right: '-3px', borderRadius: '0 4px 0 0', borderLeft: 'none', borderBottom: 'none' },
              { bottom: '-3px', left: '-3px', borderRadius: '0 0 0 4px', borderRight: 'none', borderTop: 'none' },
              { bottom: '-3px', right: '-3px', borderRadius: '0 0 4px 0', borderLeft: 'none', borderTop: 'none' },
            ] as const).map((corner, i) => (
              <div key={i} style={{
                position: 'absolute', width: '16px', height: '16px',
                border: '2.5px solid #49C6E5', ...corner,
              }} />
            ))}
            <svg width="160" height="160" viewBox="0 0 35 35" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
              <rect width="35" height="35" fill="white" />
              <path d={QR_PATH} fill="#010816" />
            </svg>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em', marginBottom: '4px' }}>
              QR уншуулаад холбогдоорой
            </p>
            <p style={{ fontSize: '13px', color: '#49C6E5', fontWeight: 600, letterSpacing: '0.03em' }}>
              t.me/Bannerbairluul
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
    </section>
  );
}
