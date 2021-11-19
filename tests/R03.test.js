const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const should = chai.should()

const helpers = require('../_helpers')
const { createModelMock, createControllerProxy, mockRequest, mockResponse } = require('../helpers/unitTestHelpers')

describe('# R03: 餐廳資訊整理：Dashboard', function () {
  context('# [Q1: Dashboard - 1 - controller / view / route]', () => {
    before(async () => {
      // 製作假資料
      // 本 context 會用這筆資料進行測試
      this.UserMock = createModelMock('User', {
        id: 1,
        email: 'root@example.com',
        name: 'admin',
        isAdmin: false
      })
      this.RestaurantMock = createModelMock('Restaurant', {
        id: 1,
        name: '銷魂麵',
        viewCounts: 3
      })
      this.CategoryMock = createModelMock('Category', {
        id: 1,
        name: '食物'
      })
      this.CommentMock = createModelMock('Comment', {
        id: 1,
        text: 'gogogo'
      })

      // 連向模擬的 tables
      this.restController = createControllerProxy('../controllers/restController', { 
        User: this.UserMock,
        Category: this.CategoryMock,
        Restaurant: this.RestaurantMock,
        Comment: this.CommentMock
      })
    })

    it(' GET /restaurants/:id/dashboard ', async () => {
      // 模擬 request & response
      const req = mockRequest({ params: { id: 1 } }) // 帶入 params.id = 1，對 GET /restaurants/1/dashboard 發出請求
      const res = mockResponse()
      // 測試 restController.getDashBoard 函式
      await this.restController.getDashBoard(req, res)

      // getDashBoard 執行完畢後，應呼叫 res.render
      // res.render 的第 1 個參數要是 'dashboard'
      // res.render 的第 2 個參數要包含 restaurant，其 name 屬性的值應是 '銷魂麵'
      // res.render 的地 3 個參數要包含 restaurant，其 viewCounts 值應該是 3
      res.render.getCall(0).args[0].should.equal('dashboard')
      res.render.getCall(0).args[1].restaurant.name.should.equal('銷魂麵')
      res.render.getCall(0).args[1].restaurant.viewCounts.should.equal(3)
    })
  })
})
