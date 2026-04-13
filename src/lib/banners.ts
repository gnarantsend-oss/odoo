// ╔══════════════════════════════════════════════════════════════╗
// ║              BANNER ТОХИРГОО — banners.ts                   ║
// ║  Зөвхөн энэ файлыг л засна, өөр файлд хүрэх шаардлагагүй  ║
// ╚══════════════════════════════════════════════════════════════╝
//
//  img  → байгууллагаас ирсэн зурагны URL (.jpg / .png / .gif)
//  href → banner дарахад очих URL
//  alt  → хайлт, хүртээмжид зориулсан текст (заавал биш)
//
//  ⚠️  Banner идэвхгүй болгохдоо тухайн мөрийг устгасан ч болно,
//      тухайн байрлалд зай үлдэнэ.

export type Banner = {
  img:  string;
  href: string;
  alt?: string;
};

// Дарааллаар нь:
//   [0] → Драм row-н доор
//   [1] → Аймшиг row-н доор
//   [2] → Инээдэм row-н доор
//   [3] → Трейлер row-н доор

const BANNERS: Banner[] = [
  {
    img:  'https://placehold.co/720x250/0f172a/e50914?text=Banner+1',
    href: 'https://example.com',
    alt:  'Banner 1',
  },
  {
    img:  'https://placehold.co/720x250/0f172a/38d0f0?text=Banner+2',
    href: 'https://example.com',
    alt:  'Banner 2',
  },
  {
    img:  'https://placehold.co/720x250/0f172a/e50914?text=Banner+3',
    href: 'https://example.com',
    alt:  'Banner 3',
  },
  {
    img:  'https://placehold.co/720x250/0f172a/38d0f0?text=Banner+4',
    href: 'https://example.com',
    alt:  'Banner 4',
  },
];

export default BANNERS;
