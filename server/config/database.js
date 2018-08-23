const mongoose = require('mongoose')

mongoose.Promise = global.Promise
module.exports = (config) => {
  mongoose.connect(config.db)

  let db = mongoose.connection

  db.once('open', (err) => {
    if (err) throw err
    console.log(`MongoDB ready, contected to: ${config.db}`)
  })

  db.on('error', (err) => console.log('Database error: ' + err))

  require('../data/User.js').seedAdminUser()
  require('../data/Tag.js')
  require('../data/Tweet.js')
}
