const controllers = require('../controllers/index.js')
const auth = require('../config/auth')

module.exports = (app) => {
  app.get('/', controllers.tweets.list)

  app.get('/users/register', controllers.users.register)
  app.post('/users/create', controllers.users.create)
  app.get('/users/login', controllers.users.login)
  app.post('/users/authenticate', controllers.users.authenticate)
  app.post('/users/logout', controllers.users.logout)


  app.get('/users/list', auth.isAuthenticated, controllers.users.list)
  app.get('/admins/all', auth.isAuthenticated, controllers.users.listAdmins)
  app.get('/profile/:username', auth.isAuthenticated, controllers.users.profile)
  app.post('/admins/add/:username', auth.isAuthenticated, auth.isInRole('Admin'), controllers.users.setAdmin)

  app.get('/tags', controllers.tags.list)
  app.get('/tag/:tag', controllers.tags.listTweets)

  app.get('/tweet', auth.isAuthenticated, controllers.tweets.add)
  app.post('/tweet/create', auth.isAuthenticated, controllers.tweets.create)
  app.get('/list', controllers.tweets.list)
  app.post('/tweet/like/:tweetId', auth.isAuthenticated, controllers.tweets.like)
  app.post('/tweet/unlike/:tweetId', auth.isAuthenticated, controllers.tweets.unlike)
  app.post('/tweet/delete', auth.isAuthenticated, auth.isInRole('Admin'), controllers.tweets.remove)
  app.get('/tweet/edit/:tweetId', auth.isAuthenticated, auth.isInRole('Admin'), controllers.tweets.edit)
  app.post('/tweet/update', auth.isAuthenticated, auth.isInRole('Admin'), controllers.tweets.update)


  // app.all('/:controller/:action', (req, res) => {
  //   controllers[req.params.controller][req.params.action](req, res)
  // })

  app.all('*', (req, res) => {
    res.status(404)
    res.send('Not Found')
    res.end()
  })
}
