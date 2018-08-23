let mongoose = require('mongoose')

let tagSchema = new mongoose.Schema({
  _id: {
    type: String,
    set: v => v.toLowerCase()
  },
  tweets: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tweet'}]
})

mongoose.model('Tag', tagSchema)
module.exports = mongoose.model('Tag')
