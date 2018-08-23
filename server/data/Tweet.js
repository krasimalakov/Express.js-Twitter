let mongoose = require('mongoose')

const requiredValidationMessage = '{PATH} is required'

let tweetSchema = new mongoose.Schema({
  message: {type: String, required: requiredValidationMessage, maxlength: 140},
  createdOn: {
    type: Date,
    default: Date.now,
    get: v => v.getDate() + '.' + (v.getMonth() + 1) + '.' + v.getFullYear() + ' - ' + v.toLocaleTimeString()
  },
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: requiredValidationMessage},
  userHandles: [{type: String}],
  tags: [{type: String, ref: 'Tag'}],
  likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  views: {type: Number, default: 0}
})

tweetSchema.pre('save', function (next) {
  if (this.isNew) {
    let allTags = this.message.split(/([ .,!?])/).filter((part) => {
      return part.charAt(0) === '#'
    }).map((tag) => {
      return tag.substring(1).toLowerCase()
    })
    this.tags = Array.from(new Set(allTags))

    let allUserHandles = this.message.split(/([ .,!?])/).filter((part) => {
      return part.charAt(0) === '@'
    }).map((username) => {
      return username.substring(1)
    })
    this.userHandles = Array.from(new Set(allUserHandles))

    next()
  }
})

mongoose.model('Tweet', tweetSchema)
module.exports = mongoose.model('Tweet')
