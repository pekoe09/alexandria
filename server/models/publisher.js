const mongoose = require('mongoose')

const publisherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  city: {
    type: String
  },
  country: {
    type: String
  }
})

const Publisher = mongoose.model('Publisher', publisherSchema)

module.exports = Publisher