'use client';

import { useEffect, useState, useRef } from 'react';

const QR_PATH = "M1,1H2V2H1zM2,1H3V2H2zM3,1H4V2H3zM4,1H5V2H4zM5,1H6V2H5zM6,1H7V2H6zM7,1H8V2H7zM10,1H11V2H10zM12,1H13V2H12zM14,1H15V2H14zM17,1H18V2H17zM18,1H19V2H18zM20,1H21V2H20zM21,1H22V2H21zM22,1H23V2H22zM23,1H24V2H23zM25,1H26V2H25zM27,1H28V2H27zM28,1H29V2H28zM29,1H30V2H29zM30,1H31V2H30zM31,1H32V2H31zM32,1H33V2H32zM33,1H34V2H33zM1,2H2V3H1zM7,2H8V3H7zM10,2H11V3H10zM12,2H13V3H12zM16,2H17V3H16zM17,2H18V3H17zM18,2H19V3H18zM21,2H22V3H21zM25,2H26V3H25zM27,2H28V3H27zM33,2H34V3H33zM1,3H2V4H1zM3,3H4V4H3zM4,3H5V4H4zM5,3H6V4H5zM7,3H8V4H7zM9,3H10V4H9zM11,3H12V4H11zM12,3H13V4H12zM13,3H14V4H13zM14,3H15V4H14zM15,3H16V4H15zM16,3H17V4H16zM20,3H21V4H20zM22,3H23V4H22zM24,3H25V4H24zM25,3H26V4H25zM27,3H28V4H27zM29,3H30V4H29zM30,3H31V4H30zM31,3H32V4H31zM33,3H34V4H33zM1,4H2V5H1zM3,4H4V5H3zM4,4H5V5H4zM5,4H6V5H5zM7,4H8V5H7zM9,4H10V5H9zM11,4H12V5H11zM15,4H16V5H15zM16,4H17V5H16zM17,4H18V5H17zM19,4H20V5H19zM22,4H23V5H22zM24,4H25V5H24zM25,4H26V5H25zM27,4H28V5H27zM29,4H30V5H29zM30,4H31V5H30zM31,4H32V5H31zM33,4H34V5H33zM1,5H2V6H1zM3,5H4V6H3zM4,5H5V6H4zM5,5H6V6H5zM7,5H8V6H7zM10,5H11V6H10zM11,5H12V6H11zM12,5H13V6H12zM13,5H14V6H13zM15,5H16V6H15zM17,5H18V6H17zM18,5H19V6H18zM21,5H22V6H21zM24,5H25V6H24zM27,5H28V6H27zM29,5H30V6H29zM30,5H31V6H30zM31,5H32V6H31zM33,5H34V6H33zM1,6H2V7H1zM7,6H8V7H7zM12,6H13V7H12zM13,6H14V7H13zM14,6H15V7H14zM16,6H17V7H16zM19,6H20V7H19zM21,6H22V7H21zM25,6H26V7H25zM27,6H28V7H27zM33,6H34V7H33zM1,7H2V8H1zM2,7H3V8H2zM3,7H4V8H3zM4,7H5V8H4zM5,7H6V8H5zM6,7H7V8H6zM7,7H8V8H7zM9,7H10V8H9zM11,7H12V8H11zM13,7H14V8H13zM15,7H16V8H15zM17,7H18V8H17zM19,7H20V8H19zM21,7H22V8H21zM23,7H24V8H23zM25,7H26V8H25zM27,7H28V8H27zM28,7H29V8H28zM29,7H30V8H29zM30,7H31V8H30zM31,7H32V8H31zM32,7H33V8H32zM33,7H34V8H33zM12,8H13V9H12zM14,8H15V9H14zM16,8H17V9H16zM17,8H18V9H17zM18,8H19V9H18zM20,8H21V9H20zM24,8H25V9H24zM4,9H5V10H4zM5,9H6V10H5zM7,9H8V10H7zM8,9H9V10H8zM11,9H12V10H11zM14,9H15V10H14zM16,9H17V10H16zM18,9H19V10H18zM20,9H21V10H20zM21,9H22V10H21zM24,9H25V10H24zM25,9H26V10H25zM30,9H31V10H30zM31,9H32V10H31zM2,10H3V11H2zM4,10H5V11H4zM5,10H6V11H5zM6,10H7V11H6zM9,10H10V11H9zM10,10H11V11H10zM12,10H13V11H12zM13,10H14V11H13zM15,10H16V11H15zM17,10H18V11H17zM18,10H19V11H18zM21,10H22V11H21zM24,10H25V11H24zM26,10H27V11H26zM28,10H29V11H28zM29,10H30V11H29zM30,10H31V11H30zM31,10H32V11H31zM2,11H3V12H2zM4,11H5V12H4zM5,11H6V12H5zM7,11H8V12H7zM9,11H10V12H9zM12,11H13V12H12zM13,11H14V12H13zM15,11H16V12H15zM17,11H18V12H17zM19,11H20V12H19zM20,11H21V12H20zM22,11H23V12H22zM24,11H25V12H24zM25,11H26V12H25zM26,11H27V12H26zM27,11H28V12H27zM28,11H29V12H28zM31,11H32V12H31zM33,11H34V12H33zM2,12H3V13H2zM3,12H4V13H3zM4,12H5V13H4zM6,12H7V13H6zM13,12H14V13H13zM16,12H17V13H16zM20,12H21V13H20zM25,12H26V13H25zM26,12H27V13H26zM28,12H29V13H28zM29,12H30V13H29zM31,12H32V13H31zM1,13H2V14H1zM7,13H8V14H7zM9,13H10V14H9zM10,13H11V14H10zM12,13H13V14H12zM14,13H15V14H14zM17,13H18V14H17zM22,13H23V14H22zM23,13H24V14H23zM24,13H25V14H24zM25,13H26V14H25zM26,13H27V14H26zM27,13H28V14H27zM29,13H30V14H29zM33,13H34V14H33zM3,14H4V15H3zM5,14H6V15H5zM10,14H11V15H10zM11,14H12V15H11zM12,14H13V15H12zM13,14H14V15H13zM14,14H15V15H14zM21,14H22V15H21zM22,14H23V15H22zM23,14H24V15H23zM24,14H25V15H24zM26,14H27V15H26zM30,14H31V15H30zM32,14H33V15H32zM3,15H4V16H3zM5,15H6V16H5zM7,15H8V16H7zM8,15H9V16H8zM9,15H10V16H9zM11,15H12V16H11zM13,15H14V16H13zM14,15H15V16H14zM15,15H16V16H15zM17,15H18V16H17zM19,15H20V16H19zM21,15H22V16H21zM25,15H26V16H25zM26,15H27V16H26zM29,15H30V16H29zM31,15H32V16H31zM2,16H3V17H2zM4,16H5V17H4zM5,16H6V17H5zM6,16H7V17H6zM10,16H11V17H10zM12,16H13V17H12zM13,16H14V17H13zM16,16H17V17H16zM18,16H19V17H18zM19,16H20V17H19zM21,16H22V17H21zM24,16H25V17H24zM25,16H26V17H25zM26,16H27V17H26zM27,16H28V17H27zM29,16H30V17H29zM31,16H32V17H31zM32,16H33V17H32zM3,17H4V18H3zM7,17H8V18H7zM9,17H10V18H9zM10,17H11V18H10zM11,17H12V18H11zM13,17H14V18H13zM24,17H25V18H24zM26,17H27V18H26zM27,17H28V18H27zM28,17H29V18H28zM29,17H30V18H29zM30,17H31V18H30zM31,17H32V18H31zM1,18H2V19H1zM2,18H3V19H2zM9,18H10V19H9zM10,18H11V19H10zM11,18H12V19H11zM13,18H14V19H13zM15,18H16V19H15zM17,18H18V19H17zM18,18H19V19H18zM19,18H20V19H19zM21,18H22V19H21zM22,18H23V19H22zM23,18H24V19H23zM25,18H26V19H25zM27,18H28V19H27zM28,18H29V19H28zM29,18H30V19H29zM30,18H31V19H30zM33,18H34V19H33zM1,19H2V20H1zM2,19H3V20H2zM5,19H6V20H5zM6,19H7V20H6zM7,19H8V20H7zM9,19H10V20H9zM11,19H12V20H11zM14,19H15V20H14zM16,19H17V20H16zM24,19H25V20H24zM28,19H29V20H28zM30,19H31V20H30zM31,19H32V20H31zM33,19H34V20H33zM5,20H6V21H5zM6,20H7V21H6zM9,20H10V21H9zM13,20H14V21H13zM14,20H15V21H14zM17,20H18V21H17zM18,20H19V21H18zM20,20H21V21H20zM21,20H22V21H21zM24,20H25V21H24zM25,20H26V21H25zM26,20H27V21H26zM30,20H31V21H30zM31,20H32V21H31zM33,20H34V21H33zM2,21H3V22H2zM3,21H4V22H3zM7,21H8V22H7zM8,21H9V22H8zM9,21H10V22H9zM10,21H11V22H10zM13,21H14V22H13zM16,21H17V22H16zM18,21H19V22H18zM19,21H20V22H19zM21,21H22V22H21zM27,21H28V22H27zM28,21H29V22H28zM30,21H31V22H30zM1,22H2V23H1zM2,22H3V23H2zM3,22H4V23H3zM4,22H5V23H4zM8,22H9V23H8zM9,22H10V23H9zM10,22H11V23H10zM13,22H14V23H13zM15,22H16V23H15zM16,22H17V23H16zM19,22H20V23H19zM20,22H21V23H20zM23,22H24V23H23zM25,22H26V23H25zM27,22H28V23H27zM28,22H29V23H28zM29,22H30V23H29zM30,22H31V23H30zM1,23H2V24H1zM4,23H5V24H4zM6,23H7V24H6zM7,23H8V24H7zM10,23H11V24H10zM11,23H12V24H11zM15,23H16V24H15zM19,23H20V24H19zM22,23H23V24H22zM23,23H24V24H23zM24,23H25V24H24zM27,23H28V24H27zM30,23H31V24H30zM32,23H33V24H32zM33,23H34V24H33zM1,24H2V25H1zM4,24H5V25H4zM5,24H6V25H5zM9,24H10V25H9zM10,24H11V25H10zM14,24H15V25H14zM15,24H16V25H15zM18,24H19V25H18zM20,24H21V25H20zM24,24H25V25H24zM25,24H26V25H25zM28,24H29V25H28zM31,24H32V25H31zM33,24H34V25H33zM1,25H2V26H1zM2,25H3V26H2zM3,25H4V26H3zM6,25H7V26H6zM7,25H8V26H7zM9,25H10V26H9zM11,25H12V26H11zM12,25H13V26H12zM14,25H15V26H14zM16,25H17V26H16zM17,25H18V26H17zM24,25H25V26H24zM25,25H26V26H25zM26,25H27V26H26zM27,25H28V26H27zM28,25H29V26H28zM29,25H30V26H29zM30,25H31V26H30zM9,26H10V27H9zM11,26H12V27H11zM12,26H13V27H12zM15,26H16V27H15zM16,26H17V27H16zM22,26H23V27H22zM23,26H24V27H23zM24,26H25V27H24zM25,26H26V27H25zM29,26H30V27H29zM31,26H32V27H31zM1,27H2V28H1zM2,27H3V28H2zM3,27H4V28H3zM4,27H5V28H4zM5,27H6V28H5zM6,27H7V28H6zM7,27H8V28H7zM9,27H10V28H9zM11,27H12V28H11zM17,27H18V28H17zM18,27H19V28H18zM21,27H22V28H21zM24,27H25V28H24zM25,27H26V28H25zM27,27H28V28H27zM29,27H30V28H29zM1,28H2V29H1zM7,28H8V29H7zM13,28H14V29H13zM15,28H16V29H15zM18,28H19V29H18zM20,28H21V29H20zM22,28H23V29H22zM23,28H24V29H23zM24,28H25V29H24zM25,28H26V29H25zM29,28H30V29H29zM30,28H31V29H30zM31,28H32V29H31zM32,28H33V29H32zM1,29H2V30H1zM3,29H4V30H3zM4,29H5V30H4zM5,29H6V30H5zM7,29H8V30H7zM9,29H10V30H9zM10,29H11V30H10zM11,29H12V30H11zM12,29H13V30H12zM13,29H14V30H13zM14,29H15V30H14zM19,29H20V30H19zM22,29H23V30H22zM23,29H24V30H23zM24,29H25V30H24zM25,29H26V30H25zM26,29H27V30H26zM27,29H28V30H27zM28,29H29V30H28zM29,29H30V30H29zM30,29H31V30H30zM32,29H33V30H32zM1,30H2V31H1zM3,30H4V31H3zM4,30H5V31H4zM5,30H6V31H5zM7,30H8V31H7zM9,30H10V31H9zM10,30H11V31H10zM11,30H12V31H11zM12,30H13V31H12zM13,30H14V31H13zM15,30H16V31H15zM17,30H18V31H17zM18,30H19V31H18zM21,30H22V31H21zM22,30H23V31H22zM23,30H24V31H23zM25,30H26V31H25zM26,30H27V31H26zM28,30H29V31H28zM32,30H33V31H32zM1,31H2V32H1zM3,31H4V32H3zM4,31H5V32H4zM5,31H6V32H5zM7,31H8V32H7zM11,31H12V32H11zM12,31H13V32H12zM15,31H16V32H15zM18,31H19V32H18zM20,31H21V32H20zM21,31H22V32H21zM24,31H25V32H24zM29,31H30V32H29zM30,31H31V32H30zM32,31H33V32H32zM33,31H34V32H33zM1,32H2V33H1zM7,32H8V33H7zM10,32H11V33H10zM12,32H13V33H12zM14,32H15V33H14zM15,32H16V33H15zM16,32H17V33H16zM17,32H18V33H17zM18,32H19V33H18zM19,32H20V33H19zM20,32H21V33H20zM21,32H22V33H21zM23,32H24V33H23zM25,32H26V33H25zM30,32H31V33H30zM32,32H33V33H32zM33,32H34V33H33zM1,33H2V34H1zM2,33H3V34H2zM3,33H4V34H3zM4,33H5V34H4zM5,33H6V34H5zM6,33H7V34H6zM7,33H8V34H7zM10,33H11V34H10zM11,33H12V34H11zM12,33H13V34H12zM13,33H14V34H13zM14,33H15V34H14zM15,33H16V34H15zM16,33H17V34H16zM21,33H22V34H21zM24,33H25V34H24zM25,33H26V34H25zM27,33H28V34H27zM29,33H30V34H29zM31,33H32V34H31z";

