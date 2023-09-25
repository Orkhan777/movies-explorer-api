const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ErrorBadRequest = require('../errors/ErrorBadRequest');
const ErrorAuth = require('../errors/ErrorAuth');
const ErrorConflict = require('../errors/ErrorConflict');

const { JWT_SECRET = 'development-secret' } = process.env;

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ErrorBadRequest('Введены некорректные данные'));
      } else if (err.code === 11000) {
        next(
          new ErrorConflict('Пользователь с таким email уже зарегистрирован'),
        );
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .orFail(() => next(
      new ErrorAuth('Пользователя с таким email или паролем не существует'),
    ))
    .then((user) => {
      bcrypt.compare(password, user.password).then((isValidUser) => {
        if (isValidUser) {
          const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
            expiresIn: '7d',
          });
          res
            .status(200)
            .cookie('jwt', token, {
              maxAge: 3600000 * 24 * 7,
              sameSite: 'None',
              secure: true,
              httpOnly: true,
            })
            .send(user);
          next(); // Сбрасываем ошибку при успешной аутентификации
        } else {
          next(new ErrorAuth('Ошибка авторизации'));
        }
      });
    })
    .catch((err) => {
      if (err.name === 'ErrorAuth') {
        // Очистить ошибку, если это ошибка авторизации
        next();
      } else {
        next(err);
      }
    });
};

const getSignout = (req, res, next) => {
  res
    .status(202)
    .clearCookie('jwt', {
      sameSite: 'None',
      secure: true,
      httpOnly: true,
    })
    .send({ message: 'cookie cleared' });
  next(); // Сбрасываем ошибку при выходе пользователя
};

const getUser = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ErrorBadRequest('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const id = req.user._id;
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    id,
    { email, name },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ErrorBadRequest('Введены некорректные данные'));
      } else if (err.code === 11000) {
        next(
          new ErrorConflict('Пользователь с таким email уже зарегистрирован'),
        );
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser, login, getSignout, getUser, updateUser,
};
