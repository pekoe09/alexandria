const { wrapAsync, checkUser, validateMandatoryFields } = require('./controllerHelpers')
const authorRouter = require('express').Router()
const Author = require('../models/author')

authorRouter.get('/', wrapAsync(async (req, res, next) => {
  const authors = await Author
    .find({})
    .sort('fullNameReversed')
  res.json(authors)
}))

authorRouter.post('/', wrapAsync(async (req, res, next) => {
  checkUser(req)


}))

authorRouter.put('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)


}))

authorRouter.delete('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)


}))

module.exports = authorRouter