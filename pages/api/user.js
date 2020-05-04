import { getCustomerBySession } from '../../lib/api/bigcommerce/customers'
import { setLoginCookie, getLoginSession } from '../../lib/api/auth/cookies'
import isAllowedMethod from '../../lib/api/is-allowed-method'

const METHODS = ['GET']

export default async function user(req, res) {
  if (!isAllowedMethod(req, res, METHODS)) return

  const session = await getLoginSession(req)
  const customer = session && (await getCustomerBySession(session))

  res.status(200).json({
    // Filter private customer data
    customer: customer
      ? {
          id: customer.id,
          email: customer.email,
          firstName: customer.first_name,
          lastName: customer.last_name,
        }
      : null,
  })
}
