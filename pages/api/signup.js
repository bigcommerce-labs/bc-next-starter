import { createCustomer } from '../../lib/api/bigcommerce/customers'
import { setLoginCookie } from '../../lib/api/auth/cookies'
import isAllowedMethod from '../../lib/api/is-allowed-method'

const METHODS = ['POST']

export default async function signup(req, res) {
  if (!isAllowedMethod(req, res, METHODS)) return

  const { email, firstName, lastName, password } = req.body

  // Weak validations, for a production application make sure to be more strict here
  if (!email || !firstName || !lastName || !password) {
    return res.status(400).json({
      errors: [{ message: 'Invalid signup' }],
    })
  }

  const data = { email, firstName, lastName, password }
  const customer = await createCustomer(data)

  await setLoginCookie(res, { id: customer.id })

  return res.status(200).json({ done: true })
}
