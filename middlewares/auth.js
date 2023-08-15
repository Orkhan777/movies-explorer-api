const jwt = require('jsonwebtoken');
const ErrorAuth = require('../errors/ErrorAuth');

const { JWT_SECRET = 'development-secret' } = process.env;

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(
      new ErrorAuth(
        'Необходима авторизация!',
      ),
    );
  }
  req.user = payload;
  next();
};

module.exports = { auth };
