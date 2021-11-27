const db = require('../models')
const Category = db.Category

const categoryService = {
  getCategories: (req, res, cb) => {
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id)
          .then((category) => {
            cb({
              categories: categories,
              category: category.toJSON()
            })
          })
      } else {
        cb({ categories })
      }
    })
  },
  postCategory: (req, res, cb) => {
    if (!req.body.name) {
      return cb({ status: 'error', message: "name didn't exist" })
    } else {
      return Category.create({
        name: req.body.name
      })
        .then((category) => {
          cb({ status: 'success', message: 'category was successfully created' })
        })
    }
  },
  putCategory: (req, res, cb) => {
    if (!req.body.name) {
      return cb({ status: 'error', message: "name didn't exist" })
    } else {
      return Category.findByPk(req.params.id)
        .then((category) => {
          category.update(req.body)
            .then((category) => {
              cb({ status: 'success', message: 'category was successfully updated' })
            })
        })
    }
  }
}

module.exports = categoryService
