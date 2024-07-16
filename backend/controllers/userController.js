const { User, Order } = require("../models");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: Order, as: 'orders' }],
    });
    res.status(200).send({
      status: 200,
      data: users,
    });
  } catch (err) {
    res.status(500).send({
      status: 500,
      error: err.message,
    });
  }
};

exports.addUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const addUser = await User.create({ username, email, password, role });
    res.status(200).send({
      status: 200,
      data: addUser,
    });
  } catch (err) {
    res.status(500).send({
      status: 500,
      error: err.message,
    });
  }
};

exports.updateCustomerProfile = async (req, res) => {
  const { username, email, role } = req.body;
  try {
    const user = await User.findByPk(req.params.id);
    if (username) user.username = username;
    if (email) user.email = email;
    if (role) user.role = role;
    await user.save();
    res.status(200).send({
      status: 200,
      data: user,
    });
  } catch (err) {
    res.status(500).send({
      status: 500,
      error: err.message,
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).send({
        status: 404,
        error: 'User not found',
      });
    }
    res.status(200).send({
      status: 200,
      data: user,
    });
  } catch (err) {
    res.status(500).send({
      status: 500,
      error: err.message,
    });
  }
};
