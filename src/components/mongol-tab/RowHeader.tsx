'use client';

export function RowHeader({
  title,
  count,
  showAll = true,
}: {
  title: string;
  count: number;
  showAll?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 4%',
        marginBottom: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
        <h2 style={{ fontSize: '19px', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>{title}</h2>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>{count}</span>
      </div>
      {showAll && (
        <span style={{ fontSize: '12px', color: '#e50914', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.04em' }}>
          Бүгд ›
        </span>
      )}
    </div>
  );
}

