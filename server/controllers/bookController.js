const { wrapAsync, checkUser, validateMandatoryFields } = require('./controllerHelpers')
const bookRouter = require('express').Router()
const Book = require('../models/book')
const Author = require('../models/author')
const Publisher = require('../models/publisher')
const Category = require('../models/category')
const Location = require('../models/location')

bookRouter.get('/', wrapAsync(async (req, res, next) => {
  const books = await Book
    .find({})
    .sort({
      'author.fullNameReversed': 1,
      title: 1
    })
}))

bookRouter.post('/', wrapAsync(async (req, res, next) => {
  checkUser(req)
  validateMandatoryFields(req, ['title'], 'book', 'create')

  let book = new Book({
    title: req.body.title,
    author: req.body.authorId,
    publisher: req.body.publisherId,
    publishingYear: req.body.publishingYear,
    isbn: req.body.isbn,
    categories: req.body.categoryIds,
    location: req.body.locationId,
    serialNumber: req.body.serialNumber,
    read: req.body.read,
    acquiredDate: req.body.acquiredDate,
    price: req.body.price,
    comment: req.body.comment
  })
  book = await book.save()
  if (req.body.authorId) {
    let author = Author.findById(req.body.authorId)
    author.books = author.books.concat(book._id)
    await Author.findByIdAndUpdate(author._id, author)
  }

  res.status(201).json(book)
}))

bookRouter.put('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)
  validateMandatoryFields(req, ['title'], 'book', 'create')

  let book = await Book.findById(req.params.id)
  if (!book) {
    let err = new Error('Book is not found')
    err.isBadRequest = true
    throw err
  }

  if (!book.author.equals(req.body.authorId)) {
    let oldAuthor = Author.findById(book.author)
    oldAuthor.books = oldAuthor.books.filter(b => !b._id.equals(book._id))
    await Author.findByIdAndUpdate(oldAuthor._id, oldAuthor)
    let newAuthor = Author.findById(req.body.authorId)
    newAuthor.books = newAuthor.books.concat(book._id)
    await Author.findByIdAndUpdate(newAuthor._id, newAuthor)
  }

  book.title = req.body.title
  book.author = req.body.authorId
  book.publisher = req.body.publisherId
  book.publishingYear = req.body.publishingYear
  book.isbn = req.body.isbn
  book.categories = req.body.categories
  book.location = req.body.locationId
  book.serialNumber = req.body.serialNumber
  book.read = req.body.read
  book.acquiredDate = req.body.acquiredDate
  book.price = req.body.price
  book.comment = req.body.comment
  book = await Book.findByIdAndUpdate(book._id, book, { new: true })
  res.status(201).json(book)
}))

bookRouter.delete('/:id', wrapAsync(async (req, res, next) => {
  checkUser(req)

  let book = await Book.findById(req.params.id)
  if (!book) {
    let err = new Error('Book is not found')
    err.isBadRequest = true
    throw err
  }

  if (book.author) {
    let author = await Author.findById(book.author)
    author.books = author.books.filter(b => !b._id.equals(book._id))
    await Author.findByIdAndUpdate(author._id, author)
  }

  await Book.findByIdAndRemove(book._id)
  res.status(204).end()
}))

module.exports = bookRouter