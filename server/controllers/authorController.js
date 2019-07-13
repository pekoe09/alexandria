const {
  wrapAsync,
  checkUser,
  validateMandatoryFields,
  hydrateIdsToObjects,
  stringifyByProperty
} = require('./controllerHelpers')
const authorRouter = require('express').Router()
const Author = require('../models/author')
const Book = require('../models/book')

authorRouter.get('/', wrapAsync(async (req, res, next) => {
  const authors = await Author
    .find({})
    .sort('fullNameReversed')
  res.json(authors)
}))

authorRouter.post('/', wrapAsync(async (req, res, next) => {
  checkUser(req)
  validateMandatoryFields(req, ['lastName'], 'author', 'create')
  let author = new Author({
    lastName: req.body.lastName,
    firstNames: req.body.firstNames,
    DOB: req.body.DOB,
    DOD: req.body.DOD,
    books: []
  })
  author = await author.save()
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

  let nameChanged = false
  if ((author.lastName !== req.body.lastName) || (author.firstNames !== req.body.firstNames)) {
    nameChanged = true
  }

  author.lastName = req.body.lastName
  author.firstNames = req.body.firstNames
  author.DOB = req.body.DOB
  author.DOD = req.body.DOD
  author = await Author.findByIdAndUpdate(author._id, author, { new: true })

  // update authorsString in all books by this person if the name has changed
  if (nameChanged) {
    let books = await hydrateIdsToObjects(author.books, Book, 'Book')
    for (let book of books) {
      let authors = await hydrateIdsToObjects(book.authors, Author, 'Author')
      authors = authors.filter(a => !a._id.equals(author._id))
      let authorsString = stringifyByProperty(authors, 'fullNameReversed', '; ')
      authorsString = authorsString.length > 0 ?
        `${authorsString}; ${author.fullNameReversed}` : author.fullNameReversed
      book.authorsString = authorsString
      await Book.findByIdAndUpdate(book._id, book)
    }
  }

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