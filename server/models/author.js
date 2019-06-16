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

authorSchema.virtual('fullName').get(() => {
  console.log('Virtual', this.firstNames, this.lastName)
  return (`${this.firstNames} ${this.lastName}`).trim()
})

authorSchema.virtual('fullNameReversed').get(() => {
  const fullNameReversed = this.firstNames ?
    `${this.lastName}, ${this.firstNames}` :
    this.lastName
  console.log('Täysi nimi', fullNameReversed)
  return fullNameReversed
})

authorSchema.set('toObject', { virtuals: true })
authorSchema.set('toJSON', { virtuals: true })

const Author = mongoose.model('Author', authorSchema)

module.exports = Author