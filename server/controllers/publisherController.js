const { wrapAsync, checkUser, validateMandatoryFields } = require('./controllerHelpers')
const publisherRouter = require('express').Router()
const Publisher = require('../models/publisher')
const Book = require('../models/book')

publisherRouter.get('/', wrapAsync(async (req, res, next) => {
  const publishers = await Publisher
    .find({})
    .sort('name')
  res.json(publishers)
}))

publisherRouter.post('/', wrapAsync(async (req, res, next) => {
  checkUser(req)
  validateMandatoryFields(req, ['name'], 'publisher', 'create')

  let nameMatch = await Publisher.findOne({ name: req.body.name })
  if (nameMatch) {
    let err = new Error('Another publisher has the same name')
    err.isBadRequest = true
    throw err
  }

  let publisher = new Publisher({
    name: req.body.name,
    city: req.body.city,
    country: req.body.country
  })
  publisher = await publisher.save()

  res.status(201).json(publisher)
}))

publisherRouter.put('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)
  validateMandatoryFields(req, ['name'], 'publisher', 'create')

  let publisher = await Publisher.findById(req.params.id)
  if (!publisher) {
    let err = new Error('Publisher not found')
    err.isBadRequest = true
    throw err
  }

  let nameMatch = await Publisher.findOne({ name: req.body.name })
  if (nameMatch && !nameMatch._id.equals(publisher._id)) {
    let err = new Error('Another publisher has the same name')
    err.isBadRequest = true
    throw err
  }

  publisher.name = req.body.name
  publisher.city = req.body.city
  publisher.country = req.body.country
  publisher = await Publisher.findByIdAndUpdate(publisher._id, publisher, { new: true })
  res.status(201).json(publisher)
}))

publisherRouter.delete('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)

  let publisher = await Publisher.findById(req.params.id)
  if (!publisher) {
    let err = new Error('Publisher not found')
    err.isBadRequest = true
    throw err
  }

  let foundBooks = await Book.find({ publisher: { _id: publisher._id } })
  if (foundBooks && foundBooks.length > 0) {
    res.status(403).json({
      error: 'Publisher cannot be deleted as it is still used by some books.',
      books: foundBooks
    })
  } else {
    await Publisher.findByIdAndRemove(publisher._id)
    res.status(204).end()
  }
}))

module.exports = publisherRouter