/**
 * Deploy хийхийн өмнө R2 cache bucket-ийг бүрэн цэвэрлэнэ.
 * Ашиглалт: bun run clear-cache
 */

import { execSync } from 'child_process';

const BUCKET = 'narhan-cache';

function run(cmd) {
  return execSync(cmd, { encoding: 'utf8' });
}

console.log(`🗑️  R2 bucket цэвэрлэж байна: ${BUCKET}`);

let cursor = undefined;
let totalDeleted = 0;

while (true) {
  const cmd = cursor
    ? `wrangler r2 object list ${BUCKET} --json --cursor ${cursor}`
    : `wrangler r2 object list ${BUCKET} --json`;

  let result;
  try {
    result = JSON.parse(run(cmd));
  } catch {
    console.log('✅ Bucket хоосон байна, цэвэрлэх зүйл алга.');
    break;
  }

  const objects = result.objects ?? [];

  for (const obj of objects) {
    try {
      run(`wrangler r2 object delete ${BUCKET} "${obj.key}"`);
      totalDeleted++;
      console.log(`  ✓ ${obj.key}`);
    } catch (e) {
      console.warn(`  ⚠ Устгаж чадсангүй: ${obj.key}`, e.message);
    }
  }

  if (!result.truncated) break;
  cursor = result.cursor;
}

console.log(`\n✅ Дууслаа — ${totalDeleted} файл устгагдлаа.`);
