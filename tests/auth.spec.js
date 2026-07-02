// Authentication — /auth/login flow and token usage.

const { test, expect } = require('@playwright/test');
const { endpoints, login } = require('../utils/api');
const { validate } = require('../utils/validate');
const { USERS } = require('../utils/testData');

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

test.describe('Authentication', () => {
  test('Valid credentials return a token @auth @positive @schema', async ({ request }) => {
    const res = await login(request, USERS.valid.username, USERS.valid.password);
    expect(res.ok()).toBeTruthy();

    const body = await res.json();
    const { valid, errors } = validate('auth', body);
    expect(valid, JSON.stringify(errors)).toBe(true);
    expect(body.token.length).toBeGreaterThan(0);
  });

  test('Wrong password returns no token @auth @negative', async ({ request }) => {
    const res = await login(request, USERS.valid.username, 'definitely-wrong');
    const body = await safeJson(res);
    expect(body && body.token).toBeFalsy();
  });

  test('Missing password returns no token @auth @negative', async ({ request }) => {
    const res = await request.post(endpoints.login, { data: { username: USERS.valid.username } });
    const body = await safeJson(res);
    expect(body && body.token).toBeFalsy();
  });

  test('A valid token round-trips as a Bearer header on a cart request @auth @positive', async ({ request }) => {
    const loginRes = await login(request, USERS.valid.username, USERS.valid.password);
    const { token } = await loginRes.json();

    const res = await request.get(endpoints.carts, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // FakeStoreAPI doesn't gate cart reads behind auth, but this proves the token
    // is issued and an authenticated request still succeeds.
    expect(res.ok()).toBeTruthy();
  });
});
