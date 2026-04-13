import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * On-demand Cache Revalidation API
 *
 * Шинэ кино нэмэх, засварлах үед cache-г шууд цэвэрлэнэ.
 * Deploy хүлээлгүй хэрэглэгчид шинэ контент харагдана.
 *
 * Жишээ:
 *   Бүх хуудас:   POST /api/revalidate?secret=XXX&path=/
 *   Тодорхой кино: POST /api/revalidate?secret=XXX&path=/mongol/watch/42
 *   Tag-аар:       POST /api/revalidate?secret=XXX&tag=movies
 */
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  const path   = req.nextUrl.searchParams.get('path');
  const tag    = req.nextUrl.searchParams.get('tag');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!path && !tag) {
    return NextResponse.json({ error: 'path эсвэл tag шаардлагатай' }, { status: 400 });
  }

  try {
    if (tag) {
      // Next.js 16: хоёр дахь аргумент шаардлагатай
      // { expire: 0 } → шууд устгана (API route-д тохиромжтой)
      revalidateTag(tag, { expire: 0 });
      return NextResponse.json({ revalidated: true, type: 'tag', tag });
    }

    revalidatePath(path!, 'layout');
    return NextResponse.json({ revalidated: true, type: 'path', path });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
