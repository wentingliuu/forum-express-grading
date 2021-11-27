const db = require('../../models')
const Category = db.Category

const categoryService = require('../../services/categoryService')

const categoryController = {
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, data => {
      return res.json(data)
    })
  },
  postCategory: (req, res) => {
    categoryService.postCategory(req, res, (data) => {
      return res.json(data)
    })
  },
  putCategory: (req, res) => {
    categoryService.putCategory(req, res, (data) => {
      return res.json(data)
    })
  },
  deleteCategory: (req, res) => {
    categoryService.deleteCategory(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = categoryController
