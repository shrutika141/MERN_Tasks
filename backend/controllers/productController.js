const { User, Product } = require("../models");

exports.getAllProduct = async (req, res) => {
  try {
    const product = await Product.findAll();
    res.status(200).send({
      status: 200,
      data: product,
    });
  } catch (err) {
    res.status(500).send({
      status: 500,
      error: err.message,
    });
  }
};

exports.addProduct = async (req, res) => {
  const { product_name, product_type, amount, description } = req.body;
  try {
    const addProduct = await Product.create({ product_name, product_type, amount, description });
    res.status(200).send({
      status: 200,
      data: addProduct,
    });
  } catch (err) {
    res.status(500).send({
      status: 500,
      error: err.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  const { product_name, product_type, amount, description } = req.body;
  try {
    const updatedProduct = await Product.findByPk(req.params.id);
    if (product_name) updatedProduct.product_name = product_name;
    if (product_type) updatedProduct.product_type = product_type;
    if (amount) updatedProduct.amount = amount;
    if (description) updatedProduct.description = description;
    await updatedProduct.save();
    res.status(200).send({
      status: 200,
      data: updatedProduct,
    });
  } catch (err) {
    res.status(500).send({
      status: 500,
      error: err.message,
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).send({
        status: 404,
        error: "User not found",
      });
    }
    res.status(200).send({
      status: 200,
      data: product,
    });
  } catch (err) {
    res.status(500).send({
      status: 500,
      error: err.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  await Product.update({ isDeleted: true }, { where: { id } });
  res.sendStatus(204);
};
