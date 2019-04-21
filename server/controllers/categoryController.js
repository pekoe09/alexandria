const { wrapAsync, checkUser, validateMandatoryFields } = require('./controllerHelpers')
const categoryRouter = require('express').Router()
const Category = require('../models/category')
const Book = require('../models/book')

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
  validateMandatoryFields(req, ['name', 'level', 'category', 'update'])

  let category = await Category.findById(req.params.id)
  if (!category) {
    let err = new Error('Category not found')
    err.isBadRequest = true
    throw err
  }

  let nameMatch = await Category.findOne({ name: req.body.name })
  if (nameMatch && !nameMatch._id.equals(category._id)) {
    let err = new Error('Another category already has the same name')
    err.isBadRequest = true
    throw err
  }

  category.name = req.body.name
  category.level = req.body.level
  category.parent = req.body.parentId
  category = await Category.findByIdAndUpdate(category._id, category, { new: true })
  res.status(201).json(category)
}))

categoryRouter.delete('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)

  let category = await Category.findById(req.params.id)
  if (!category) {
    let err = new Error('Category not found')
    err.isBadRequest = true
    throw err
  }

  let foundBooks = await Book.find({
    categories: {
      _id: category._id
    }
  })
  if (foundBooks && foundBooks.length > 0) {
    res.status(403).json({
      error: 'Category cannot be deleted as it is still used by some books.',
      books: foundBooks
    })
  } else {
    await Category.findByIdAndRemove(category._id)
    res.status(204).end()
  }
}))

getNextAvailableNumber = (parent, level) => {
  return 0
}

module.exports = categoryRouter