import fetchApi from './fetch-api'

const parseCustomer = (customer) => ({
  email: customer.email,
  first_name: customer.firstName,
  last_name: customer.lastName,
  authentication: {
    new_password: customer.password,
  },
})

export async function getCustomerByEmail(email) {
  const res = await fetchApi(`/v3/customers?email:in=${email}`)
  const json = await res.json()

  return json.data[0]
}

export async function createCustomer(customer) {
  const res = await fetchApi('/v3/customers', {
    method: 'POST',
    body: JSON.stringify([parseCustomer(customer)]),
  })
  const json = await res.json()

  return json.data[0]
}

export async function validatePassword(customerId, password) {
  const res = await fetchApi(`/v2/customers/${customerId}/validate`, {
    method: 'POST',
    body: JSON.stringify({ password }),
  })
  const data = await res.json()

  return data.success
}
