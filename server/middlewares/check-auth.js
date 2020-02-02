const jwt = require('jsonwebtoken');
const { errors, jsonError, jsonSuccess } = require("../utils/system");
const User = require('../models/user');

module.exports = async (req, res, next) => {
  try {
    if (req.originalUrl === "/api/v1/user/login" || req.originalUrl === "/api/v1/user/register") {
      next();
    } else {
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, process.env.SECRETE_KEY);
      var decoded = jwt.decode(token, { complete: true });
      const user = await User.findById(decoded.payload.userId);
      req.user = user;
      next();
    }
  } catch (error) {
    next(jsonError('', 'Auth failed! Invalid token', '003'))
  }
};
