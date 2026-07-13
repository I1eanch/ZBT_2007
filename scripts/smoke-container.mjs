const base = process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:8080';

const securityHeaders = {
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
  'x-frame-options': 'DENY',
};

function assertHeader(path, response, name, expected) {
  const actual = response.headers.get(name);
  if (actual !== expected) {
    throw new Error(`${path}: header ${name} expected "${expected}", received "${actual}"`);
  }
}

function assertSecurityHeaders(path, response) {
  for (const [name, expected] of Object.entries(securityHeaders)) {
    assertHeader(path, response, name, expected);
  }
}

async function fetchOk(path) {
  const response = await fetch(`${base}${path}`);
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return response;
}

// Status + body contract.
const home = await fetchOk('/');
const homeBody = await home.text();
if (!homeBody.includes('Здоровье без таблеток')) throw new Error('/: missing Здоровье без таблеток');

const health = await fetchOk('/healthz');
if (!(await health.text()).includes('ok')) throw new Error('/healthz: missing ok');

// Security headers must reach the document, index, hashed assets and health.
assertSecurityHeaders('/', home);
assertSecurityHeaders('/healthz', health);

// Cache policy: index is no-cache.
assertHeader('/', home, 'cache-control', 'no-cache');

const index = await fetchOk('/index.html');
assertSecurityHeaders('/index.html', index);
assertHeader('/index.html', index, 'cache-control', 'no-cache');

// Hashed asset discovered from the homepage: immutable cache + security headers.
const assetMatch = homeBody.match(/\/_astro\/[^"']+/);
if (!assetMatch) throw new Error('no /_astro/ asset referenced in homepage');
const assetPath = assetMatch[0];
const asset = await fetchOk(assetPath);
assertSecurityHeaders(assetPath, asset);
assertHeader(assetPath, asset, 'cache-control', 'public, max-age=31536000, immutable');

// Social sharing preview: the production build must resolve og:image to an
// ABSOLUTE URL (crawlers reject relative paths), and nginx must serve the raster.
const ogMatch = homeBody.match(/property="og:image" content="([^"]+)"/);
if (!ogMatch) throw new Error('/: missing og:image meta');
const ogUrl = ogMatch[1];
if (!/^https:\/\/.+\/og-image\.png$/.test(ogUrl)) {
  throw new Error(`/: og:image must be an absolute https URL to og-image.png, received "${ogUrl}"`);
}
if (!homeBody.includes('name="twitter:card" content="summary_large_image"')) {
  throw new Error('/: missing twitter:card=summary_large_image');
}
const ogImage = await fetchOk('/og-image.png');
assertSecurityHeaders('/og-image.png', ogImage);
assertHeader('/og-image.png', ogImage, 'content-type', 'image/png');

console.log('container smoke passed');
