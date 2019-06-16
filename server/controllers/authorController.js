const { wrapAsync, checkUser, validateMandatoryFields } = require('./controllerHelpers')
const authorRouter = require('express').Router()
const Author = require('../models/author')
const Book = require('../models/book')

authorRouter.get('/', wrapAsync(async (req, res, next) => {
  const authors = await Author
    .find({})
    .sort('fullNameReversed')

  console.log(authors)
  res.json(authors)
}))

authorRouter.post('/', wrapAsync(async (req, res, next) => {
  checkUser(req)
  validateMandatoryFields(req, ['lastName'], 'author', 'create')
  console.log('Saving author')
  console.log(req.body)
  let author = new Author({
    lastName: req.body.lastName,
    firstNames: req.body.firstNames,
    DOB: req.body.DOB,
    DOD: req.body.DOD,
    books: []
  })
  console.log('Sving', author)
  author = await author.save()
  console.log('Saved', author)
  res.status(201).json(author)
}))

authorRouter.put('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)
  validateMandatoryFields(req, ['lastName'], 'author', 'update')

  let author = await Author.findById(req.params.id)
  if (!author) {
    let err = new Error('Author not found')
    err.isBadRequest = true
    throw err
  }

  author.lastName = req.body.lastName
  author.firstNames = req.body.firstNames
  author.DOB = req.body.dob
  author.DOD = req.body.dod
  author = await Author.findByIdAndUpdate(author._id, author, { new: true })
  res.status(201).json(author)
}))

authorRouter.delete('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)

  let author = await Author.findById(req.params.id)
  if (!author) {
    let err = new Error('Author not found')
    err.isBadRequest = true
    throw err
  }

  let foundBooks = await Book.find({ author: { _id: author._id } })
  if (foundBooks && foundBooks.length > 0) {
    res.status(403).json({
      error: 'Author cannot be deleted as it is still used by some books.',
      books: foundBooks
    })
  } else {
    await Author.findByIdAndRemove(author._id)
    res.status(204).end()
  }

}))

module.exports = authorRouter