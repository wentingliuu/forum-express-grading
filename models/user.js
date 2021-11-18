'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
      User.hasMany(models.Comment)
    }
  };
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User'
  })
  return User
}
