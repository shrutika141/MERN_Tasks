const { Cart, Product, User } = require("../models");

exports.getCartItems = async (req, res) => {
  try {
    const cartItems = await Cart.findAll({
      where: { userId: req.params.id },
      include: [{ model: Product, as: "product" }],
    });
    res.status(200).send({
      status: 200,
      data: cartItems,
    });
  } catch (error) {
    console.log('error', error)
    res.status(500).send("Error fetching cart items");
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, userId } = req.body;

    const existingCartItem = await Cart.findOne({
      where: { userId: userId, productId },
    });

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
    } else {
      await Cart.create({ userId: userId, productId, quantity });
    }

    res.status(200).send({
      status: 200,
      message: "Product added to cart",
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Error adding product to cart");
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    await Cart.destroy({ where: { id, userId: req.query.userid } });
    res.status(200).send({
      status: 200,
      data: 'Product removed from cart',
    });
  } catch (error) {
    res.status(500).send("Error removing product from cart");
  }
};
