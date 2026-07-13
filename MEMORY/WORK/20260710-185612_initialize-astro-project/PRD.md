---
task: Инициализировать Astro-проект и установить необходимые зависимости
slug: 20260710-185612_initialize-astro-project
effort: standard
phase: complete
progress: 16/16
mode: interactive
started: 2026-07-10T18:56:12+05:00
updated: 2026-07-10T19:22:00+05:00
---

## Context

Пользователь поручил установить необходимые зависимости и инициализировать проект в текущем корне. Существующие `GUIDE.md`, `AGENTS.md`, `Design.md`, `design-tokens.json`, `tokens.css` и `Maket.html` задают однозначный минимальный дизайн: npm + Node 22-compatible ESM, Astro 6, Tailwind CSS v4 через `@tailwindcss/vite`, GSAP 3, strict TypeScript и статическая сборка. Инициализация создаёт рабочий scaffold, но не переносит весь прототип `Maket.html` в Astro-компоненты.

### Risks

- npm registry или package resolution могут быть временно недоступны.
- Astro/Tailwind setup необходимо сверить с актуальной официальной документацией.
- Существующие root artifacts должны остаться неизменными.
- Минимальный route подтверждает toolchain, но не означает миграцию лендинга.
- Локальные Node `v22.22.2` и npm `10.9.7` соответствуют выбранному runtime.

## Criteria

- [x] ISC-1: Корневой `package.json` объявляет проект совместимым с ESM modules
- [x] ISC-2: Manifest предоставляет dev, build, preview команды Astro lifecycle
- [x] ISC-3: Manifest содержит четыре зависимости утверждённого Astro technology stack
- [x] ISC-4: npm создаёт согласованный lockfile для воспроизводимой установки dependencies
- [x] ISC-5: Локальный `node_modules` содержит установленные зависимости текущего проекта
- [x] ISC-6: Astro config подключает Tailwind только через Vite plugin
- [x] ISC-7: TypeScript config расширяет строгую конфигурацию Astro framework
- [x] ISC-8: TypeScript alias `@/*` разрешается относительно каталога `src/*`
- [x] ISC-9: Корневой Astro route успешно рендерит валидный HTML документ
- [x] ISC-10: Global stylesheet подключает Tailwind CSS четвёртой версии
- [x] ISC-11: Production build завершается с нулевым process exit code
- [x] ISC-12: Production build создаёт непустой статический каталог `dist`
- [x] ISC-13: Preview server возвращает HTTP 200 для маршрута `/`
- [x] ISC-A-1: Инициализация не изменяет существующие design и prototype artifacts
- [x] ISC-A-2: Инициализация не добавляет лишние клиентские UI frameworks
- [x] ISC-A-3: Scaffold не выдаётся за завершённую миграцию существующего лендинга

## Decisions

- 2026-07-10 18:56: Использовать существующий `GUIDE.md` как утверждённый дизайн и инициализировать минимальный in-place scaffold без миграции контента.

## Verification

- ISC-1–ISC-5: `package.json`, npm lockfile и четыре installed package manifests прочитаны напрямую; версии 6.2.2/4.2.4/4.2.4/3.15.0.
- ISC-6–ISC-10: `astro.config.mjs`, `tsconfig.json`, `index.astro` и `global.css` соответствуют Context7 official setup.
- ISC-11: Финальный `npm run build` завершился exit code 0 за 564ms.
- ISC-12: `dist/index.html` имеет 799 bytes; compiled CSS имеет 15.5KB.
- ISC-13: Preview smoke вернул HTTP 200, `text/html`, ожидаемый title и stylesheet link.
- ISC-A-1: `Design.md`, `GUIDE.md`, `Maket.html`, `tokens.css`, `design-tokens.json` сохранили исходные content hashes.
- ISC-A-2: Targeted `npm ls` подтвердил только Astro, Tailwind, Vite plugin и GSAP как root dependencies.
- ISC-A-3: `index.astro` явно называет страницу scaffold; `Maket.html` не мигрирован.
- Reviewer: независимый AstroReviewFallback вернул `APPROVED`, actionable defects отсутствуют.
- Capabilities: brainstorming, astro, Context7, team-feature tasks, systematic-debugging и verification-before-completion фактически вызваны.
