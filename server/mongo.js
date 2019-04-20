const mongoose = require('mongoose')
const config = require('./config.js')
const bcrypt = require('bcryptjs')
const User = require('./models/user')

const initializeUser = async () => {
  const users = await User.find({})
  if (!users || users.length === 0) {
    console.log('Initializing first user')
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(config.firstPassword, saltRounds)
    const user = new User({
      username: config.firstUsername,
      passwordHash,
      firstNames: 'Default',
      lastName: 'Admin',
      email: 'some.one@some.where',
      locations: []
    })
    await user.save()
  }
}

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

console.log('Connecting to database...')
mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.connect(config.mongoConnStr, { useNewUrlParser: true })
mongoose.Promise = global.Promise
console.log('...connected!')

// if there are no users (db is pristine), first admin user is initialized
initializeUser()

close = () => {
  mongoose.connection.close()
  console.log('Database connection closed')
}

module.exports = { close }