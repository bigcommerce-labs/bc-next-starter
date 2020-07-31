import Head from 'next/head'
import Container from '../../components/container'
import Layout from '../../components/layout'
import Header from '../../components/header'
// import Cart from '../../components/bigcommerce/cart'
import * as cartStyles from "./cart.module.css";
import { Cart } from 'bcsfc'
import { useCart, useUpdateCart } from '../../lib/cart'

const toCamel = (s) => {
  return s.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
};

const isArray = function (a) {
  return Array.isArray(a);
};

const isObject = function (o) {
  return o === Object(o) && !isArray(o) && typeof o !== 'function';
};

const keysToCamel = function (o) {
  if (isObject(o)) {
    const n = {};

    Object.keys(o)
      .forEach((k) => {
        n[toCamel(k)] = keysToCamel(o[k]);
      });

    return n;
  } else if (isArray(o)) {
    return o.map((i) => {
      return keysToCamel(i);
    });
  }

  return o;
};

export default function Index({ allPages, allProducts, homepageContent }) {
  const { data } = useCart()
  const { updateCart, updatingCart, error } = useUpdateCart()
  const cart = keysToCamel(data?.cart) || []

  const onUpdate = (method, itemId, newItem) => {
    updateCart({
      product: { 
        productId: newItem.productId, 
        variantId: newItem.variantId, 
        quantity: newItem.quantity
      }, 
      item: {
        id: itemId
      }
    })
  }

  return (
    <>
      <Layout>
        <Head>
          <title>Next.js Store Example with BigCommerce</title>
        </Head>
        <Container>
          <Header pages={allPages} />
        </Container>
        <Container>
          <Cart.Provider
              onUpdate={onUpdate}
              cart={cart}
              styles={cartStyles}
          />
        </Container>
      </Layout>
    </>
  )
}
