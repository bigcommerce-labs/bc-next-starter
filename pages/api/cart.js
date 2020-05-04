import {
  getCart,
  createCartWithProduct,
  addProductToCart,
} from '../../lib/api/bigcommerce/cart'
import { BigComerceError } from '../../lib/api/bigcommerce/fetch-api'
import { setCartCookie, getCartCookie } from '../../lib/api/bigcommerce/cookies'
import isAllowedMethod from '../../lib/api/is-allowed-method'

const METHODS = ['GET', 'POST']

export default async function cart(req, res) {
  if (!isAllowedMethod(req, res, METHODS)) return

  // Uncomment the following line if you want to test the API with some latency
  // await new Promise(resolve => setTimeout(resolve, 1000))

  const cartId = getCartCookie(req)

  try {
    // Return current cart info
    if (req.method === 'GET') {
      const result = cartId && (await getCart(cartId))

      if (!result) {
        return res.status(404).json({
          errors: [{ message: 'Cart not found' }],
        })
      }

      return res.status(200).json({ cart: result.data })
    }

    // Create or add a product to the cart
    if (req.method === 'POST') {
      const { product } = req.body

      if (!product) {
        return res.status(400).json({
          errors: [{ message: 'Missing product' }],
        })
      }

      const { data } = cartId
        ? await addProductToCart(cartId, product)
        : await createCartWithProduct(product)

      // Create or update the cart cookie
      setCartCookie(res, data.id)

      // There's no need to send any additional data here, the UI can use this response to display a
      // "success" for the operation and revalidate the GET request for this same endpoint right after.
      return res.status(200).json({ done: true })
    }
  } catch (error) {
    console.error(error)

    const message =
      error instanceof BigComerceError
        ? 'Big Commerce API failed'
        : 'An unexpected error ocurred'

    res.status(500).json({
      errors: [{ message }],
    })
  }
}
