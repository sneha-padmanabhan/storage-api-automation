// Endpoints are relative — the base URL comes from playwright.config (use.baseURL),
// overridable with the FAKESTORE_URL env var.

const BASE_URL = process.env.FAKESTORE_URL || 'https://fakestoreapi.com';

const endpoints = {
  carts: '/carts',
  cart: (id) => `/carts/${id}`,
  products: '/products',
  product: (id) => `/products/${id}`,
  login: '/auth/login',
};

// FakeStoreAPI cart payload: { userId, date, products:[{productId, quantity}] }.
function buildCartPayload({ userId = 1, productId = 1, quantity = 1, date = '2024-01-01', products } = {}) {
  return {
    userId,
    date,
    products: products || [{ productId, quantity }],
  };
}

function login(request, username, password) {
  return request.post(endpoints.login, { data: { username, password } });
}

module.exports = { BASE_URL, endpoints, buildCartPayload, login };
