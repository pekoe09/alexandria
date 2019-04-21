const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  level: {
    type: Number,
    required: true
  },
  number: {
    type: Number,
    required: true
  },
  parent: {
    _id: mongoose.Schema.Types.ObjectId
  },
  children: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    number: {
      type: Number,
      required: true
    }
  }]
})

const Category = mongoose.model('Category', categorySchema)

module.exports = Category