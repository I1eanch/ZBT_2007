---
task: Обновить hero-графику, инфоблок и позицию sticky CTA
slug: 20260711-081836_update-hero-art-info-sticky-cta
effort: extended
phase: complete
progress: 20/20
mode: interactive
started: 2026-07-11T08:18:36+05:00
updated: 2026-07-11T10:02:00+05:00
---

## Context

Пользователь прислал три визуальных замечания: заменить бледную inline-SVG hero-графику на красивый тематический арт и отдельный фон, усилить читаемость нижнего hero-инфоблока, а также не позволять fixed CTA перекрывать строку согласия и footer. Изображения должны быть сгенерированы через Nano Banana MCP и встроены в существующий Astro/Tailwind token system без изменения контента или no-send registration contract.

### Plan

1. Сгенерировать через Nano Banana два art-directed asset в `src/assets/`: abstract atmospheric background 16:9 и editorial wellness illustration 3:4.
2. Сначала добавить Playwright regression coverage для hero assets/info strip и sticky consent boundary; подтвердить RED на текущем DOM.
3. В `Hero.astro` заменить inline SVG на Astro `Image`, добавить оптимизированный background layer, сохранить copy и усилить info strip token-based стилями.
4. В `Registration.astro` добавить semantic stop marker на consent line; в `StickyCTA.astro` переключать hidden state через IntersectionObserver и reduced-motion-safe classes.
5. Запустить focused GREEN, полный `npm run verify`, затем browser screenshots/measurements на desktop и mobile.

### Risks

- Nano Banana может сгенерировать текст, watermark, medical imagery или palette drift; prompt запрещает их, а output проверяется визуально.
- Full-bleed background может снизить contrast hero copy; поверх asset остаётся контролируемый token-based gradient overlay.
- Raster assets могут увеличить initial payload; оба проходят Astro optimization, illustration получает responsive `srcset`.
- IntersectionObserver может вызвать поздний fade sticky CTA; marker ставится на consent line, observer использует отрицательный bottom margin и initial state определяется сразу.
- Sticky regression может быть flaky при анимации; тест проверяет конечное hidden state после viewport-stable assertion, а reduced-motion отключает transition.

## Criteria

- [x] ISC-1: Создан отдельный тематический hero illustration asset
- [x] ISC-2: Создан отдельный атмосферный hero background asset
- [x] ISC-3: Сгенерированные assets не содержат текста или watermark
- [x] ISC-4: Hero использует Astro image pipeline для illustration

- [x] ISC-5: Hero background сохраняет читаемый контраст текста
- [x] ISC-6: Hero illustration имеет фиксированные dimensions против CLS
- [x] ISC-7: Hero headline и CTA copy остаются неизменными
- [x] ISC-8: Hero info strip использует увеличенный размер текста
- [x] ISC-9: Hero info icons имеют увеличенный визуальный размер
- [x] ISC-10: Hero info strip не создаёт horizontal overflow на mobile
- [x] ISC-11: Consent line предоставляет явный sticky-stop marker
- [x] ISC-12: Sticky CTA появляется после hero boundary
- [x] ISC-13: Sticky CTA не перекрывает consent line
- [x] ISC-14: Sticky CTA не перекрывает footer
- [x] ISC-15: Sticky transition уважает reduced-motion
- [x] ISC-16: Focused regression tests сначала воспроизводят дефекты
- [x] ISC-17: Focused regression tests проходят после реализации
- [x] ISC-18: `npm run verify` завершается с exit code 0
- [x] ISC-19: Desktop visual smoke подтверждает новый hero и CTA boundary
- [x] ISC-20: Mobile visual smoke подтверждает новый hero и CTA boundary

## Decisions

- 2026-07-11 08:22: Генерировать два самостоятельных raster assets через Nano Banana: спокойный abstract background и содержательную editorial illustration.
- 2026-07-11 08:22: При появлении consent line скрывать redundant sticky CTA; основной form submit остаётся доступным, а overlap исключается без scroll math.
- 2026-07-11 09:20: Mobile visual QA обнаружила overlap CTA с увеличенным hero info strip; sticky теперь скрыт внутри hero, видим между hero и consent, затем снова скрывается.

## Verification

- Nano Banana MCP generated `hero-background.jpg` (2752×1536) and `hero-wellness-illustration.jpg` (1792×2400); visual inspection confirmed no text, logos or watermark.
- TDD RED: hero images 0/2, fact markers 0/3, sticky markers absent; later hero-overlap regression expected `data-hidden=true` and received `false`.
- Focused GREEN: `tests/visual-refinements.spec.ts` — 5/5 desktop tests passed.
- `npm run verify` with `ASTRO_DEV_BACKGROUND=0`: content validation passed; Astro check 0 errors/warnings/hints; optimized static build passed; Playwright 38/38 passed across desktop/mobile.
- Astro build emitted five optimized WebP image variants for the two generated source assets.
- Desktop browser QA 1440×900: two decoded hero images, facts 15px/icons 40px, zero overflow; sticky hidden in hero, visible after hero, hidden at consent/footer.
- Mobile browser QA 390×844: zero overflow, facts remain 15px/icons 40px, sticky does not cover hero facts, consent or footer; screenshots visually confirmed readable contrast and intended composition.
