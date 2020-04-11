import { serialize, parse } from 'cookie'
import isAllowedMethod from '../../lib/api/is-allowed-method'
import DB from '../../lib/api/db'

const METHODS = ['GET', 'POST']
const SESSION = 'session-id'
const ONE_DAY = 60 * 60 * 24
const MAX_AGE = ONE_DAY * 90

async function getSessionId(req, res) {
  let sessionId = req.cookies[SESSION]

  if (!sessionId) {
    const session = await DB.createSession()

    sessionId = session.id

    const cookie = serialize(SESSION, sessionId, {
      maxAge: MAX_AGE,
      expires: new Date(Date.now() + MAX_AGE * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    })

    res.setHeader('Set-Cookie', cookie)
  }

  return sessionId
}

export default async function cart(req, res) {
  if (!isAllowedMethod(req, res, METHODS)) return

  // Uncomment the following line if you want to test the API with some latency
  // await new Promise(resolve => setTimeout(resolve, 1000))

  const sessionId = await getSessionId(req, res)

  // Return the cart items
  if (req.method === 'GET') {
    const session = await DB.getSession(sessionId)

    if (!session) {
      // If a session doesn't exist in the DB, remove the cookie
      const cookie = serialize(SESSION, '', {
        maxAge: -1,
        path: '/',
      })

      res.setHeader('Set-Cookie', cookie)

      return res.status(400).json({
        errors: [{ message: 'Missing session' }]
      })
    }

    return res.status(200).json(session)
  }

  // Add a new product to the cart
  if (req.method === 'POST') {
    const { product } = req.body

    if (!product) {
      return res.status(400).json({
        errors: [{ message: 'Missing product' }]
      })
    }

    const session = await DB.getSession(sessionId)

    // Validations are ignored here, but never do this for a production environment.
    await DB.updateSession(sessionId, {
      products: [...session.products, product]
    })

    // There's no need to send any additional data here, the UI can use this response to display a
    // "success" for the operation and revalidate the GET request for this same endpoint right after.
    return res.status(200).json({ done: true })
  }

  // Remove a product from the cart
  if (req.method === 'DELETE') {
    const { productId } = req.body

    if (!productId) {
      return res.status(400).json({
        errors: [{ message: 'Missing productId' }]
      })
    }

    const session = await DB.getSession(sessionId)

    let found = false

    await DB.updateSession(sessionId, {
      products: session.products.filter(p => {
        // Only remove the first match
        if (!found && p.id === productId) {
          found = true
          return false
        }
        return true
      })
    })

    // There's no need to send any additional data here, the UI can use this response to display a
    // "success" for the operation and revalidate the GET request for this same endpoint right after.
    return res.status(200).json({ done: true })
  }
}