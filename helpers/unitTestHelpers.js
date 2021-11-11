const SequelizeMock = require('sequelize-mock')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

const dbMock = new SequelizeMock()

const createModelMock = (name, defaultValue, data, joinedTableName) => {
  const mockModel = dbMock.define(name, defaultValue, {
    instanceMethods: {
      update: (changes) => {
        mockModel._defaults = {...changes}
        return Promise.resolve()
      }
    }
  });

  // 模擬 Sequelize 行為
  // 將 mock user db 中的 findByPK 用 findOne 取代 (sequelize mock not support findByPK)
  mockModel.findByPk = (id) => mockModel.findOne({where: {id: id}})
  // 將 count 的 function 預設回傳假資料數目 1
  mockModel.count = () => 1
  // 因為 mock 中的 create 有問題，因此指向 upsert function, 這樣可以在 useHandler 中取得 create 呼叫
  mockModel.create = mockModel.upsert

  // modify middleware
  if (joinedTableName) {
    mockModel.$queryInterface.$useHandler((query, queryOptions) => {
      if (query === 'upsert') {
        // 新增 joinTable 資料到模擬資料
        const {UserId, RestaurantId} = queryOptions[0];
        const restaurant = data.find(d => d.id === RestaurantId)
        restaurant[joinedTableName].push({UserId: UserId});
        return Promise.resolve(data.map(d => mockModel.build(d)))
      } else if (query === 'findAll') {
        // 回傳模擬資料
        if (!data) {
          return mockModel.build([defaultValue]);
        }
        return Promise.resolve( data ? data.map(d => mockModel.build(d)) : [])
      }else if (query === 'destroy') {
        // destroy 可以從 where 取得要刪除的資料
        // 因此就可以模擬將模擬資料中的資料刪除
        // 刪除模擬資料中的某一筆 joinTable 資料
        const {UserId, RestaurantId} = queryOptions[0].where;
        const restaurant = data.find(d => d.id === RestaurantId)
        restaurant[joinedTableName] = restaurant[joinedTableName].filter(d => !(d.UserId === UserId))
        return Promise.resolve(data.map(d => mockModel.build(d)))
      }
    });
  } else {
    mockModel.$queryInterface.$useHandler((query, queryOptions,done) => {
      if (query === 'upsert') {
        // create 時會帶 userId 跟 restaurantId (ex: Like.create({ userId: 1, restaurantId: 2}))
        const {UserId, RestaurantId} = queryOptions[0]
        
        // 新增這個 Like 的資訊到模擬資料裡
        data.push({ UserId, RestaurantId })
        
        // 回傳模擬資料
        return Promise.resolve(mockModel.build(data))
      } else if (query === 'findAll') {
        // 回傳模擬資料
        if (!data) {
          return mockModel.build([defaultValue]);
        }
        return Promise.resolve(data ? data.map(d => mockModel.build(d)) : [])
      } else if (query === 'destroy') {
        // destroy 可以從 where 取得要刪除的資料
        // 因此就可以模擬將模擬資料中的資料刪除
        const {UserId, RestaurantId} = queryOptions[0].where
        data = data.filter(d => !(d.UserId === UserId && d.RestaurantId === RestaurantId))
  
        return Promise.resolve(mockModel.build(data))
      }
    });
  }

  return mockModel;
}

const createControllerProxy = (path, model) => {
  const controller = proxyquire(path, {
    '../models': model
  });

  return controller;
}

const mockRequest = (query) => {
  return {
    ...query,
    flash: sinon.spy(),
  }
}
const mockResponse = () => {
  return {
    redirect: sinon.spy(),
    render: sinon.spy(),
  }
}

module.exports = {
  createModelMock,
  createControllerProxy,
  mockRequest,
  mockResponse
}