/**
 * Deploy хийхийн өмнө R2 cache bucket-ийг бүрэн цэвэрлэнэ.
 *
 * ⚠️  wrangler r2 object list команд 2026 оны байдлаар байхгүй тул
 *     Cloudflare REST API-г ашиглана.
 *
 * Шаардлагатай env var-ууд (Cloudflare Workers Builds-д нэмэх):
 *   CLOUDFLARE_ACCOUNT_ID  — Cloudflare dashboard → дээд баруун булан
 *   CLOUDFLARE_API_TOKEN   — wrangler-н ашигладаг token-той ижил
 *
 * Ашиглалт: bun run clear-cache
 */

const BUCKET     = 'narhan-cache';
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN  = process.env.CLOUDFLARE_API_TOKEN;
const API_BASE   = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/r2/buckets/${BUCKET}`;

if (!ACCOUNT_ID || !API_TOKEN) {
  console.warn('⚠️  CLOUDFLARE_ACCOUNT_ID эсвэл CLOUDFLARE_API_TOKEN тохируулаагүй.');
  console.warn('   R2 cache цэвэрлэлт алгасагдлаа.');
  process.exit(0);
}

console.log(`🗑️  R2 bucket цэвэрлэж байна: ${BUCKET}`);

/** Cloudflare REST API-аар объектуудын жагсаалт авна */
async function listObjects(cursor) {
  const url = new URL(`${API_BASE}/objects`);
  url.searchParams.set('per_page', '1000');
  if (cursor) url.searchParams.set('cursor', cursor);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  });
  if (!res.ok) throw new Error(`List алдаа [${res.status}]: ${await res.text()}`);
  return res.json();
}

/** Нэг объект устгана */
async function deleteObject(key) {
  const url = `${API_BASE}/objects/${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  });
  if (!res.ok) throw new Error(`Delete алдаа [${res.status}]: ${await res.text()}`);
}

let totalDeleted = 0;
let cursor;

while (true) {
  const data = await listObjects(cursor);

  if (!data.success) {
    console.warn('⚠️  API алдаа:', JSON.stringify(data.errors));
    break;
  }

  const objects = data.result?.objects ?? [];

  if (objects.length === 0) {
    console.log('✅ Bucket хоосон байна, цэвэрлэх зүйл алга.');
    break;
  }

  for (const obj of objects) {
    try {
      await deleteObject(obj.key);
      totalDeleted++;
      process.stdout.write(`  ✓ ${obj.key}\n`);
    } catch (e) {
      console.warn(`  ⚠ Устгаж чадсангүй: ${obj.key} — ${e.message}`);
    }
  }

  if (!data.result?.truncated) break;
  cursor = data.result?.cursor;
}

console.log(`\n✅ Дууслаа — ${totalDeleted} файл устгагдлаа.`);
