import fetchApi, { getErrorText, BigComerceError } from './fetch-api'

const parseProduct = (product) => ({
  quantity: product.quantity,
  product_id: product.productId,
  variant_id: product.variantId,
})

export async function getCart(cartId) {
  try {
    const res = await fetchApi(`/v3/carts/${cartId}`)
    return res.json()
  } catch (error) {
    if (error instanceof BigComerceError && error.status === 404) {
      return { data: null }
    }
    throw error
  }
}

export async function createCartWithProduct(product) {
  const res = await fetchApi('/v3/carts', {
    method: 'POST',
    body: JSON.stringify({
      line_items: [parseProduct(product)],
    }),
  })
  return res.json()
}

export async function addProductToCart(cartId, product) {
  const res = await fetchApi(`/v3/carts/${cartId}/items`, {
    method: 'POST',
    body: JSON.stringify({
      line_items: [parseProduct(product)],
    }),
  })
  return res.json()
}

export async function updateProductInCart(cartId, itemId, product) {
  const res = await fetchApi(`/v3/carts/${cartId}/items/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify({
      line_item: parseProduct(product),
    }),
  })
  return res.json()
}

export async function removeProductFromCart(cartId, itemId) {
  const res = await fetchApi(`/v3/carts/${cartId}/items/${itemId}`, {
    method: 'DELETE',
  })
  return null
}
