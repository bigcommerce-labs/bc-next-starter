import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Container from '../../components/container'
import Header from '../../components/header'
import SectionSeparator from '../../components/section-separator'
import Layout from '../../components/layout'
import ProductGrid from '../../components/bigcommerce/product-grid'
import ProductPrices from '../../components/bigcommerce/product-prices'
import ProductDescription from '../../components/bigcommerce/product-description'
import AddToCartButton from '../../components/bigcommerce/add-to-cart-button'
import {
  getAllProductsWithSlug,
  getProduct,
  getRelatedProducts,
} from '../../lib/bigcommerce-graphql-api'
import { getPages } from '../../lib/api/bigcommerce/content'
import Head from 'next/head'

export default function Product({ allPages, product, relatedProducts }) {
  const router = useRouter()

  const handleThumbnailImageClick = (e) => {
    document.getElementById('mainGalleryImage').src = e.target.getAttribute(
      'data-image-gallery-new-image-url'
    )
  }

  if (!router.isFallback && !product?.path) {
    return <ErrorPage statusCode={404} />
  }
  return (
    <Layout>
      <Container>
        {router.isFallback ? (
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-64 w-64 mx-auto mt-20"></div>
        ) : (
          <>
            <Header pages={allPages} />
            <article>
              <Head>
                <title>
                  {product.name} | Next.js Storefront Example with BigCommerce
                </title>
                <meta
                  property="og:image"
                  content={product.images.edges[0].url640wide}
                />
              </Head>
              <section className="font-sans flex flex-col lg:flex-row">
                <div className="flex flex-col w-full lg:w-1/2">
                  <div className="flex-grow">
                    <img
                      alt=""
                      src={product.images.edges[0].node.url1280wide}
                      id="mainGalleryImage"
                    />
                  </div>
                  <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-5 mb-5">
                    {product.images.edges.map((image, idx) => (
                      <img
                        key={idx}
                        alt=""
                        className="border border-gray-300 hover:border-gray-800 cursor-pointer"
                        src={image.node.url640wide}
                        data-image-gallery-new-image-url={
                          image.node.url1280wide
                        }
                        onClick={handleThumbnailImageClick}
                      />
                    ))}
                  </div>
                </div>
                <div className="w-full lg:w-1/2 flex flex-col p-8">
                  <h1 className="tracking-wide font-large text-2xl font-bold text-gray-800">
                    {product.name}
                  </h1>
                  <p className="uppercase tracking-wide text-sm font-bold text-gray-700">
                    {product.brand?.name}
                  </p>
                  <p className="text-3xl text-gray-900">
                    <ProductPrices product={product} />
                  </p>

                  <AddToCartButton
                    showOptions={true}
                    product={product}
                    productId={product.entityId}
                    variantId={product.variants.edges[0].entityId}
                  >
                    Add to Cart
                  </AddToCartButton>
                </div>
              </section>

              <SectionSeparator />

              <ProductDescription product={product} />

              <SectionSeparator />
            </article>

            <div className="mb-24">
              <p className="uppercase tracking-wide font-bold text-xl mb-8">
                Related Products
              </p>
              {relatedProducts.length > 0 && (
                <ProductGrid products={relatedProducts} />
              )}
            </div>
          </>
        )}
      </Container>
    </Layout>
  )
}

export async function getStaticProps({ params }) {
  const path = `/${params.slug}/`
  const productData = await getProduct(path)
  const relatedProductsData = await getRelatedProducts(path)
  const content = productData?.site?.route?.node?.description || ''
  const allPages = await getPages()

  return {
    props: {
      allPages,
      product: {
        ...productData?.site?.route?.node,
        content,
      },
      relatedProducts: relatedProductsData?.site?.products?.edges,
    },
  }
}

export async function getStaticPaths() {
  const allProducts = await getAllProductsWithSlug()

  return {
    paths: allProducts?.map((product) => product.node.path) || [],
    fallback: true,
  }
}
