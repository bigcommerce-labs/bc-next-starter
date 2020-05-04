import Handlebars from 'handlebars'
import ifHelper from '../../if-helper'
import unlessHelper from '../../unless-helper'
import jsonHelper from '../../json-helper'
import fetchApi, { getErrorText, BigComerceError } from './fetch-api'

export async function getHomepageContent() {
  const res = await fetchApi('/v3/content/placements?template_file=pages/home')
  const json = await res.json()

  return json?.data
}

export async function getPages() {
  const res = await fetchApi('/v2/pages.json')
  return res.json()
}

export async function getPageByURL(url) {
  const res = await fetchApi('/v2/pages.json')
  const data = await res.json()

  return data?.filter((page) => page.url === url)[0] || []
}

export async function getRenderedHomepageContent() {
  Handlebars.registerHelper('if', ifHelper)
  Handlebars.registerHelper('unless', unlessHelper)
  Handlebars.registerHelper('json', jsonHelper)

  const res = await fetchApi('/v3/content/placements?template_file=pages/home')
  const json = await res.json()

  let output = ''
  json.data.forEach((entry) => {
    const template = Handlebars.compile(entry.widget.widget_template.template)
    const result = template(entry.widget.widget_configuration)
    output += result
  })

  return output
}
