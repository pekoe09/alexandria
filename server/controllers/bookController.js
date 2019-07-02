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
    .populate('authors')
    .populate('publisher')
    .populate('categories')
    .populate('location')
    .sort({
      'author.fullNameReversed': 1,
      title: 1
    })
}))

bookRouter.post('/', wrapAsync(async (req, res, next) => {
  checkUser(req)
  validateMandatoryFields(req, ['title'], 'book', 'create')

  let authors = []
  let authorsString = ''
  if (req.body.authors) {
    console.log('received authors', req.body.authors)
    for (const a of req.body.authors) {
      const author = await Author.findById(a)
      if (!author) {
        let err = new Error(`Author is not valid (${a})`)
        err.isBadRequest = true
        throw err
      }
      console.log('adding author ', author)
      authors.push(author)
    }

    console.log('authors array', authors)
    authorsString = authors.reduce((fullString, author) => `${fullString}${author.fullNameReversed}; `, '')
    authorsString = authorsString.slice(0, authorsString.length - 2)
    console.log('authors string ', authorsString)
  }

  let categories = []
  if (req.body.categories) {
    req.body.categories.forEach(async c => {
      const category = await Category.findById(c)
      if (!category) {
        let err = new Error(`Category is not valid (${c})`)
        err.isBadRequest = true
        throw err
      }
      categories.push(category)
    })
  }

  let publisher = null
  if (req.body.publisher) {
    publisher = await Publisher.findById(req.body.publisher)
    if (!publisher) {
      let err = new Error(`Publisher is not valid (${req.body.publisher})`)
      err.isBadRequest = true
      throw err
    }
  }

  let location = null
  if (req.body.location) {
    location = await Location.findById(req.body.location)
    if (!location) {
      let err = new Error(`Location is not valid (${req.body.location})`)
    }
  }

  let book = new Book({
    title: req.body.title,
    authors: req.body.authors,
    authorsString,
    publisher: req.body.publisher,
    publishingYear: req.body.publishingYear,
    isbn: req.body.isbn,
    categories: req.body.categories,
    location: req.body.location,
    serialNumber: req.body.serialNumber,
    pages: req.body.pages,
    readPages: req.body.readPages,
    acquiredDate: req.body.acquiredDate,
    price: req.body.price,
    comment: req.body.comment
  })
  book = await book.save()

  authors.forEach(async a => {
    a.books.push(book._id)
    await Author.findByIdAndUpdate(a._id, a)
  })
  const savedBook = await Book.findById(book._id)
    .populate('authors')
    .populate('publisher')
    .populate('categories')
    .populate('location')

  res.status(201).json(savedBook)
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