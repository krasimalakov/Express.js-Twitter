const express = require('express')
let app = express()
const env = process.env.NODE_ENV || 'development'
const config = require('./server/config/config')[env]

require('./server/config/database')(config)
require('./server/config/express')(config, app)
require('./server/config/routes')(app)
require('./server/config/passport')()

app.listen(config.port)
console.log(`Express ready, listhen at port: ${config.port}`)
