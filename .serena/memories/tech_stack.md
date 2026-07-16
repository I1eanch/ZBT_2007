# Tech stack
- Node `22.22.2` из `.nvmrc`; npm `10.9.7`; ESM.
- Astro `7.0.7`, static output.
- Tailwind CSS `4.2.4` через `@tailwindcss/vite`; не добавлять Tailwind config, PostCSS integration или `@astrojs/tailwind`.
- GSAP `3.15.0`; инициализация только в `src/lib/motion.ts`.
- TypeScript strict через `astro/tsconfigs/strict`; alias `@/* -> src/*`.
- Playwright: desktop Chromium и mobile Chromium.
- Production build: Node Alpine; runtime: pinned nginx Alpine image.