const { wrapAsync, checkUser, validateMandatoryFields } = require('./controllerHelpers')
const locationRouter = require('express').Router()
const Location = require('../models/location')
const Book = require('../models/book')

locationRouter.get('/', wrapAsync(async (req, res, next) => {
  const locations = await Location
    .find({})
    .sort('fullName')
  res.json(locations)
}))

locationRouter.post('/', wrapAsync(async (req, res, next) => {
  checkUser(req)
  validateMandatoryFields(req, ['room'], 'location', 'create')

  let location = new Location({
    room: req.body.room,
    shelving: req.body.shelving,
    shelf: req.body.shelf
  })
  location = await location.save()
  res.status(201).json(location)
}))

locationRouter.put('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)
  validateMandatoryFields(req, ['room'], 'location', 'update')

  let location = await Location.findById(req.params.id)
  if (!location) {
    let err = new Error('Location not found')
    err.isBadRequest = true
    throw err
  }

  location.room = req.body.room
  location.shelving = req.body.shelving
  location.shelf = req.body.shelf
  location = await Location.findByIdAndUpdate(location._id, location, { new: true })
  res.status(201).json(location)
}))

locationRouter.delete('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)

  let location = await Location.findById(req.params.id)
  if (!location) {
    let err = new Error('Location not found')
    err.isBadRequest = true
    throw err
  }

  let foundBooks = await Book.find({ location: { _id: location._id } })
  if (foundBooks && foundBooks.length > 0) {
    res.status(403).json({
      error: 'Location cannot be deleted at it is still used by some books.',
      books: foundBooks
    })
  } else {
    await Location.findByIdAndRemove(location._id)
    res.status(204).end()
  }
}))

module.exports = locationRouter