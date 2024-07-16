'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
      Order.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product',
      });
    }
  }
  Order.init({
    userId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    totalAmount: DataTypes.FLOAT,
    status: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};