import CurrencyFormatter from './currency-formatter';

export default function ProductPrices({
  product,
}) {
  let prices; 

  if (product.prices.salePrice !== null) {
    prices =  (
      <span>
        <CurrencyFormatter
          currency={product.prices.salePrice.currencyCode}
          amount={product.prices.salePrice.value}
        />
      </span>
    )
  } else {
    prices = (
      <span>
        <CurrencyFormatter
          currency={product.prices.price.currencyCode}
          amount={product.prices.price.value}
        />
      </span>
    )
  }

  return prices
}
