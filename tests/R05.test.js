const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const should = chai.should()

const app = require('../app')
const helpers = require('../_helpers')
const { createModelMock, createControllerProxy, mockRequest, mockResponse } = require('../helpers/unitTestHelpers')

// 模擬 2 間餐廳資料
let mockRestaurantData = [
  {
    id: 1,
    name: 'Restaurant1',
    tel: 'tel',
    address: 'address',
    opening_hours: 'opening_hours',
    description: 'test description',
    favoritedUsers: [
      {
        userId: 1,
      },
    ],
  },
  {
    id: 2,
    name: 'Restaurant2',
    tel: 'tel',
    address: 'address',
    opening_hours: 'opening_hours',
    description: 'description',
    categoryId: 1,
    favoritedUsers: [],
  },
]

describe('# R05: TOP 10 人氣餐廳 ', function () {
  context('# [網址正確、畫面正常執行]', () => {
    before(async () => {
      // 模擬登入驗證
      this.ensureAuthenticated = sinon
        .stub(helpers, 'ensureAuthenticated')
        .returns(true)
      // 模擬 getUser 函式，負責取得使用者資料
      this.getUser = sinon
        .stub(helpers, 'getUser')
        .returns({ id: 1, followings: [], favoritedRestaurants: [] })
    })

    it(' GET /restaurants/top ', (done) => {
      // 對 GET /restaurants/top 發出請求
      request(app)
        .get('/restaurants/top')
        .end(function (err, res) {
          // 回應中應包含字串'Top 10 人氣餐廳'
          // 若請求路徑正確，controller 執行後，會呼叫 res.render
          // res.render 回傳的 view 樣板裡應包含字串'Top 10 人氣餐廳'
          res.text.should.include('Top 10 人氣餐廳') 
          done()
        })
    })

    after(async () => {
      // 清除模擬驗證資料
      this.ensureAuthenticated.restore()
      this.getUser.restore()
    })
  })

  context(
    '# [當你點擊畫面上的「加入最愛 / 移除最愛」按鈕時，會重新計算「收藏數」的數字]',
    () => {
      before(async () => {
        // 模擬登入驗證
        this.ensureAuthenticated = sinon
          .stub(helpers, 'ensureAuthenticated')
          .returns(true)
        // 模擬 getUser 函式，負責取得使用者資料
        this.getUser = sinon
          .stub(helpers, 'getUser')
          .returns({ id: 1, followings: [], favoritedRestaurants: [] })

        // 建立了一個模擬的 Restaurant table，裡面放入 2 間餐廳資料
        this.restaurantMock = createModelMock('Restaurant', null, mockRestaurantData)

        // 連向模擬的 Restaurant table
        this.restController = createControllerProxy('../controllers/restController', {
          Restaurant: this.restaurantMock,
        })

        // 建立了一個模擬的 Favorite table，裡面有 1 筆資料
        this.favoriteMock = createModelMock('Favorite', null, mockRestaurantData, 'FavoritedUsers')

        // 連向模擬的 Favorite table
        this.userController = createControllerProxy('../controllers/userController', {Favorite: this.favoriteMock})
      })

      it(' POST favorite ', async () => {
        // 模擬 request & response
        // 對 POST /favorite/2 發出請求，夾帶 user.favoritedRestaurants
        const req = mockRequest({
          user: { favoritedRestaurants: [] }, 
          params: { restaurantId: 2 },
        })
        const res = mockResponse()

        // 測試 userController.addFavorite 函式
        await this.userController.addFavorite(req, res)

        // 取得餐廳排序資料
        await this.restController.getTopRestaurant(req, res)
        
        // addFavorite 執行完畢後，應呼叫 res.render
        // res.render 的第 2 個參數要包含 restaurants
        // restaurant 當中的第 2 筆資料 favoritedCount 屬性的值應是 1 (被 1 個使用者加入最愛了)
        res.render.getCall(0).args[1].restaurants[1].favoritedCount.should.equal(1)
      })

      it(' DELETE favorite ', async () => {
        // 模擬 request & response
        // 對 DELETE /favorite/1 發出請求，夾入 user.favoritedRestaurants
        const req = mockRequest({
          user: { favoritedRestaurants: [] },
          params: { restaurantId: 1 },
        })
        const res = mockResponse()

        // 測試 userController.removeFavorite 函式
        await this.userController.removeFavorite(req, res)
        // 取得餐廳排序資料
        await this.restController.getTopRestaurant(req, res)

        // removeFavorite 執行完畢後，應呼叫 res.render
        // res.render 的第 2 個參數要包含 restaurants
        // restaurants 當中的第 1 筆資料 id 屬性值應是 2 (id：1 的那家餐廳被刪除了)
        res.render.getCall(0).args[1].restaurants[0].id.should.equal(2)
      })

      after(async () => {
        // 清除模擬驗證資料
        this.ensureAuthenticated.restore()
        this.getUser.restore()
      })
    }
  )
})
