const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  },
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Publisher'
  },
  publishingYear: {
    type: Number
  },
  isbn: {
    type: String
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  },
  serialNumber: {
    type: Number
  },
  read: {
    type: Number
  },
  acquiredDate: {
    type: Date
  },
  price: {
    type: Number
  },
  comment: {
    type: String
  }
})

const Book = mongoose.model('Book', bookSchema)

module.exports = Book