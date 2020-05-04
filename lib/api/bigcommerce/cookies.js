import { serialize } from 'cookie'
import parseCookies from '../parse-cookies'

const CART_COOKIE = 'cartId'
const ONE_DAY = 60 * 60 * 24
const MAX_AGE = ONE_DAY * 30

export function getCartCookie(req) {
  const cookies = parseCookies(req)
  return cookies[CART_COOKIE]
}

export async function setCartCookie(res, cartId) {
  const options = cartId
    ? {
        maxAge: MAX_AGE,
        expires: new Date(Date.now() + MAX_AGE * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
      }
    : { maxAge: -1, path: '/' } // Removes the cookie
  const cookie = serialize(CART_COOKIE, cartId || '', options)

  res.setHeader('Set-Cookie', cookie)
}
