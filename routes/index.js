const express = require('express');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const { auth } = require('../middlewares/auth');
const { createUser, login, getSignout } = require('../controllers/users');
const { loginValid, checkinValid } = require('../middlewares/validations');
const ErrorNotFound = require('../errors/ErrorNotFound');
const { NOTFOUND_PAGE } = require('../errors/ErrorNotFound');

const routers = express();

routers.post('/signup', checkinValid, createUser);

routers.post('/signin', loginValid, login);

routers.use(auth);

routers.get('/signout', getSignout);
routers.use('/users', usersRouter);
routers.use('/movies', moviesRouter);

routers.use('/*', (req, res, next) => {
  next(new ErrorNotFound(NOTFOUND_PAGE));
});

module.exports = routers;
