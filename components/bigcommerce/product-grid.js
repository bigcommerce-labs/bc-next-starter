import ProductCard from './product-card';

export default function ProductGrid({
  products,
}) {
  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-5 mb-5">
       {products.map((product, idx) => (
          <ProductCard
            key={idx}
            product={product.node}
          />
      ))}
    </div>
  )
}
