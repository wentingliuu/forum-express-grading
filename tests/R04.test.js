const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const should = chai.should()

const db = require('../models')
const helpers = require('../_helpers')
const { createModelMock, createControllerProxy, mockRequest, mockResponse } = require('../helpers/unitTestHelpers')

// 建立模擬的 Like 資料
let mockLikeData = [
  {
    UserId: 1,
    RestaurantId: 2
  }
]

describe('# R04: Like / Unlike', function () {
  context('# Q1: 使用者可以 Like 餐廳', () => {
    before(() => {
      // 模擬登入驗證
      this.ensureAuthenticated = sinon
        .stub(helpers, 'ensureAuthenticated')
        .returns(true)
      this.getUser = sinon.stub(helpers, 'getUser').returns({ id: 1 })

      // 建立了一個模擬的 Like table，裡面目前是空的
      this.mockLikeData = []
      this.likeMock = createModelMock('Like', null, this.mockLikeData)

      // 連向模擬的 Like table
      this.userController = createControllerProxy('../controllers/userController', { Like: this.likeMock })
    })

    it(' POST /like/:restaurantId ', async () => {
      // 模擬 request & response
      const req = mockRequest({ params: { restaurantId: 2 } }) // 帶入 params.restaurantId = 2，對 POST /like/2 發出請求
      const res = mockResponse()

      // 測試 userController.addLike 函式
      await this.userController.addLike(req, res)
      // 將模擬的 Like table 內的資料全數撈出
      const likes = await this.likeMock.findAll()
      // addLike 執行完畢後，Like table 應會從空的 -> 變成有 1 筆資料
      likes.should.have.lengthOf(1)
      // 資料裡的 UserId 應該會跟我們傳入的 user id 一樣
      likes[0].UserId.should.equal(1)
      // 資料裡的 RestaurantId 會跟我們傳入的 params.restaurantId 一樣
      likes[0].RestaurantId.should.equal(2)
    })

    after(async () => {
      // 清除驗證資料
      this.ensureAuthenticated.restore()
      this.getUser.restore()
    })
  })

  context('# Q1: 使用者可以 unLike 餐廳', () => {
    before(() => {
      // 模擬登入驗證
      this.ensureAuthenticated = sinon
        .stub(helpers, 'ensureAuthenticated')
        .returns(true)
      this.getUser = sinon.stub(helpers, 'getUser').returns({ id: 1 })
      // 製作假資料
      // 下個 context 會用這筆資料進行測試
      // 模擬 Like table 裡目前有 1 筆資料如下
      this.likeMock = createModelMock('Like', {
        id: 1,
        UserId: 1,
        RestaurantId: 2
      }, mockLikeData)

      // 連向模擬的 Like table
      this.userController = createControllerProxy('../controllers/userController', { Like: this.likeMock })
    })

    it(' DELETE /like/:restaurantId ', async () => {
      // 模擬 request & response
      // 模擬發出 request, 帶入 params.id = 1, restaurantId = 2
      const req = mockRequest({ params: { id: 1, restaurantId: 2 } }) // 帶入 params.id = 1，對 DELETE /like/2 發出請求
      const res = mockResponse()

      // 測試作業指定的 userController.removeLike 函式
      await this.userController.removeLike(req, res)

      // 將模擬的 Like table 內的資料全數撈出
      const likes = await this.likeMock.findAll()
      // addLike 執行完畢後，Like table 應會從有 1 筆資料 -> 變成空的
      likes.should.have.lengthOf(0)
    })

    after(async () => {
      // 清除模擬驗證資料
      this.ensureAuthenticated.restore()
      this.getUser.restore()
    })
  })
})
