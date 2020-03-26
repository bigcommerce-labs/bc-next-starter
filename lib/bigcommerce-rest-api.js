import 'isomorphic-unfetch'
import Handlebars from 'handlebars'
import ifHelper from './if-helper'
import unlessHelper from './unless-helper'
import jsonHelper from './json-helper'

const API_URL = process.env.NEXT_EXAMPLE_BIGCOMMERCE_STORE_API_URL
const API_CLIENT = process.env.NEXT_EXAMPLE_BIGCOMMERCE_STORE_API_CLIENT_ID
const API_TOKEN = process.env.NEXT_EXAMPLE_BIGCOMMERCE_STORE_API_TOKEN
const API_SECRET = process.env.NEXT_EXAMPLE_BIGCOMMERCE_STORE_API_SECRET

async function fetchAPI(endpoint) {
  const res = await fetch(API_URL + endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': API_TOKEN,
      'X-Auth-Client': API_CLIENT,
    },
  })

  const json = await res.json()
  if (json.errors) {
    console.error(json.errors)
    throw new Error('Failed to fetch API')
  }
  return json
}

export async function getHomepageContent() {
  const data = await fetchAPI('/v3/content/placements?template_file=pages/home')

  return data?.data
}

export async function getPages() {
  const data = await fetchAPI('/v2/pages.json')

  return data
}

export async function getPageByURL(url) {
  const data = await fetchAPI('/v2/pages.json')

  return data?.filter(page => page.url === url)[0] || [];
}

export async function getRenderedHomepageContent() {
  Handlebars.registerHelper('if', ifHelper)
  Handlebars.registerHelper('unless', unlessHelper)
  Handlebars.registerHelper('json', jsonHelper)

  const response = await fetchAPI('/v3/content/placements?template_file=pages/home')

  let output = ''
  response.data.forEach((entry) => {
    const template = Handlebars.compile(entry.widget.widget_template.template);
    const result = template(entry.widget.widget_configuration)
    output += result
  })

  return output
}
