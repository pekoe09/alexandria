const mongoose = require('mongoose')

const readingSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startPage: {
    type: Number
  },
  endPage: {
    type: Number
  },
  readPages: {
    type: Number
  },
  minutes: {
    type: Number
  }
})

const Reading = mongoose.model('Reading', readingSchema)

module.exports = Reading