let Tag = require('mongoose').model('Tag')

module.exports = {
  list: (req, res) => {
    Tag
      .find()
      .then((tags, err) => {
        if (err) {
          console.log(err)
        } else {
          res.render('tags/list', {tags: tags})
        }
      })
  },
  listTweets: (req, res) => {
    let tagName = req.params.tag
    Tag
      .findOne({'_id': tagName})
      .populate({path: 'tweets', options: {sort: { 'createdOn': -1 }}})
      .sort({createdOn: -1})
      .slice('tweets', -100)
      .then((tag, err) => {
        if (err) {
          console.log(err)
        } else {
          tag.tweets.forEach((tweet) => {
            tweet.views++
            tweet.save()
          })
          res.render('tweets/list', {tweets: tag.tweets, tag: tagName})
        }
      })
  }
}
