import Iron from '@hapi/iron'

const TOKEN_SECRET = process.env.NEXT_EXAMPLE_BIGCOMMERCE_TOKEN_SECRET

export function encryptSession(session) {
  return Iron.seal(session, TOKEN_SECRET, Iron.defaults)
}

export async function decryptToken(token) {
  return token && Iron.unseal(token, TOKEN_SECRET, Iron.defaults)
}
