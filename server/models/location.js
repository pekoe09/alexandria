const mongoose = require('mongoose')

const locationSchema = new mongoose.Schema({
  room: {
    type: String,
    required: true
  },
  shelving: {
    type: String
  },
  shelf: {
    type: String
  }
})

locationSchema.virtual('fullName').get(() => {
  let fullName = this.room
  if (this.shelving) {
    fullName = `${fullName} - ${this.shelving}`
  }
  if (this.shelf) {
    fullName = `${fullName} / ${this.shelf}`
  }
  return fullName
})

locationSchema.set('toObject', { virtuals: true })
locationSchema.set('toJSON', { virtuals: true })

const Location = mongoose.model('Location', locationSchema)

module.exports = Location