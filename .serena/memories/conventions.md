# Conventions
- Русский контент и комментарии; технические identifiers на английском.
- Astro-компоненты PascalCase; variables/props camelCase; CSS/custom properties kebab-case.
- Повторяемые значения брать из `design-tokens.json`/`tokens.css`; raw hex под `src/` запрещён, кроме утверждённого inline SVG.
- Не использовать `transition: all`, `href="#"`, layout-анимации `width/height/top/left`.
- Секционные компоненты объявляют только `data-animate`; GSAP централизован.
- Полиморфные UI-примитивы обязаны прокидывать неиспользованные native HTML attributes.
- `src/pages/index.astro` остаётся тонким composition root.
- `Maket.html` не редактировать.
- Не добавлять backend/shared state/DI без конкретного runtime-контракта.