const { 
  wrapAsync,
  checkUser,
  validateMandatoryFields,
  hydrateIdsToObjects,
  stringifyByProperty
} = require('./controllerHelpers')
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
  res.json(books)
}))

bookRouter.post('/', wrapAsync(async (req, res, next) => {
  checkUser(req)
  validateMandatoryFields(req, ['title'], 'book', 'create')

  let authors = []
  let authorsString = ''
  if (req.body.authors) {
    for (const a of req.body.authors) {
      const author = await Author.findById(a)
      if (!author) {
        let err = new Error(`Author is not valid (${a})`)
        err.isBadRequest = true
        throw err
      }
      authors.push(author)
    }

    authorsString = authors.reduce((fullString, author) => `${fullString}${author.fullNameReversed}; `, '')
    authorsString = authorsString.slice(0, authorsString.length - 2)
  }

  let categories = []
  let categoriesString = ''
  if (req.body.categories) {
    for (const c of req.body.categories) {
      let category = await Category.findById(c)
      if (!category) {
        let err = new Error(`Category is not valid (${c})`)
        err.isBadRequest = true
        throw err
      }
      categories.push(category)
    }
    categories = categories.sort((a, b) => a.code > b.code ? 1 : (a.code < b.code ? -1 : 0))
    categoriesString = categories.reduce((fullString, category) => `${fullString}${category.name}, `, '')
    categoriesString = categoriesString.slice(0, categoriesString.length - 2)
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
    categoriesString,
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

  if (req.body.publisher) {
    let publisher = await Publisher.findById(req.body.publisher)
    if (!publisher) {
      let err = new Error(`Publisher is not valid (${req.body.publisher})`)
      err.isBadRequest = true
      throw err
    }
  }

  if (req.body.location) {
    let location = await Location.findById(req.body.location)
    if (!location) {
      let err = new Error(`Location is not valid (${req.body.location})`)
    }
  }

  let oldAuthors = await hydrateIdsToObjects(book.authors, Author, 'Author')
  let authors = await hydrateIdsToObjects(req.body.authors, Author, 'Author')
  let authorsString = stringifyByProperty(authors, 'fullNameReversed', '; ')

  // add book to newly added authors' books
  for (let author of authors) {
    if(!author.books.some(b => b.equals(book._id))) {
      author.books = author.books.push(book._id)
      await Author.findByIdAndUpdate(author._id, author)
    }
  }

  // remove book from those authors who have been removed
  for (let oldAuthor of oldAuthors) {
    if(!authors.some(a => a._id.equals(oldAuthor._id))) {
      oldAuthor.books = oldAuthor.books.filter(b => !b.equals(book._id))
      await Author.findByIdAndUpdate(oldAuthor._id, oldAuthor)
    }
  }

  let categories = await hydrateIdsToObjects(req.body.categories, Category, 'Category')
  categories = categories.sort((a, b) => a.code > b.code ? 1 : (a.code < b.code ? -1 : 0))
  let categoriesString = stringifyByProperty(categories, 'name', ', ') 

  book.title = req.body.title
  book.authors = req.body.authors
  book.authorsString = authorsString
  book.publisher = req.body.publisher
  book.publishingYear = req.body.publishingYear
  book.isbn = req.body.isbn
  book.categories = req.body.categories
  book.categoriesString = categoriesString
  book.location = req.body.location
  book.serialNumber = req.body.serialNumber
  book.pages = req.body.pages
  book.readPages = req.body.readPages
  book.acquiredDate = req.body.acquiredDate
  book.price = req.body.price
  book.comment = req.body.comment
  book = await Book.findByIdAndUpdate(book._id, book, { new: true })
  book = await Book.findById(book._id)
    .populate('authors')
    .populate('publisher')
    .populate('categories')
    .populate('location') 

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

  let authors = await hydrateIdsToObjects(book.authors, Author, 'Author')
  for (let author of authors) {
    author.books = author.books.filter(b => !b.equals(book._id))
    await Author.findByIdAndUpdate(author._id, author)
  }

  await Book.findByIdAndRemove(book._id)
  res.status(204).end()
}))

module.exports = bookRouter