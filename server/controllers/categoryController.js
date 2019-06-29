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
  validateMandatoryFields(req, ['name'], 'category', 'create')

  let nameMatch = await Category.findOne({ name: req.body.name })
  if (nameMatch) {
    let err = new Error('Another category already has the same name')
    err.isBadRequest = true
    throw err
  }

  let parent = null
  let parentCopy = null
  if (req.body.parentId) {
    console.log('getting parent')
    parent = await Category.findById(req.body.parentId)
    console.log('got parent', parent)
    if (!parent) {
      let err = new Error('Parent is not valid')
      err.isBadRequest = true
      throw err
    }
    parentCopy = {
      _id: parent._id,
      name: parent.name,
      level: parent.level,
      number: parent.number,
      code: parent.code
    }
    console.log(parentCopy)
    delete parentCopy.children
  }
  console.log('getting numbers')
  const level = await getCategoryLevel(req.body.parentId)
  const number = await getNextAvailableNumber(req.body.parentId)
  console.log('creating category')
  console.log('parentcopy', parentCopy)
  let category = new Category({
    name: req.body.name,
    level,
    number,
    code: parent ? `${parent.code}.${number}` : number,
    parent: parentCopy,
    children: []
  })
  console.log('saving category', category)
  category = await category.save()

  if (parent) {
    parent.children = parent.children.concat({
      _id: category._id,
      name: category.name,
      number: category.number
    })
    await Category.findByIdAndUpdate(category.parent, parent)
  }
  console.log('parent is now', parent)

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

getCategoryLevel = async (parentId) => {
  if (parentId) {
    let savedParent = await Category.findById(parentId)
    return savedParent.level + 1;
  } else {
    return 0;
  }
}

getNextAvailableNumber = async (parentId) => {
  let level = await getCategoryLevel(parentId)
  let maxCategory = null
  if (parentId) {
    maxCategory = await Category
      .findOne({ 'parent._id': parentId })
      .sort('-number')
  } else {
    maxCategory = await Category
      .findOne({ level: level })
      .sort('-number')
  }

  if (maxCategory) {
    return maxCategory.number + 1
  } else {
    return 1
  }
}

module.exports = categoryRouter