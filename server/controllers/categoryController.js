const { wrapAsync, checkUser, validateMandatoryFields } = require('./controllerHelpers')
const categoryRouter = require('express').Router()
const Category = require('../models/category')

categoryRouter.get('/', wrapAsync(async (req, res, next) => {
  const categories = await Category
    .find({})
    .sort('name')
  res.json(categories)
}))

categoryRouter.post('/', wrapAsync(async (req, res, next) => {
  checkUser(req)
  validateMandatoryFields(req, ['name', 'level'], 'category', 'create')

  let nameMatch = await Category.findOne({ name: req.body.name })
  if (nameMatch) {
    let err = new Error('Another category already has the same name')
    err.isBadRequest = true
    throw err
  }

  let category = new Category({
    name: req.body.name,
    level: req.body.level,
    number: getNextAvailableNumber(req.body.parentId, req.body.level),
    parent: req.body.parentId,
    children: []
  })
  category = await category.save()

  let parent = await Category.findById(category.parent)
  parent.children = parent.children.concat({
    _id: category._id,
    name: category.name,
    number: category.number
  })
  await Category.findByIdAndUpdate(category.parent, parent)

  res.status(201).json(category)
}))

categoryRouter.put('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)


}))

categoryRouter.delete('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)


}))

getNextAvailableNumber = (parent, level) => {
  return 0
}

module.exports = categoryRouter