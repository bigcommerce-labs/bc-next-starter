import {
  getCustomerByEmail,
  validatePassword,
} from '../../lib/api/bigcommerce/customers'
import { removeLoginCookie } from '../../lib/api/auth/cookies'
import isAllowedMethod from '../../lib/api/is-allowed-method'

const METHODS = ['GET']

export default async function logout(req, res) {
  if (!isAllowedMethod(req, res, METHODS)) return

  await removeLoginCookie(res)

  res.writeHead(302, { Location: '/' })
  res.end()
}
