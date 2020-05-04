import fetchApi from './fetch-api'

const parseCustomer = (customer) => ({
  email: customer.email,
  first_name: customer.firstName,
  last_name: customer.lastName,
  authentication: {
    new_password: customer.password,
  },
})

export async function createCustomer(customer) {
  const res = await fetchApi('/v3/customers', {
    method: 'POST',
    body: JSON.stringify([parseCustomer(customer)]),
  })
  return res.json()
}
