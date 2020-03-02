const express = require('express')
const logger = require('morgan')
const helmet = require('helmet')
const lusca = require('lusca')
const bodyParser = require('body-parser')
const cors = require('cors')
const multer = require('multer')
const upload = multer()

const ONE_DAY = 24 * (60 * 60 * 1000)
const TWO_WEEKS = 14 * ONE_DAY

const app = express()
app.use(logger('dev'))
app.use(bodyParser.json())
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

app.post('/photo', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error(`File 'photo' is not included!`)
    }

    console.log('Got a photo!')

    res.send(200)
  } catch (error) {
    res.status(400).json({ error: error.message || error })
  }
})

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

module.exports = app
