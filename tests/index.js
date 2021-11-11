const request = require('supertest')

const app = require('../app')

describe('# 測試環境初始化', function () {
  context('# First Test Case', () => {
    it(' GET /admin/users ', (done) => {
      request(app)
        .get('/')
        .end(function (err, res) {
          done()
        })
    })
  })
})
