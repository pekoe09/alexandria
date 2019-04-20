const http = require('http')
const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const cors = require('cors')
const path = require('path')
const config = require('./config')
const mongo = require('./mongo')

const { tokenExtractor } = require('./utils/tokenExtractor')
const { userExtractor } = require('./utils/userExtractor')

//const countryRouter = require('./controllers/countryController')

app.use(cors())
app.use(bodyparser.json())
app.use(tokenExtractor)
app.use(userExtractor)

//app.use('/api/countries', countryRouter)

app.use(express.static(path.resolve(__dirname, '../alexandria/build')))

app.get('*', (req, res) => {
  console.log('unspecified request', req.url)
  res.sendFile(path.resolve(__dirname, '../alexandria/build', 'index.html'))
})

app.use((err, req, res, next) => {
  console.log(err.message)
  if (err.isBadRequest) {
    res.status(400).json({ error: err.message })
  } else if (err.isUnauthorizedAttempt) {
    res.status(401).json({ error: err.message })
  } else if (err.isForbidden) {
    res.status(403).json({ error: err.message })
  } else {
    res.status(500).json({ error: 'Something has gone wrong' })
  }
})

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
  console.log('Shutting down server')
  mongo.close()
})

module.exports = {
  app,
  server
}