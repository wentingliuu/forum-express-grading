const restService = require('../../services/restService')

const restController = {
  getRestaurants: (req, res) => {
    restService.getRestaurants(req, res, data => {
      return res.json(data)
    })
  },
  getRestaurant: (req, res) => {
    restService.getRestaurant(req, res, data => {
      return res.json(data)
    })
  },
  getFeeds: (req, res) => {
    restService.getFeeds(req, res, data => {
      return res.json(data)
    })
  },
  getDashBoard: (req, res) => {
    restService.getDashBoard(req, res, data => {
      return res.json(data)
    })
  },
  getTopRestaurant: (req, res) => {
    restService.getTopRestaurant(req, res, data => {
      return res.json(data)
    })
  }
}

module.exports = restController
