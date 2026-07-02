const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // FakeStoreAPI is a shared public service and can be briefly flaky — a retry
  // smooths transient 5xx without hiding real failures.
  retries: process.env.CI ? 2 : 1,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    baseURL: process.env.FAKESTORE_URL || 'https://fakestoreapi.com',
    // /auth/login needs an explicit JSON content-type; set it globally to be safe.
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  },
  // Pure API tests use the `request` fixture — no browser project needed.
  projects: [{ name: 'api' }],
});
