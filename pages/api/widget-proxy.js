// Not used right now, but could be helpful to load widget assets from BigCommerce 
// without the chance of being blocked by the browser

export default async (req, res) => {
  const { asset } = req.query
  
  await fetch(`https://microapps.bigcommerce.com/${asset}`)
  .then((response) => {
    if (!response.ok) {
      res.statusCode = 500
      res.end('Network request failed.')
    }
    return response.text()
  })
  .then((text) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(text)
  }).catch((error) => {
    res.statusCode = 500
    res.end(`Issue fetching script: ${error}`)
  })
}
