'use client';

export function SearchEmptyPrompt() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.3)' }}>
      <div style={{ fontSize: '44px', marginBottom: '12px' }}>🔍</div>
      <p style={{ fontSize: '15px' }}>Кино нэрээр хайна уу</p>
      <p style={{ fontSize: '12px', marginTop: '6px', opacity: 0.6 }}>эсвэл ангилал сонгоно уу</p>
    </div>
  );
}

export function SearchNoResults({ query }: { query: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.3)' }}>
      <div style={{ fontSize: '44px', marginBottom: '12px' }}>😕</div>
      <p style={{ fontSize: '15px' }}>«{query}» олдсонгүй</p>
    </div>
  );
}

