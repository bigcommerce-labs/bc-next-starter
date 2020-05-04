import fetchApi, { getErrorText } from './fetch-api'

const parseProduct = (product) => ({
  quantity: product.quantity,
  product_id: product.productId,
  variant_id: product.variantId,
})

export function getCart(cartId) {
  return fetchApi(`/v3/carts/${cartId}`)
}

export function createCartWithProduct(product) {
  return fetchApi('/v3/carts', {
    method: 'POST',
    body: JSON.stringify({
      line_items: [parseProduct(product)],
    }),
  })
}

export function addProductToCart(cartId, product) {
  return fetchApi(`/v3/carts/${cartId}/items`, {
    method: 'POST',
    body: JSON.stringify({
      line_items: [parseProduct(product)],
    }),
  })
}

export function removeProductFromCart(cartId, itemId) {
  return fetchApi(`/v3/carts/${cartId}/items/${itemId}`, {
    method: 'DELETE',
  })
}
