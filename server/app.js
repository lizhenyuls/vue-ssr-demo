const express = require('express')
const fs = require('fs')
const path = require('path')
const { createBundleRenderer } = require('vue-server-renderer')
const { minify } = require('html-minifier')
const app = express()
const resolve = file => path.resolve(__dirname, file)
const handleError = (err, req, res) => {
  if (err.url) {
    res.redirect(err.url)
  } else if (err.code === 404) {
    res.status(404).send('404 | Page Not Found')
  } else {
    res.status(500).send('500 | Internal Server Error')
    console.error(`error during render : ${req.url}`)
    console.error(err.stack)
  }
}
const renderer = createBundleRenderer(require('../dist/vue-ssr-server-bundle.json'), {
  runInNewContext: false,
  template: fs.readFileSync(resolve('./index.template.html'), 'utf-8'),
  clientManifest: require('../dist/vue-ssr-client-manifest.json')
})
app.disable('x-powered-by')
app.use('/static', express.static(path.join(__dirname, '../dist/static')))
app.use('/favicon.ico', express.static(path.join(__dirname, '../dist/favicon.ico')))

// ssr异步数据测试
app.get('/test', (req, res) => {
  res.send({
    code: 200,
    msg: 'vue ssr渲染成功'
  })
})

app.get('*', (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  const context = {
    url: req.url,
    serverError: false,
    title: 'vue-ssr-demo'
  }
  renderer.renderToString(context, (err, html) => {
    if (err) {
      return handleError(err, req, res)
    }
    res.send(minify(html, { collapseWhitespace: true, minifyCSS: true }))
  })
})

module.exports = app
