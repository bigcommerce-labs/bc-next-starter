import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Container from '../components/container'
import Header from '../components/header'
import SectionSeparator from '../components/section-separator'
import Layout from '../components/layout'
import PageContent from '../components/bigcommerce/page-content'
import { getPages, getPageByURL } from '../lib/api/bigcommerce/content'
import Head from 'next/head'

export default function Page({ allPages, page }) {
  const router = useRouter()

  if (!router.isFallback && !page?.url) {
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
                  {page.name} | Next.js Storefront Example with BigCommerce
                </title>
              </Head>
              <h1 className="tracking-wide font-large text-2xl font-bold text-gray-800 w-full text-center mt-10">
                {page.name}
              </h1>

              <SectionSeparator />

              <PageContent page={page} />

              <SectionSeparator />
            </article>
          </>
        )}
      </Container>
    </Layout>
  )
}

export async function getStaticProps({ params }) {
  const path = `/${params.slug}/`
  const allPages = await getPages()
  const thisPage = await getPageByURL(path)

  return {
    props: {
      allPages,
      page: thisPage,
    },
  }
}

export async function getStaticPaths() {
  const allPages = await getPages()
  const onlyPageTypePages = allPages.filter((page) => page.type === 'page')

  return {
    paths: onlyPageTypePages?.map((page) => page.url) || [],
    fallback: true,
  }
}
