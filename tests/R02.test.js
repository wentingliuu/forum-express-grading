const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const should = chai.should()

const helpers = require('../_helpers');

const { createModelMock, createControllerProxy, mockRequest, mockResponse } = require('../helpers/unitTestHelpers');

describe('# R02', () => {
  describe('# R02: 建立 User Profile', function () {
    context('# [瀏覽 Profile]', () => {
      // 前置準備
      before(() => {
        // 模擬登入驗證
        this.ensureAuthenticated = sinon
          .stub(helpers, 'ensureAuthenticated')
          .returns(true)
        this.getUser = sinon.stub(helpers, 'getUser').returns({ id: 1 })
       // 製作假資料
       // 本 context 會用這筆資料進行測試
        this.UserMock = createModelMock('User', {
          id: 1,
          email: 'root@example.com',
          name: 'admin',
          isAdmin: false,
        })

        // 修改 userController 中的資料庫連線設定，由連向真實的資料庫 -> 改為連向模擬的 User table
        this.userController = createControllerProxy('../controllers/userController', { User: this.UserMock })
      })

      // 開始測試
      it(' GET /users/:id ', async () => {
        // 模擬 request & response
        const req = mockRequest({ params: { id: 1 } }) // 帶入 params.id = 1，對 GET /users/1 發出請求
        const res = mockResponse()

        // 測試作業指定的 userController.getUser 函式
        await this.userController.getUser(req, res)

        // toggleAdmin 執行完畢後，應呼叫 res.render
        // res.render 的第 1 個參數要是 'profile' 
        // res.render 的第 2 個參數要是 user，其 name 屬性的值應是 'admin'
        res.render.getCall(0).args[0].should.equal('profile')
        res.render.getCall(0).args[1].user.name.should.equal('admin')
      })
      
      // 測試完畢，清除資料
      after(async () => {
        // 清除模擬驗證資料
        this.ensureAuthenticated.restore()
        this.getUser.restore()
      })
    })

    context('# [瀏覽編輯 Profile 頁面]', () => {
      before(() => {
        // 模擬登入驗證
        this.ensureAuthenticated = sinon
          .stub(helpers, 'ensureAuthenticated')
          .returns(true)
        this.getUser = sinon.stub(helpers, 'getUser').returns({ id: 1 })

        // 製作假資料
        // 本 context 會用這筆資料進行測試
        this.UserMock = createModelMock('User', {
          id: 1,
          email: 'root@example.com',
          name: 'admin',
          isAdmin: false,
        })

        // 連向模擬的 User table
        this.userController = createControllerProxy('../controllers/userController', { User: this.UserMock })
      })

      it(' GET /users/:id/edit ', async () => {
        // 模擬 request & response
        const req = mockRequest({ params: { id: 1 } }) // 帶入 params.id = 1，對 GET /users/1/edit 發出請求
        const res = mockResponse()

        // 測試作業指定的 adminController.editUser 函式
        await this.userController.editUser(req, res)

        // editUser 執行完畢後，應呼叫 res.render
        // res.render 的第 1 個參數要是 'edit' 
        // res.render 的第 2 個參數要是 user，其 name 屬性的值應是 'admin'
        res.render.getCall(0).args[0].should.equal('edit')
        res.render.getCall(0).args[1].user.name.should.equal('admin')
      })

      after(async () => {
        // 清除模擬驗證資料
        this.ensureAuthenticated.restore()
        this.getUser.restore()
      })
    })

    context('# [編輯 Profile]', () => {
      before(async () => {
        // 模擬登入驗證
        this.ensureAuthenticated = sinon
          .stub(helpers, 'ensureAuthenticated')
          .returns(true)
        this.getUser = sinon.stub(helpers, 'getUser').returns({ id: 1 })
        // 製作假資料
        // 本 context 會用這筆資料進行測試
        this.UserMock = createModelMock(
          'User',
          {
            id: 1,
            email: 'root@example.com',
            name: 'admin',
            isAdmin: false,
          }
        )

        // 連向模擬的 User table
        this.userController = createControllerProxy('../controllers/userController', { User: this.UserMock })
      })

      it(' PUT /users/:id ', async () => {
        // 模擬 request & response 
        // 對 PUT /users/1 發出 request，並夾帶 body.name = amdin2, body.email = admin_test@gmail.com
        const req = mockRequest({
          params: { id: 1 },
          body: { name: 'admin2', email: 'admin_test@gmail.com' },
        }) 
        const res = mockResponse()

        // 測試作業指定的 userController.putUser 函式
        await this.userController.putUser(req, res)

        // putUser 正確執行的話，應呼叫 req.flash 
        // req.flash 的參數應與下列字串一致
        req.flash.calledWith('success_messages','使用者資料編輯成功').should.be.true
        // putUser 執行完畢後，應呼叫 res.redirect 並重新導向 /users/1
        res.redirect.calledWith('/users/1').should.be.true
        // putUser 執行完畢後，id:1 使用者的 name 和 email 應該已被修改 
        // 將假資料撈出，比對確認有成功修改到
        const user = await this.UserMock.findOne({ where: { id: 1 } })
        user.name.should.equal('admin2')
        user.email.should.equal('admin_test@gmail.com')
      })

      after(async () => {
        // 清除模擬驗證資料
        this.ensureAuthenticated.restore()
        this.getUser.restore()
      })
    })
  })
})
