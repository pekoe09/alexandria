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
    type: Number,
    min: 1
  },
  endPage: {
    type: Number,
    min: 1
  },
  readPages: {
    type: Number,
    min: 1,
    required: true
  },
  minutes: {
    type: Number,
    min: 1
  }
})

const Reading = mongoose.model('Reading', readingSchema)

module.exports = Reading