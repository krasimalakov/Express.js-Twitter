let Tweet = require('mongoose').model('Tweet')
let Tag = require('mongoose').model('Tag')
let User = require('mongoose').model('User')

module.exports = {
  add: (req, res) => {
    res.render('tweets/add')
  },
  create: (req, res) => {
    let tweetData = req.body
    Tweet
      .create({
        author: tweetData.userId,
        message: tweetData.message
      }, (err, tweet) => {
        if (err) {
          console.log(err)
          res.render('home/index', {globalError: 'Error when create tweet!!!'})
        } else {
          User
            .findByIdAndUpdate(tweet.author, {$push: {tweets: tweet._id}}, (err) => {
              if (err) {
                console.log(err)
                res.render('home/index', {globalError: 'Error when create tweet and add it to User data!!!'})
              } else {
                User
                  .update({'username': {$in: tweet.userHandles}}, {$push: {tweets: tweet._id}}, {multi: true}, (err) => {
                    if (err) {
                      console.log(err)
                      res.render('home/index', {globalError: 'Error when create tweet and add it to User data!!!'})
                    } else {
                      tweet.tags.forEach((tag) => {
                        Tag
                          .findByIdAndUpdate(
                            tag,
                            {_id: tag, $push: {tweets: tweet._id}},
                            { upsert: true, new: true, setDefaultsOnInsert: true }, (err) => {
                              if (err) {
                                console.log(err)
                                res.render('home/index', {globalError: 'Error when create tweet and add it to Tags data!!!'})
                              } else {
                              }
                            })
                      })
                      res.redirect('/')
                    }
                  })
              }
            })
        }
      }
    )
  },
  list: (req, res) => {

    Tweet
      .find()
      .limit(100)
      .populate({path: 'author', select: '_id username firstName lastName'})
      .sort({createdOn: -1})
      .then((tweets, err) => {
        if (err) {
          console.log(err)
        } else {
          tweets.forEach((tweet) => {
            tweet.views++
            tweet.save()
          })
          res.render('tweets/list', {tweets: tweets})
        }
      })
  },
  like: (req, res) => {
    Tweet
      .findByIdAndUpdate(req.params.tweetId, {$push: {'likes': req.user._id}}, (err, tweet) => {
        if (err) {
          console.log(err)
          res.render('home/index', {globalError: 'Error when update like into tweet data!!!'})
        } else {
          req.session.update = true
          req.body.redirectMethodPost ? res.redirect(307, 'back') : res.redirect('back')
        }
      })
  },
  unlike: (req, res) => {
    Tweet
      .findByIdAndUpdate(req.params.tweetId, {$pull: {'likes': req.user._id}}, (err, tweet) => {
        if (err) {
          console.log(err)
          res.render('home/index', {globalError: 'Error when update unlike into tweet data!!!'})
        } else {
          req.session.update = true
          req.body.redirectMethodPost ? res.redirect(307, 'back') : res.redirect('back')
        }
      })
  },
  remove: (req, res) => {
    Tweet
      .findByIdAndRemove(req.body.tweetId, (err, tweet) => {
        if (err) {
          console.log(err)
          res.render('home/index', {globalError: 'Error when delete tweet!!!'})
        } else {
          User
            .findByIdAndUpdate(tweet.author, {$pull: {tweets: tweet._id}}, (err) => {
              if (err) {
                console.log(err)
                res.render('home/index', {globalError: 'Error when delete tweet and remove it from User data!!!'})
              } else {
                User
                  .update({'username': {$in: tweet.userHandles}}, {$pull: {tweets: tweet._id}}, {multi: true}, (err) => {
                    if (err) {
                      console.log(err)
                      res.render('home/index', {globalError: 'Error when create tweet and add it to User data!!!'})
                    } else {
                      tweet.tags.forEach((tag) => {
                        Tag
                          .findByIdAndUpdate(
                            tag,
                            {_id: tag, $pull: {tweets: tweet._id}}, (err) => {
                              if (err) {
                                console.log(err)
                                res.render('home/index', {globalError: 'Error when delete tweet and remove it from Tags data!!!'})
                              } else {
                              }
                            })
                      })
                      res.redirect('/')
                    }
                  })
              }
            })
        }
      })
  },
  edit: (req, res) => {
    Tweet
      .findById(req.params.tweetId)
      .populate({path: 'author', select: '_id username firstName lastName'})
      .then((tweet) => {
        if (!tweet) {
          res.redirect('/')
        } else {
          res.render('tweets/edit', {tweet: tweet})
        }
      })
  },
  update: (req, res) => {
    let message = req.body.message
    let tweetId = req.body.tweetId
    Tweet.findByIdAndUpdate(tweetId, {'message': message}, (err, oldTweet) => {
      if (err) {
        console.log(err)
        res.render('home/index', {globalError: 'Error when update tweet!!!'})
      } else {
        res.redirect('/')
      }
    })
  }
}
