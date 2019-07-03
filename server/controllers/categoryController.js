const { 
  wrapAsync, 
  checkUser, 
  validateMandatoryFields,
  hydrateIdsToObjects,
  stringifyByProperty
} = require('./controllerHelpers')
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
  const level = await getCategoryLevel(req.body.parentId)
  const number = await getNextAvailableNumber(req.body.parentId)
  let category = new Category({
    name: req.body.name,
    level,
    number,
    code: parent ? `${parent.code}.${number}` : number,
    parent: parentCopy,
    children: []
  })
  category = await category.save()

  if (parent) {
    await addChild(parent, category)
  }

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

  validateMandatoryFields(req, ['name'], 'category', 'update')

  let nameMatch = await Category.findOne({ name: req.body.name })
  if (nameMatch && !nameMatch._id.equals(category._id)) {
    let err = new Error('Another category already has the same name')
    err.isBadRequest = true
    throw err
  }
  let nameChanged = false
  if(category.name !== req.body.name) {
    nameChanged = true
  }

  const oldParentId = category.parent ? category.parent._id : null
  if (req.body.parentId !== (oldParentId ? oldParentId.toString() : '')) {
    const { parent, parentCopy } = await getParentAndCopy(req.body.parentId)
    category.level = await getCategoryLevel(req.body.parentId)
    category.number = await getNextAvailableNumber(req.body.parentId)

    const oldParentData = await getParentAndCopy(oldParentId)
    let oldParent = oldParentData.parent
    if (oldParent) {
      await removeChild(oldParent, category)
    }

    if (parent) {
      await addChild(parent, category)
    }
    category.code = parent ? `${parent.code}.${category.number}` : category.number
    category.parent = parentCopy
    await recodeChildren(category, category.children, false)
  }
  category.name = req.body.name

  // update categoriesString in all books that have this category if the name has changed
  if(nameChanged) {
    let books = await Book.find({ categories: category._id })
    for(let book in books) {
      let categories = await hydrateIdsToObjects(book.categories, Category, 'Category')
      categories = categories.filter(c => c._id !== category._id)
      let categoriesString = stringifyByProperty(categories, 'name', ', ')
      categoriesString = `${categoriesString}, ${category.name}`
      book.categoriesString = categoriesString
      await Book.findByIdAndUpdate(book._id, book)
    }
  }

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
  console.log('deleting category', category)

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
    let parent = null, parentCopy = null
    if (category.parent) {
      let parentData = await getParentAndCopy(category.parent._id)
      parent = parentData.parent
      parentCopy = parentData.parentCopy
    }

    if (parent) {
      console.log('parent of the deceased', parent)
      console.log('copy of the same', parentCopy)
      parent.children = parent.children.filter(c => !c.equals(category._id))
      await Category.findByIdAndUpdate(parent._id, parent)
    }

    let child = null
    if (category.children.length > 0) {
      for (let c of category.children) {
        child = await Category.findById(c)
        child.parent = parentCopy
        child.level = await getCategoryLevel(parent._id)
        child.number = await getNextAvailableNumber(parent._id)
        child.code = parent ? `${parent.code}.${child.number}` : child.number
        await Category.findByIdAndUpdate(child._id, child)
        console.log('attempting to recode children for:', child)
        await recodeChildren(child, child.children, true)
      }
    }

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
    parent = await Category.findById(parentId)
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
  }
  return {
    parent,
    parentCopy
  }
}

addChild = async (parent, child) => {
  parent.children = parent.children.push(child._id)
  parent = await Category.findByIdAndUpdate(parent._id, parent, { new: true })
}

removeChild = async (parent, child) => {
  parent.children = parent.children.filter(c => !c.equals(child._id))
  parent = await Category.findByIdAndUpdate(parent._id, parent, { new: true })
}

recodeChildren = async (parent, children, renumberIsOn) => {
  let child, number
  let parentId = parent ? parent._id : null
  for (let c of children) {
    child = await Category.findById(c)
    if (child) {
      if (renumberIsOn) {
        number = await getNextAvailableNumber(parentId)
        child.number = number
      }
      child.code = parent ? `${parent.code}.${child.number}` : child.number
      child.level = parent.level + 1
      console.log('saving recoded', child)
      await Category.findByIdAndUpdate(child._id, child)
      await recodeChildren(child, child.children, false)
    }
  }
}

module.exports = categoryRouter