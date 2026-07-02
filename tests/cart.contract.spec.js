// Contract test — snapshot the response *shape* and assert future responses conform.
// We compare keys + value types (not values) against the committed schemas/cart.shape.json.
// Regenerate the snapshot from the live API with `npm run snapshot:cart`.

const { test, expect } = require('@playwright/test');
const { endpoints } = require('../utils/api');
const { shapeOf } = require('../utils/shape');
const { EXISTING_CART_ID } = require('../utils/testData');
const expectedShape = require('../schemas/cart.shape.json');

test.describe('Cart contract — response shape', () => {
  test('GET /carts/:id conforms to the committed shape snapshot @contract', async ({ request }) => {
    const res = await request.get(endpoints.cart(EXISTING_CART_ID));
    expect(res.ok()).toBeTruthy();

    const body = await res.json();
    // Structural drift (added/removed/renamed keys, changed types) fails here;
    // routine data changes do not. __v is intentionally excluded (see utils/shape.js).
    expect(shapeOf(body)).toEqual(expectedShape);
  });
});
