const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return [
    async (req, res, next) => {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).send({ error: 'Access Denied' });
      }

      try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;

        const user = await User.findByPk(req.user.id);
        if (!roles.length || roles.includes(user.role)) {
          next();
        } else {
          res.status(403).send({ error: 'Forbidden' });
        }
      } catch (error) {
        res.status(400).send({ error: 'Invalid Token' });
      }
    },
  ];
};

const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send({ message: 'No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id);
    next();
  } catch (error) {
    return res.status(401).send({ message: 'Unauthorized!' });
  }
};

const roleCheck = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.query.role)) {
      return res.status(403).send({ message: 'Access Denied: You do not have the required role!' });
    }
    next();
  };
};

module.exports = {
  authMiddleware,
  verifyToken,
  roleCheck,
};
