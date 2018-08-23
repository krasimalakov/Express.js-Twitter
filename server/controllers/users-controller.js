let encryption = require('../utilities/encryption')
let User = require('mongoose').model('User')

module.exports = {
  register: (req, res) => {
    res.render('users/register')
  },
  create: (req, res) => {
    let user = req.body

    if (user.password !== user.confirmPassword) {
      user.globalError = 'Passwords do not match!'
      res.render('users/register', user)
    } else {
      user.salt = encryption.generateSalt()
      user.hashedPass = encryption.generateHashedPassword(user.salt, user.password)

      User
        .create(user)
        .then(user => {
          req.logIn(user, (err, user) => {
            if (err) {
              res.render('users/register', { globalError: 'Ooops 500' })
              return
            }
            res.redirect('/')
          })
        })
    }
  },
  login: (req, res) => {
    res.render('users/login')
  },
  authenticate: (req, res) => {
    let userData = req.body
    User
      .findOne({ username: userData.username })
      .then(user => {
        if (!user || !user.authenticate(userData.password)) {
          res.render('users/login', { globalError: 'Invalid username or password' })
        } else {
          req.logIn(user, (err, user) => {
            if (err) {
              res.render('users/login', { globalError: 'Ooops 500' })
              return
            }

            let redirectTo = req.session.redirectTo ? req.session.redirectTo : '/'
            let method = req.session.redirectToMethod
            delete req.session.redirectTo
            delete req.session.redirectToMethod
            method !== 'POST' ? res.redirect(redirectTo) : res.redirect(307, redirectTo)
          })
        }
      })
  },
  logout: (req, res) => {
    req.logout()
    res.redirect('/')
  },
  list: (req, res) => {
    User
      .find()
      .sort({'firstName': 1, 'lastName': 1})
      .then((users) => {
        res.render('users/list', {users: users, message: 'List of all users'})
      })
  },
  listAdmins: (req, res) => {
    User
      .find({$where: 'this.roles.indexOf("Admin") != -1'})
      .sort({'firstName': 1, 'lastName': 1})
      .then((users) => {
        res.render('users/list', {users: users, message: 'List of all admins'})
      })
  },
  profile: (req, res) => {
    let username = req.params.username
    User
      .findOne({'username': username})
      .populate({path: 'tweets', options: {sort: { 'createdOn': -1 }}})
      .slice('tweets', -100)
      .then((user, err) => {
        if (err) {
          res.render('home/index', {globalError: `Not find user with username ${username}!!!`})
        } else {
          user.tweets.forEach((tweet) => {
            tweet.views++
            tweet.save()
          })
          res.render('users/profile', {user: user})
        }
      })
  },
  setAdmin: (req, res) => {
    let username = req.params.username
    User
      .findOneAndUpdate({'username': username}, {$push: {'roles': 'Admin'}}, (err) => {
        if (err) {
          res.render('home/index', {globalError: `Not find user with username ${username}!!!`})
        } else {
          res.redirect('back')
        }
      })
  }
}
