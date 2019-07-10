const {
  wrapAsync,
  checkUser,
  validateMandatoryFields
} = require('./controllerHelpers')
const readingRouter = require('express').Router()
const Reading = require('../models/reading')
const Book = require('../models/book')

readingRouter.get('/', wrapAsync(async (req, res, next) => {
  const readings = await Reading
    .find({})
    .sort('date')
    .populate('book')
  res.json(readings)
}))

readingRouter.post('/', wrapAsync(async (req, res, next) => {
  checkUser(req)
  validateMandatoryFields(req, ['book', 'date'], 'reading', 'create')
  const book = await validateBookRef(req)
  validatePageCounts(req)
  validateMinuteCount(req)

  let reading = new Reading({
    date: req.body.date,
    book: book._id,
    startPage: req.body.startPage,
    endPage: req.body.endPage,
    readPages: req.body.readPages,
    minutes: req.body.minutes
  })
  reading = await reading.save()
  reading = await Reading.findById(reading._id).populate('book')
  res.status(201).json(reading)
}))

readingRouter.put('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)
  validateMandatoryFields(req, ['date', 'book'], 'reading', 'update')
  let reading = await validateEntityRef(req)
  const book = await validateBookRef(req)
  validatePageCounts(req)
  validateMinuteCount(req)

  reading.date = req.body.date
  reading.book = book._id
  reading.startPage = req.body.startPage
  reading.endPage = req.body.endPage
  reading.readPages = req.body.readPages

  await Reading.findByIdAndUpdate(reading._id, reading)
  reading = await Reading.findById(reading._id).populate('book')
  res.status(201).json(reading)
}))

readingRouter.delete('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)
  let reading = await validateEntityRef(req)
  await Reading.findByIdAndRemove(reading._id)
  res.status(204).end()
}))

validateEntityRef = async (req) => {
  let reading = await Reading.findById(req.params.id)
  if (!reading) {
    let err = new Error('Reading not found')
    err.isBadRequest = true
    throw err
  }
  return reading
}

validateBookRef = async (req) => {
  const book = await Book.findById(req.body.book)
  if (!book) {
    let err = new Error(`Book is not valid (${req.body.book})`)
    err.isBadRequest = true
    throw err
  }
  return book
}

validatePageCounts = (req) => {
  if (req.body.startPage < 0 || req.body.endPage < 0 || req.body.readPages < 0) {
    let err = new Error(
      `Page counts must be positive (start: ${req.body.startPage}), end: ${req.body.endPage}, read: ${req.body.readPages}`)
    err.isBadRequest = true
    throw err
  }
}

validateMinuteCount = (req) => {
  if (req.body.minutes < 0) {
    let err = new Error(`Minute count must be positive (${req.body.minutes})`)
    err.isBadRequest = true
    throw err
  }
}

module.exports = readingRouter