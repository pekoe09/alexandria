const { wrapAsync, checkUser, validateMandatoryFields } = require('./controllerHelpers')
const bookRouter = require('express').Router()
const Book = require('../models/book')

bookRouter.get('/', wrapAsync(async (req, res, next) => {
  const books = await Book
    .find({})
    .sort({
      author: 1,
      title: 1
    })
}))

bookRouter.post('/', wrapAsync(async (req, res, next) => {
  checkUser(req)



}))

bookRouter.put('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)

}))

bookRouter.delete('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)

}))

module.exports = bookRouter