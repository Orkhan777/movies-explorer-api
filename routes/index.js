const express = require('express');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const { auth } = require('../middlewares/auth');
const { createUser, login, getSignout } = require('../controllers/users');
const { loginValidation, checkinValidation } = require('../middlewares/validations');
const ErrorNotFound = require('../errors/ErrorNotFound');
const { NOTFOUND_PAGE } = require('../errors/ErrorNotFound');

const routers = express();

routers.post('/signup', checkinValidation, createUser);

routers.post('/signin', loginValidation, login);

routers.use(auth);

routers.get('/signout', getSignout);
routers.use('/users', usersRouter);
routers.use('/movies', moviesRouter);

routers.use('/*', (req, res, next) => {
  next(new ErrorNotFound(NOTFOUND_PAGE));
});

module.exports = routers;
