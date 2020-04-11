import { useMemo } from 'react'
import Link from 'next/link'
import { useCart } from '../../lib/cart';
import AddToCartButton from './add-to-cart-button';
import ProductPrices from './product-prices';

export default function ProductCard({
  product,
}) {
  const { data, error } = useCart()
  const products = data?.products || []
  const count = useMemo(
    () => products.filter(p => p.id === product.entityId).length,
    [products, product.entityId]
  )

  if (error) {
    // Currently the error is not being handled, so log it
    // NOTE: if you see an error here a lot, it's because after making a file change
    // the session DB resets, so the `session-id` cookie will no longer have a match
    console.error('Fetch for cart failed with:', error)
  }

  return (
    <div className="bc-product-card">
      <Link href={`/products${product.path}`}>
          <img
            className="object-fit cursor-pointer"
            src={
              (product.images && product.images.edges.length && product.images.edges[0]?.node?.url640wide) ||
              'http://placeimg.com/640/480/tech/grayscale'
            }
            alt={product.name}
          />
      </Link>

      <div className="grid gap-5 grid-cols-1">
        <h3 className="h-16 font-medium cursor-pointer">
          <Link href={`/products${product.path}`}><span>{product.name}</span></Link>
        </h3>

        <ProductPrices product={product} />

        <AddToCartButton
          product={product}
          productId={product.entityId}
          variantId={product.variants.edges[0].entityId}>
          Add to Cart {count ? `(${count})` : null}
        </AddToCartButton>
      </div>
    </div>
  )
}
