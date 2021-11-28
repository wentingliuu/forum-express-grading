const { Restaurant, Category, User, Comment, Favorite } = require('../models')
const helpers = require('../_helpers')
const pageLimit = 9

const restController = {
  getRestaurants: (req, res, cb) => {
    let offset = 0
    const whereQuery = {}
    let categoryId = ''

    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.categoryId = categoryId
    }

    Restaurant.findAndCountAll({
      include: Category,
      where: whereQuery,
      offset: offset,
      limit: pageLimit
    }).then(result => {
      // data for pagination
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(result.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      // clean up restaurant data
      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 70),
        categoryName: r.Category.name,
        isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id),
        isLiked: req.user.LikedRestaurants.map(l => l.id).includes(r.id)
      }))
      Category.findAll({
        raw: true,
        nest: true
      }).then(categories => {
        cb({ restaurants: data, categories, categoryId, page, totalPage, prev, next })
      })
    })
  },
  getRestaurant: (req, res, cb) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' },
        { model: Comment, include: [User] }
      ]
    })
      .then(restaurant => restaurant.increment('viewCounts'))
      .then(restaurant => {
        const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
        const isLiked = restaurant.LikedUsers.map(l => l.id).includes(req.user.id)
        cb({ restaurant: restaurant.toJSON(), isFavorited, isLiked })
      })
  },
  getFeeds: (req, res, cb) => {
    return Promise.all([
      Restaurant.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [Category]
      }),
      Comment.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant]
      })
    ]).then(([restaurants, comments]) => {
      cb({ restaurants, comments })
    })
  },
  getDashBoard: (req, res, cb) => {
    return Promise.all([
      Restaurant.findByPk(req.params.id, {
        include: [Category]
      }),
      Comment.findAndCountAll({
        where: { RestaurantId: req.params.id },
        raw: true,
        nest: true
      }),
      Favorite.findAndCountAll({
        where: { RestaurantId: req.params.id },
        raw: true,
        nest: true
      })
    ]).then(([restaurant, comments, favorites]) => {
      cb({ restaurant: restaurant.toJSON(), comments, favorites })
    })
  },
  getTopRestaurant: (req, res, cb) => {
    return Restaurant.findAll({
      include: [
        {
          model: User,
          as: 'FavoritedUsers'
        }
      ]
    }).then(restaurants => {
      restaurants = restaurants.map(restaurant => ({
        ...restaurant.dataValues,
        description: restaurant.description.substring(0, 70),
        favoritedCount: restaurant.FavoritedUsers.length,
        isFavorited: restaurant.FavoritedUsers.map(d => d.id).includes(helpers.getUser(req).id)
      }))
        .sort((a, b) => b.favoritedCount - a.favoritedCount).slice(0, 10)
      cb({ restaurant })
    })
  }
}

module.exports = restController
