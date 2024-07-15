const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { User } = require('../models');

dotenv.config();

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });
};

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send({
        status: 400,
        message: 'Email is already registered' 
      });
    }

    const user = await User.create({ username, email, password, role: 'customer' });
    const token = generateToken(user);
    return res.status(200).send({
      status: 200,
      data: user,
      token: token 
    });
  } catch (error) {
    res.status(500).send({ 
      status: 500,
      message: error.message 
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.validPassword(password))) {
      return res.status(403).send({
        status: 403,
        message: 'Invalid email or password' 
      });
    }

    const token = generateToken(user);
    return res.status(200).send({
      status: 200,
      data: user,
      token: token 
    });
  } catch (error) {
    res.status(500).send({ 
      status: 500,
      message: error.message 
    });
  }
};