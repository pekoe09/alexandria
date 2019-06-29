const mongoose = require('mongoose')

const categoryCopySchema = new mongoose.Schema({
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
  },
  code: {
    type: String,
    required: true
  }
})

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
  code: {
    type: String,
    required: true
  },
  parent: {
    type: categoryCopySchema
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