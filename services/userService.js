const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const helpers = require('../_helpers')
const bcrypt = require('bcryptjs')

const { User, Comment, Restaurant, Favorite, Like, Followship } = require('../models')

const userController = {
  signUp: (req, res, cb) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      return cb({ status: 'error', message: '密碼與確認密碼不相同！' })
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          return cb({ status: 'error', message: '此信箱已註冊過！' })
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            return cb({ status: 'success', message: '成功註冊帳號！' })
          })
        }
      })
    }
  },
  getUser: (req, res, cb) => {
    return User.findByPk(req.params.id, {
      include: [
        Comment,
        { model: Restaurant, as: 'FavoritedRestaurants' },
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ]
    })
      .then(user => {
        const filteredRestId = [...new Set(user.Comments.map(comment => comment.RestaurantId))]
        Restaurant.findAll({ raw: true, nest: true, where: { id: filteredRestId }, attributes: ['id', 'image'] })
          .then(CommentedRest => {
            user = {
              ...user.toJSON(),
              identify: (Number(req.params.id) === Number(helpers.getUser(req).id)),
              CommentedRest: CommentedRest
            }
            cb({ user })
          })
      })
  },
  putUser: (req, res, cb) => {
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id)
          .then(user => {
            user.update({
              name: req.body.name,
              email: req.body.email,
              image: file ? img.data.link : user.image
            })
              .then(() => {
                cb({ status: 'success', message: '使用者資料編輯成功' })
              })
          })
      })
    } else {
      return User.findByPk(req.params.id)
        .then(user => {
          user.update({
            name: req.body.name,
            email: req.body.email,
            image: user.image
          }).then(() => {
            cb({ status: 'success', message: '使用者資料編輯成功' })
          })
        })
    }
  },
  addFavorite: (req, res, cb) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then((restaurant) => {
        return cb({ status: 'success', message: '' })
      })
  },
  removeFavorite: (req, res, cb) => {
    return Favorite.destroy({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((restaurant) => {
        return cb({ status: 'success', message: '' })
      })
  },
  addLike: (req, res, cb) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    })
      .then((restaurant) => {
        return cb({ status: 'success', message: '' })
      })
  },
  removeLike: (req, res, cb) => {
    return Like.destroy({
      where: {
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((restaurant) => {
        return cb({ status: 'success', message: '' })
      })
  },
  getTopUser: (req, res, cb) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return cb({ users })
    })
  },
  addFollowing: (req, res, cb) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    })
      .then((followship) => {
        return cb({ status: 'success', message: '' })
      })
  },
  removeFollowing: (req, res, cb) => {
    return Followship.destroy({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then((followship) => {
        return cb({ status: 'success', message: '' })
      })
  }
}

module.exports = userController
