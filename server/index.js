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

const authorRouter = require('./controllers/authorController')
const bookRouter = require('./controllers/bookController')
const categoryCRouter = require('./controllers/categoryController')
const locationRouter = require('./controllers/locationController')
const publisherRouter = require('./controllers/publisherController')
const readingRouter = require('./controllers/readingController')
const userRouter = require('./controllers/userController')

app.use(cors())
app.use(bodyparser.json())
app.use(tokenExtractor)
app.use(userExtractor)

app.use('/api/authors', authorRouter)
app.use('/api/books', bookRouter)
app.use('/api/categories', categoryCRouter)
app.use('/api/locations', locationRouter)
app.use('/api/publishers', publisherRouter)
app.use('/api/readings', readingRouter)
app.use('/api/users', userRouter)

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