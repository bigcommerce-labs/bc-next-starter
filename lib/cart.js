import { useState, useCallback } from 'react'
import useSWR, { mutate } from 'swr'

async function getError(res) {
  if (res.headers.get('Content-Type').includes('application/json')) {
    const data = await res.json()
    return data.errors[0]
  }
  return { message: (await res.text()) || res.statusText }
}

async function fetcher(url) {
  const res = await fetch(url)

  if (res.status === 200) {
    return res.json()
  }
  throw await getError(res)
}

export function useCart() {
  return useSWR('/api/cart', fetcher)
}

export function useAddToCart(product) {
  const [{ addingToCart, error }, setStatus] = useState({ addingToCart: false })
  const addToCart = useCallback(async () => {
    setStatus({ addingToCart: true })

    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        product: {
          id: product.entityId,
          name: product.name
        }
      })
    })

    // Product added as expected
    if (res.status === 200) {
      setStatus({ addingToCart: false })
      return mutate('/api/cart')
    }

    const error = await getError(res)

    console.error('Adding product to card failed with:', res.status, error)
    setStatus({ addingToCart: false, error })
  }, [product])

  return { addToCart, addingToCart, error }
}