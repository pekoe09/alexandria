const { wrapAsync, checkUser, validateMandatoryFields } = require('./controllerHelpers')
const locationRouter = require('express').Router()
const Location = require('../models/location')

locationRouter.get('/', wrapAsync(async (req, res, next) => {
  const locations = await Location
    .find({})
    .sort('fullName')
  res.json(locations)
}))

locationRouter.post('/', wrapAsync(async (req, res, next) => {
  checkUser(req)


}))

locationRouter.put('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)


}))

locationRouter.delete('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)


}))

module.exports = locationRouter