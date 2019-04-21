const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    fullNameReversed: {
      type: String,
      required: true
    }
  },
  publisher: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  publishingYear: {
    type: Number
  },
  isbn: {
    type: String
  },
  categories: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    level: {
      type: Number,
      required: true
    },
    number: {
      type: Number,
      required: true
    }
  }],
  location: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    fullName: {
      type: String,
      required: true
    }
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