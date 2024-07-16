const { Order, Cart, Product, User } = require('../models');

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.query.userId },
      include: [{ model: Product, as: 'product' }],
    });
    res.status(200).send({
      status: 200,
      data: orders,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: 'Error fetching orders',
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, as: 'user' },
        { model: Product, as: 'product' },
      ],
    });
    
    res.status(200).send({
      status: 200,
      data: orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send({
      status: 500,
      message: 'Error fetching orders',
    });
  }
};


exports.placeOrder = async (req, res) => {
  try {
    const cartItems = await Cart.findAll({
      where: { userId: req.query.userId },
      include: [{ model: Product, as: 'product' }],
    });

    if (!cartItems.length) {
      return res.status(400).send({
        status: 400,
        message: 'No items in the cart',
      });
    }

    const orders = cartItems.map((item) => ({
      userId: req.query.userId,
      productId: item.productId,
      quantity: item.quantity,
      totalAmount: item.quantity * item.product.amount,
    }));

    await Order.bulkCreate(orders);

    await Cart.destroy({ where: { userId: req.query.userId } });

    res.status(200).send({
      status: 200,
      message: 'Order placed successfully',
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: 'Error fetching orders',
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: Product, as: 'product' },
        { model: User, as: 'user' }
      ]
    });
    if (order) {
      res.status(200).send({
        status: 200,
        data: order,
      });
    } else {
      res.status(400).send({
        status: 400,
        message: 'Order not found',
      });
    }
  } catch (error) {
    console.log('error', error)
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (order) {
      order.status = status;
      await order.save();
      res.status(200).send({
        status: 200,
        data: order,
      });
    } else {
      res.status(400).send({
        status: 400,
        message: 'Order not found',
      });
    }
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.message,
    });
  }
};

