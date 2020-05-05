import Container from '../components/container'
import Layout from '../components/layout'
import Header from '../components/header'
import ProductGrid from '../components/bigcommerce/product-grid'
import WidgetScriptForceReloader from '../components/bigcommerce/widget-script-force-reloader'
import { getAllProductsForHome } from '../lib/bigcommerce-graphql-api'
import {
  getPages,
  getRenderedHomepageContent,
} from '../lib/api/bigcommerce/content'
import Head from 'next/head'

export default function Index({ allPages, allProducts, homepageContent }) {
  return (
    <>
      <Layout>
        <Head>
          <title>Next.js Store Example with BigCommerce</title>
        </Head>
        <Container>
          <Header pages={allPages} />
        </Container>
        {homepageContent && (
          <div
            className="bc-widget-container"
            dangerouslySetInnerHTML={{ __html: homepageContent }}
          />
        )}
        <WidgetScriptForceReloader />

        <Container>
          {allProducts.length > 0 && (
            <div className="mb-24">
              <ProductGrid products={allProducts} />
            </div>
          )}
        </Container>
      </Layout>
    </>
  )
}

export async function getStaticProps({ preview }) {
  const allPages = (await getPages()) || []
  const allProducts = (await getAllProductsForHome()) || []
  const homepageContent = (await getRenderedHomepageContent()) || []

  return {
    props: { allPages, allProducts, homepageContent },
  }
}