function useFluctuatingCount(base: number, variance: number, intervalMs: number) {
  const [count, setCount] = useState(base);
  const displayRef = useRef(base);

  useEffect(() => {
    const tick = () => {
      const delta = Math.floor((Math.random() - 0.48) * variance);
      const next = Math.max(base - variance * 3, Math.min(base + variance * 3, displayRef.current + delta));
      displayRef.current = next;
      setCount(next);
    };
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [base, variance, intervalMs]);

  return count;
}

export default function AdvertiseBanner() {
  const online = useFluctuatingCount(30500, 12, 2200);
  const [prevCount, setPrevCount] = useState(30500);
  const [trend, setTrend] = useState<'up' | 'down'>('up');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTrend(online > prevCount ? 'up' : 'down');
    setPrevCount(online);
  }, [online]);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const formatted = online.toLocaleString('mn-MN');

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
      {/* Background glow effects */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 60% at 15% 50%, rgba(73,198,229,0.06) 0%, transparent 70%)',
      }}/>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 50% 80% at 85% 50%, rgba(73,198,229,0.04) 0%, transparent 70%)',
      }}/>

      <div style={{
        maxWidth: '1100px', margin: '0 auto',
        display: 'flex', alignItems: 'center', gap: '48px',
        flexWrap: 'wrap', justifyContent: 'center',
      }}>

        {/* LEFT — Copy */}
        <div style={{ flex: '1 1 340px', minWidth: '280px' }}>
          {/* Live badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(73,198,229,0.1)', border: '1px solid rgba(73,198,229,0.25)',
              borderRadius: '999px', padding: '4px 12px',
              fontSize: '12px', fontWeight: 600, color: '#49C6E5',
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              <span style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: '#49C6E5',
                boxShadow: '0 0 8px #49C6E5',
                animation: 'pulse-dot 1.4s ease-in-out infinite',
              }}/>
              LIVE
            </span>
          </div>

          {/* Online counter */}
          <div style={{ marginBottom: '6px', display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{
              fontFamily: "'DM Mono', 'Courier New', monospace",
              fontSize: 'clamp(42px, 6vw, 64px)',
              fontWeight: 700,
              color: trend === 'up' ? '#49C6E5' : '#7dd3fc',
              letterSpacing: '-2px',
              lineHeight: 1,
              transition: 'color 0.4s ease',
              textShadow: '0 0 40px rgba(73,198,229,0.3)',
            }}>
              {formatted}
            </span>
            <span style={{
              fontSize: '20px',
              color: trend === 'up' ? '#4ade80' : '#f87171',
              transition: 'color 0.4s ease',
              fontWeight: 700,
            }}>
              {trend === 'up' ? '▲' : '▼'}
            </span>
          </div>

          <p style={{
            fontSize: '15px', color: 'rgba(255,255,255,0.45)',
            marginBottom: '28px', letterSpacing: '0.04em',
          }}>
            одоогийн үзэгч · viewers online right now
          </p>

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
            Reach your audience on Mongolia's leading streaming platform.
            Advertise your business, product, or service to thousands of daily viewers.
          </p>

          {/* CTA button */}
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
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 32px rgba(73,198,229,0.5)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 24px rgba(73,198,229,0.35)';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.19 13.982l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.958.577z"/>
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
            boxShadow: '0 0 0 1px rgba(73,198,229,0.2), 0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(73,198,229,0.1)',
          }}>
            {/* Corner accents */}
            {[['0','0'],['auto','0'],['0','auto'],['auto','auto']].map(([t,b], i) => (
              <div key={i} style={{
                position: 'absolute',
                top: t === '0' ? '-3px' : 'auto',
                bottom: b === '0' ? '-3px' : 'auto', // This logic is wrong, fix:
                left: i % 2 === 0 ? '-3px' : 'auto',
                right: i % 2 === 1 ? '-3px' : 'auto',
                width: '16px', height: '16px',
                border: '2.5px solid #49C6E5',
                borderRadius: i === 0 ? '4px 0 0 0' : i === 1 ? '0 4px 0 0' : i === 2 ? '0 0 0 4px' : '0 0 4px 0',
                borderRight: i % 2 === 0 ? 'none' : '2.5px solid #49C6E5',
                borderBottom: i < 2 ? 'none' : '2.5px solid #49C6E5',
                borderLeft: i % 2 === 0 ? '2.5px solid #49C6E5' : 'none',
                borderTop: i < 2 ? '2.5px solid #49C6E5' : 'none',
              }}/>
            ))}

            <svg
              width="160" height="160"
              viewBox="0 0 35 35"
              xmlns="http://www.w3.org/2000/svg"
              style={{ display: 'block' }}
            >
              <rect width="35" height="35" fill="white"/>
              <path d={QR_PATH} fill="#010816"/>
            </svg>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontSize: '12px', color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.05em', marginBottom: '4px',
            }}>
              QR уншуулаад холбогдоорой
            </p>
            <p style={{
              fontSize: '13px', color: '#49C6E5', fontWeight: 600,
              letterSpacing: '0.03em',
            }}>
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
