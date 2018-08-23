let homeController = require('./home-controller.js')
let usersController = require('./users-controller.js')
let tweetsController = require('./tweets-controller.js')
let tagsController = require('./tags-controller.js')

module.exports = {
  home: homeController,
  users: usersController,
  tweets: tweetsController,
  tags: tagsController
}
