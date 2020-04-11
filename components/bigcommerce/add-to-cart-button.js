import { useAddToCart } from '../../lib/cart';

export default function AddToCartButton({
  children,
  showOptions,
  product,
  productId,
  variantId,
}) {
  const { addToCart, addingToCart, error } = useAddToCart(product)

  let productOptions
  if (showOptions && product.options && product.options.edges.length) {
    productOptions = product.options.edges.map((option, optionIdx) => (
      <div className="w-full mb-6" key={optionIdx}>
        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor={`bcoption_4${option.node.entityId}`}>
          {option.node.displayName}
        </label>
        <div className="relative">
          <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id={`bcoption_4${option.node.entityId}`}>
            {option.node?.values?.edges?.length && option.node.values.edges.map((value, valueIdx) => (
              <option value={value.node.entityId} key={valueIdx}>{value.node.label}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
        {!option.node.isRequired && (
          <div className="text-xs italic text-gray-500 pt-1">Optional</div>
        )}
      </div>
    ))
  }

  return (
    <div className="bc-product-card">
      <div className="bc-product__actions" data-js="bc-product-group-actions">
        <div className="bc-form bc-product-form">
          <div className="bc-product-form__product-message"></div>

          {productOptions}

          <button
            className="w-full bg-black hover:bg-white hover:text-black border border-black text-white font-bold py-3 px-12 lg:px-8 duration-200 transition-colors mb-6 lg:mb-0"
            type="submit"
            disabled={addingToCart}
            onClick={addToCart}>
            {error ? 'An error ocurred' : addingToCart ? 'Adding to Cart...' : children}
          </button>
        </div>
      </div>
    </div>
  );
}
