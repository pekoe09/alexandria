const { wrapAsync, checkUser, validateMandatoryFields } = require('./controllerHelpers')
const publisherRouter = require('express').Router()
const Publisher = require('../models/publisher')

publisherRouter.get('/', wrapAsync(async (req, res, next) => {
  const publishers = await Publisher
    .find({})
    .sort('name')
  res.json(publishers)
}))

publisherRouter.post('/', wrapAsync(async (req, res, next) => {
  checkUser(req)


}))

publisherRouter.put('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)


}))

publisherRouter.delete('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)


}))

module.exports = publisherRouter