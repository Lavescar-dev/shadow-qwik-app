# SHADOW // Hardware Terminal

Qwik + Three.js storefront demosu. Terminal estetiğinde modüler bir donanım kataloğu; shop, assembly ve electronic olmak üzere üç çalışma yüzeyi.

## Stack

- Qwik 1.19 (Qwik City değil — çıplak Qwik, kendi view/section switching state'i ile)
- Three.js 0.128 (3B/grafik sahneler için)
- Tailwind CSS 3.4
- Vite 7
- TypeScript 5.8

## Komutlar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run check    # tsc --noEmit
```

## Yapı

- `src/root.tsx` — uygulama kabuğu, view + section switching
- `src/entry.dev.tsx` — dev modu render entrypoint
- `src/context/app-context.ts` — global state context
- `src/components/*` — temel UI (header, footer, catalog, cart, detail, checkout, toasts, pagination)
- `src/components/assembly/*` — montaj yüzeyi
- `src/components/electronics/*` — devre/EDA yüzeyi
- `src/data/*` — mock ürün, envanter, yorumlar
- `src/lib/*` — actions, cart, catalog, format, electronics, assembly yardımcıları
