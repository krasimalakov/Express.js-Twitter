const path = require('path')

let rootPath = path.normalize(path.join(__dirname, '/../../'))

module.exports = {
  development: {
    db: 'mongodb://localhost:27017/tweeter',
    port: 1234,
    rootPath: rootPath,
    sessionSicret: 'mySecret123654#$_'
  },
  production: {
    db: process.env.MONGO_DB_CONNECTION_STRING,
    port: process.env.PORT,
    rootPath: rootPath,
    sessionSicret: process.env.SESSION_SICRET
  }
}
