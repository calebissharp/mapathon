const express = require('express')
const logger = require('morgan')
const helmet = require('helmet')
const lusca = require('lusca')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

const ONE_DAY = 24 * (60 * 60 * 1000)
const TWO_WEEKS = 14 * ONE_DAY

const app = express()
app.use(logger('dev'))
app.use(bodyParser.json({ limit: '50mb', extended: true }))
app.use(bodyParser.urlencoded({ extended: false }))

// Helmet
app.use(helmet.frameguard())
app.use(helmet.xssFilter())
app.use(helmet.noSniff())
app.use(helmet.ieNoOpen())
app.use(helmet.referrerPolicy({ policy: 'same-origin' }))
app.use(
  helmet.hsts({
    maxAge: TWO_WEEKS,
    includeSubDomains: true,
    force: true
  })
)

// lusca
app.use(lusca.p3p('ABCDEF'))

// At a minimum, disable X-Powered-By header
app.disable('x-powered-by')

app.set('trust proxy', 1) // trust first proxy

app.use(cors())

app.post('/photo', async (req, res) => {
  try {
    if (!req.body.photo) {
      throw new Error(`Base-64 encoded image 'photo' is not included!`)
    }

    console.log('Got a photo!')

    res.status(200).json({ success: true })
  } catch (error) {
    res.status(400).json({ error: error.message || error })
  }
})

app.get('/photo-sw.js', (req, res) =>
  res.sendFile(path.resolve(__dirname, '..', 'photo-sw.js'))
)

// serve built content
const buildPath = path.resolve(__dirname, '..', '..', 'build')
app.use(express.static(buildPath))

module.exports = app
