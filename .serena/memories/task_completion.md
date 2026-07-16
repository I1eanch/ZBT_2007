# Task completion
- Основной gate: `npm run verify`.
- Gate включает: content validation, `astro check`, static build, Playwright desktop+mobile.
- Для точечных изменений сначала запускать сфокусированный behavioral test; после smoke — cleanup и полный затронутый gate.
- Перед релизом инварианты: нет raw hex, `transition: all`, section-level GSAP imports, `href="#"`.
- Production deploy не считать проверенным без `PRODUCTION_DOMAIN`, Dokploy credentials/branch и VPS firewall/DNS access.
- Container QA отдельно: `npm run smoke:container` и Docker health `healthy`.