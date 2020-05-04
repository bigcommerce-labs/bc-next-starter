import { useState, useCallback } from 'react'
import useSWR, { mutate } from 'swr'

async function getText(res) {
  try {
    return (await res.text()) || res.statusText
  } catch (error) {
    return res.statusText
  }
}

async function getError(res) {
  if (res.headers.get('Content-Type')?.includes('application/json')) {
    const data = await res.json()
    return data.errors[0]
  }
  return { message: await getText(res) }
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

export function useAddToCart() {
  const [{ addingToCart, error }, setStatus] = useState({ addingToCart: false })
  const addToCart = useCallback(async ({ product }) => {
    setStatus({ addingToCart: true })

    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ product }),
    })

    // Product added as expected
    if (res.status === 200) {
      setStatus({ addingToCart: false })
      return mutate('/api/cart')
    }

    const error = await getError(res)

    console.error('Adding product to card failed with:', res.status, error)
    setStatus({ addingToCart: false, error })
  }, [])

  return { addToCart, addingToCart, error }
}

export function useRemoveFromCart() {
  const [{ removingFromCart, error }, setStatus] = useState({
    removingFromCart: false,
  })
  const removeFromCart = useCallback(async ({ item }) => {
    setStatus({ removingFromCart: true })

    const res = await fetch(`/api/cart?itemId=${item.id}`, {
      method: 'DELETE',
    })

    // Product removed as expected
    if (res.status === 200) {
      setStatus({ removingFromCart: false })
      return mutate('/api/cart')
    }

    const error = await getError(res)

    console.error('Removing product from card failed with:', res.status, error)
    setStatus({ removingFromCart: false, error })
  }, [])

  return { removeFromCart, removingFromCart, error }
}
