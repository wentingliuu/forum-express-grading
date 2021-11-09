const restController = require('../controllers/restController.js')

module.exports = app => {
  app.get('/', (req, res) => res.redirect('/restaurants'))
  app.get('/restaurants', restController.getRestaurants)
}
