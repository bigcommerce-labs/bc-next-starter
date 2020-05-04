import fetch, { Response, RequestInit } from 'node-fetch'

export class BigComerceError extends Error {
  status?: number

  constructor(msg: string, res?: Response) {
    super(msg)
    this.name = 'BigCommerceAPIError'

    if (res) {
      this.status = res.status
    }
  }
}

export default async function fetchApi(
  endpoint: string,
  options: RequestInit = {}
) {
  let res: Response

  try {
    res = await fetch(
      process.env.NEXT_EXAMPLE_BIGCOMMERCE_STORE_API_URL + endpoint,
      {
        ...options,
        headers: {
          ...options.headers,
          'Content-Type': 'application/json',
          'X-Auth-Token': process.env.NEXT_EXAMPLE_BIGCOMMERCE_STORE_API_TOKEN,
          'X-Auth-Client':
            process.env.NEXT_EXAMPLE_BIGCOMMERCE_STORE_API_CLIENT_ID,
        },
      }
    )
  } catch (error) {
    throw new BigComerceError(`Fetch to Big Commerce failed: ${error.message}`)
  }

  if (!res.ok) {
    throw new BigComerceError(await getErrorText(res), res)
  }

  return res
}

async function getErrorText(res: Response) {
  return `Big Commerce API error (${res.status}) \n${JSON.stringify(
    getRawHeaders(res)
  )}\n ${await getTextOrNull(res)}`
}

function getRawHeaders(res: Response) {
  const headers = {}

  res.headers.forEach((value, key) => {
    headers[key] = value
  })

  return headers
}

function getTextOrNull(res: Response) {
  try {
    return res.text()
  } catch (err) {
    return null
  }
}
