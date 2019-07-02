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

  const { parent, parentCopy } = await getParentAndCopy(req.body.parentId)
  console.log('getting numbers')
  const level = await getCategoryLevel(req.body.parentId)
  const number = await getNextAvailableNumber(req.body.parentId)
  console.log('creating category')
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
    // parent.children = parent.children.push({
    //   _id: category._id,
    //   name: category.name,
    //   number: category.number
    // })
    // await Category.findByIdAndUpdate(category.parent._id, parent)
    await addChild(parent, category)
  }
  console.log('parent is now', parent)

  res.status(201).json(category)
}))

categoryRouter.put('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)

  let category = await Category.findById(req.params.id)
  if (!category) {
    let err = new Error('Category not found')
    err.isBadRequest = true
    throw err
  }
  console.log('category to edit: ', category)

  validateMandatoryFields(req, ['name'], 'category', 'update')

  let nameMatch = await Category.findOne({ name: req.body.name })
  if (nameMatch && !nameMatch._id.equals(category._id)) {
    let err = new Error('Another category already has the same name')
    err.isBadRequest = true
    throw err
  }

  if (req.body.parentId !== category.parent._id.toString()) {
    const { parent, parentCopy } = await getParentAndCopy(req.body.parentId)
    console.log('getting numbers')
    category.level = await getCategoryLevel(req.body.parentId)
    category.number = await getNextAvailableNumber(req.body.parentId)
    console.log('parentcopy', parentCopy)

    let { oldParent } = await getParentAndCopy(category.parent._id)
    console.log('got old parent', oldParent)
    if (oldParent) {
      console.log('about to remove child')
      await removeChild(oldParent, category)
    }

    if (parent) {
      console.log('about to add child')
      await addChild(parent, category)
    }
    category.code = parent ? `${parent.code}.${category.number}` : category.number
    category.parent = parentCopy
    console.log('recoding children')
    await recodeChildren(category, category.children)
  }
  category.name = req.body.name

  category = await Category.findByIdAndUpdate(category._id, category, { new: true })
  console.log('returning updated ', category)
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

getParentAndCopy = async (parentId) => {
  let parent = null
  let parentCopy = null
  if (parentId) {
    console.log('getting parent')
    parent = await Category.findById(parentId)
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
  return {
    parent,
    parentCopy
  }
}

addChild = async (parent, child) => {
  parent.children = parent.children.push({
    _id: child._id,
    name: child.name,
    number: child.number
  })
  console.log('updated children', parent.children)
  parent = await Category.findByIdAndUpdate(parent._id, parent, { new: true })
  console.log('new parent is now', parent)
}

removeChild = async (parent, child) => {
  parent.children = parent.children.filter(c => !c._id.equals(child._id))
  parent = await Category.findByIdAndUpdate(child.parent._id, parent, { new: true })
  console.log('old parent is now', parent)
}

recodeChildren = async (parent, children) => {
  let child, number
  let parentId = parent ? null : parent._id
  for (let c of children) {
    child = await Category.findById(c._id)
    if (child) {
      number = await getNextAvailableNumber(parentId)
      child.code = parent ? `${parent.code}.${number}` : number
      child.level = parent.level + 1
      child.number = number
      console.log('updating child', child)
      await Category.findByIdAndUpdate(child._id, child)
      await recodeChildren(child, child.children)
    }
  }
}

module.exports = categoryRouter