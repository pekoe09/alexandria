const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
  lastName: {
    type: String,
    required: true
  },
  firstNames: {
    type: String
  },
  DOB: {
    type: Date
  },
  DOD: {
    type: Date
  },
  books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }]
})

authorSchema.virtual('fullName').get(function() {
  return (`${this.firstNames} ${this.lastName}`).trim()
})

authorSchema.virtual('fullNameReversed').get(function() {
  const fullNameReversed = this.firstNames ?
    `${this.lastName}, ${this.firstNames}` :
    this.lastName
  return fullNameReversed
})

authorSchema.set('toObject', { virtuals: true })
authorSchema.set('toJSON', { virtuals: true })

const Author = mongoose.model('Author', authorSchema)

module.exports = Author