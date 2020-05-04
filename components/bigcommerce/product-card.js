import { useMemo } from 'react'
import Link from 'next/link'
import { useCart } from '../../lib/cart'
import AddToCartButton from './add-to-cart-button'
import ProductPrices from './product-prices'

export default function ProductCard({ product }) {
  const { data, error } = useCart()
  const products = data?.cart.line_items.physical_items || []
  const item = useMemo(
    () => products.find((p) => p.product_id === product.entityId),
    [products, product.entityId]
  )
  const count = item?.quantity ?? 0

  if (error) {
    // Currently the error is not being handled, so log it
    console.error('Fetch for cart failed with:', error)
  }

  return (
    <div className="bc-product-card">
      <Link href={`/products${product.path}`}>
        <img
          className="object-fit cursor-pointer"
          src={
            (product.images &&
              product.images.edges.length &&
              product.images.edges[0]?.node?.url640wide) ||
            'http://placeimg.com/640/480/tech/grayscale'
          }
          alt={product.name}
        />
      </Link>

      <div className="grid gap-5 grid-cols-1">
        <h3 className="h-16 font-medium cursor-pointer">
          <Link href={`/products${product.path}`}>
            <span>{product.name}</span>
          </Link>
        </h3>

        <ProductPrices product={product} />

        <AddToCartButton
          product={product}
          productId={product.entityId}
          variantId={product.variants.edges[0].node?.entityId}
          itemId={item?.id}
        >
          Add to Cart {count ? `(${count})` : null}
        </AddToCartButton>
      </div>
    </div>
  )
}
