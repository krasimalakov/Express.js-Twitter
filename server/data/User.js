const mongoose = require('mongoose')
const encryption = require('../utilities/encryption.js')
const requiredValidationMessage = '{PATH} is required'

let userSchema = mongoose.Schema({
  username: { type: String, required: requiredValidationMessage, unique: true },
  firstName: { type: String, required: requiredValidationMessage },
  lastName: { type: String, required: requiredValidationMessage },
  salt: String,
  hashedPass: String,
  roles: [String],
  tweets: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tweet'}]
})

userSchema.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName
})

userSchema.method({
  authenticate: function (password) {
    if (encryption.generateHashedPassword(this.salt, password) === this.hashedPass) {
      return true
    } else {
      return false
    }
  }
})

let User = mongoose.model('User', userSchema)

module.exports.seedAdminUser = () => {
  User.find({}).then((users) => {
    if (users.length > 0) return
    let salt = encryption.generateSalt()
    let hashedPass = encryption.generateHashedPassword(salt, '1234')

    User.create({
      username: 'admin',
      firstName: 'admin',
      lastName: 'anonymous',
      salt: salt,
      hashedPass: hashedPass,
      roles: ['Admin']
    })
  })
}
