import {
  getCustomerByEmail,
  validatePassword,
} from '../../lib/api/bigcommerce/customers'
import { setLoginCookie } from '../../lib/api/auth/cookies'
import isAllowedMethod from '../../lib/api/is-allowed-method'

const METHODS = ['POST']

export default async function login(req, res) {
  if (!isAllowedMethod(req, res, METHODS)) return

  const { email, password } = req.body

  // Weak validations, for a production application make sure to be more strict here
  if (!email || !password) {
    return res.status(400).json({
      errors: [{ message: 'Invalid login' }],
    })
  }

  const customer = await getCustomerByEmail(email)

  if (!customer) {
    return res.status(404).json({
      errors: [{ message: 'Email not found' }],
    })
  }

  const hasValidPassword = await validatePassword(customer.id, password)

  if (!hasValidPassword) {
    return res.status(400).json({
      errors: [{ message: 'Invalid password' }],
    })
  }

  await setLoginCookie(res, { id: customer.id })

  return res.status(200).json({ done: true })
}
