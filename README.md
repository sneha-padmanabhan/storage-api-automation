# FakeStoreAPI — Cart CRUD API Tests

API test suite for the **Cart** resource of [FakeStoreAPI](https://fakestoreapi.com/): full CRUD (POST / GET / PUT / DELETE) with positive, negative, authentication, JSON-schema validation, a data-driven scenario, and a contract (shape-snapshot) test. Runs on every push via GitHub Actions.

> **FakeStoreAPI simulates writes.** POST/PUT/DELETE return a realistic response with a fake `id` but **do not persist**. So these tests assert on each operation's *response*, not on read-after-write — a deliberate design choice for this target, not a gap.

## Framework choosen — why Playwright Test

`@playwright/test` in **API mode** (the built-in `request` fixture), with **Ajv** for JSON Schema.

- **One tool, no browser.** Pure API tests use `request`, so no browser binaries — CI is just `npm ci && npx playwright test`, and it's the same runner (and report format) as the UI suites.
- **Batteries included.** Parallel workers, retries, fixtures, and HTML/JSON reporters ship in one dependency — no Mocha/Chai/supertest to wire together.
- **Precise schema errors.** Ajv validates every response against a committed JSON Schema and reports all failures at once, which makes drift obvious.

## Run it

```bash
npm ci
npm test                 # everything
npm run test:positive    # @positive       npm run test:negative   # @negative
npm run test:auth        # @auth            npm run test:schema     # @schema
npm run test:contract    # @contract       npm run test:datadriven # @datadriven
npm run snapshot:cart    # regenerate the committed shape snapshot from the live API
npm run report           # open the HTML report
```

Override the target or credentials with `FAKESTORE_URL`, `FAKESTORE_USERNAME`, `FAKESTORE_PASSWORD`.

## Layout

`tests/` — crud · negative · auth · data-driven · contract  |  `schemas/` — cart/product/auth JSON Schemas + the committed `cart.shape.json`  |  `utils/` — endpoints, Ajv validators, shape helper, test data  |  `scripts/snapshot-cart.js` — regenerates the shape.

## What's covered

- **CRUD (positive):** create, list, read-by-id, update, delete — each response schema-validated.
- **Negative:** non-existent id, non-numeric id, malformed POST body — asserts the response is *not* a valid cart (or the API 4xx-rejects it).
- **Authentication:** `/auth/login` valid → token; wrong password → no token; missing field → no token; and a valid Bearer token round-tripped on a cart request.
- **Schema validation:** every cart/auth response checked against JSON Schema via Ajv.
- **Data-driven:** the create-cart scenario runs across product IDs `1, 2, 3, 5, 7` (one test each).
- **Contract test:** `GET /carts/:id` shape (keys + value types, `__v` ignored) is compared to the committed `cart.shape.json`; structural drift fails, value changes don't.

## Extension plan

**Parallelisation.** `fullyParallel: true` already spreads specs across workers (`--workers=N`). API tests are lightweight, so shard in CI with a `strategy.matrix` + `--shard=i/n`, and fan the same suite across environments (prod/staging base URLs via `FAKESTORE_URL`) in one matrix.

**Reporting.** HTML + JSON reporters are wired now. Next: publish the HTML report to **GitHub Pages** per run, feed the JSON into **Allure** for historical trends, and drop in the **AI failure-triage reporter** from the UI suite so failures return a suggested root cause. Capturing response timings alongside status turns this into a light contract-plus-latency gate.
