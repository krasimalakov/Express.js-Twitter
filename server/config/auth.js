module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      next()
    } else {
      req.session.redirectTo = req.path
      req.session.redirectToMethod = req.method
      res.redirect('/users/login')
    }
  },
  isInRole: (role) => {
    return (req, res, next) => {
      if (req.user && req.user.roles.indexOf(role) > -1) {
        next()
      } else {
        req.session.redirectTo = req.path
        req.session.redirectToMethod = req.method
        res.redirect('/users/login')
      }
    }
  }
}
