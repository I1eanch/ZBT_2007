# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual-refinements.spec.ts >> visual refinements — hero, facts, sticky CTA >> sticky CTA stays hidden past the stop and does not obscure footer/legal links
- Location: tests/visual-refinements.spec.ts:79:3

# Error details

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  locator('[data-sticky-cta]')
Expected: "true"
Received: "false"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" with timeout 5000ms
  - waiting for locator('[data-sticky-cta]')
    14 × locator resolved to <div data-sticky-cta="" data-hidden="false" aria-hidden="false" class="fixed left-1/2 z-40 -translate-x-1/2 bottom-[calc(var(--space-4)+env(safe-area-inset-bottom,0px))] transition-[opacity,transform,visibility] duration-[var(--duration-base)] motion-reduce:transition-none data-[hidden=true]:opacity-0 data-[hidden=true]:translate-y-[var(--space-4)] data-[hidden=true]:pointer-events-none data-[hidden=true]:invisible">…</div>
       - unexpected value "false"

```

```yaml
- link "Забрать место + 6 подарков →":
  - /url: "#registration"
```

# Test source

```ts
  7   | 
  8   |     const hero = page.locator('#hero');
  9   |     await expect(hero).toBeVisible();
  10  | 
  11  |     // Two local raster images: background + illustration
  12  |     const images = hero.locator('img[src^="/"]');
  13  |     await expect(images).toHaveCount(2);
  14  | 
  15  |     // Both images must report naturalWidth > 0 (successfully decoded)
  16  |     for (const img of await images.all()) {
  17  |       const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
  18  |       expect(naturalWidth).toBeGreaterThan(0);
  19  |     }
  20  |   });
  21  | 
  22  |   test('event-fact text computes to >=15px and icon circle computes to >=40px', async ({ page }) => {
  23  |     await page.goto('/');
  24  |     await page.waitForLoadState('networkidle');
  25  | 
  26  |     // Fact items must expose narrow data markers (contract requirement)
  27  |     const factItems = page.locator('[data-fact-item]');
  28  |     await expect(factItems).toHaveCount(3);
  29  | 
  30  |     // Check computed font size on text (>=15px) and icon circle diameter (>=40px)
  31  |     for (const item of await factItems.all()) {
  32  |       const text = item.locator('[data-fact-text]');
  33  |       const icon = item.locator('[data-fact-icon]');
  34  | 
  35  |       await expect(text).toBeVisible();
  36  |       await expect(icon).toBeVisible();
  37  | 
  38  |       const textSize = await text.evaluate((el) => {
  39  |         const fs = parseFloat(getComputedStyle(el).fontSize);
  40  |         return fs;
  41  |       });
  42  |       expect(textSize).toBeGreaterThanOrEqual(15);
  43  | 
  44  |       const iconSize = await icon.evaluate((el) => {
  45  |         const rect = el.getBoundingClientRect();
  46  |         return Math.min(rect.width, rect.height);
  47  |       });
  48  |       expect(iconSize).toBeGreaterThanOrEqual(40);
  49  |     }
  50  |   });
  51  | 
  52  |   test('sticky CTA is hidden while hero intersects viewport and becomes visible after scrolling #hook into view', async ({ page }) => {
  53  |     await page.goto('/');
  54  |     await page.waitForLoadState('networkidle');
  55  | 
  56  |     const cta = page.locator('[data-sticky-cta]');
  57  |     const hero = page.locator('#hero');
  58  | 
  59  |     // Initial state: hero in view → CTA must be hidden
  60  |     await expect(hero).toBeInViewport();
  61  |     await expect(cta).toHaveAttribute('data-hidden', 'true');
  62  |     await expect(cta).toHaveCSS('visibility', 'hidden');
  63  | 
  64  |     // Deterministic scroll past hero (disable smooth behavior to avoid fractional edge intersection)
  65  |     await page.evaluate(() => {
  66  |       document.documentElement.style.scrollBehavior = 'auto';
  67  |       const heroEl = document.querySelector('#hero') as HTMLElement;
  68  |       if (heroEl) {
  69  |         window.scrollTo(0, heroEl.offsetHeight + 2);
  70  |       }
  71  |     });
  72  |     await expect(hero).not.toBeInViewport();
  73  | 
  74  |     // Now CTA must be visible
  75  |     await expect(cta).toHaveAttribute('data-hidden', 'false');
  76  |     await expect(cta).toBeVisible();
  77  |   });
  78  | 
  79  |   test('sticky CTA stays hidden past the stop and does not obscure footer/legal links', async ({ page }) => {
  80  |     // A short viewport guarantees enough content below [data-sticky-stop] that a
  81  |     // full scroll pushes the stop entirely ABOVE the viewport — the exact state
  82  |     // where a naive `isIntersecting` check flips back to false and lets the CTA
  83  |     // reappear over the footer.
  84  |     await page.setViewportSize({ width: 1280, height: 300 });
  85  |     await page.goto('/');
  86  |     await page.waitForLoadState('networkidle');
  87  | 
  88  |     const cta = page.locator('[data-sticky-cta]');
  89  |     const stop = page.locator('[data-sticky-stop]');
  90  | 
  91  |     // Baseline: stop scrolled into view → CTA hidden.
  92  |     await stop.scrollIntoViewIfNeeded();
  93  |     await expect(cta).toHaveAttribute('data-hidden', 'true');
  94  | 
  95  |     // Scroll fully to the bottom so the stop leaves the viewport above the fold.
  96  |     await page.evaluate(() => {
  97  |       document.documentElement.style.scrollBehavior = 'auto';
  98  |       window.scrollTo(0, document.body.scrollHeight);
  99  |     });
  100 | 
  101 |     // Precondition: the stop is genuinely above the viewport top.
  102 |     await expect
  103 |       .poll(async () => stop.evaluate((el) => el.getBoundingClientRect().bottom))
  104 |       .toBeLessThan(0);
  105 | 
  106 |     // The CTA must STAY hidden — it must not reappear and cover the footer/links.
> 107 |     await expect(cta).toHaveAttribute('data-hidden', 'true');
      |                       ^ Error: expect(locator).toHaveAttribute(expected) failed
  108 |     await expect(cta).toHaveCSS('visibility', 'hidden');
  109 |     await expect(cta).toHaveCSS('pointer-events', 'none');
  110 | 
  111 |     // Footer legal links remain visible and unobstructed at the very bottom.
  112 |     await expect(page.locator('#footer nav a').first()).toBeVisible();
  113 |   });
  114 |   test('disables sticky CTA transitions under reduced motion', async ({ page }) => {
  115 |     await page.emulateMedia({ reducedMotion: 'reduce' });
  116 |     await page.goto('/');
  117 |     await page.waitForLoadState('networkidle');
  118 | 
  119 |     const cta = page.locator('[data-sticky-cta]');
  120 |     await expect(cta).toBeAttached();
  121 | 
  122 |     const transitionProperty = await cta.evaluate((el) => getComputedStyle(el).transitionProperty);
  123 |     expect(transitionProperty).toBe('none');
  124 |   });
  125 | });
  126 | 
```