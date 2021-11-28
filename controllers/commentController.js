const commentService = require('../services/commentService')

const commentController = {
  postComment: (req, res) => {
    commentService.postComment(req, res, data => {
      if (data['status'] === 'success') {
        return res.redirect(`/restaurants/${req.body.restaurantId}`)
      }
    })
  },
  deleteComment: (req, res) => {
    commentService.deleteComment(req, res, data => {
      if (data['status'] === 'success') {
        return res.redirect('back')
      }
    })
  }
}

module.exports = commentController
