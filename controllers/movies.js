const Movies = require('../models/movie');
const ErrorBadRequest = require('../errors/ErrorBadRequest');
const ErrorForbidden = require('../errors/ErrorForbidden');
const ErrorNotFound = require('../errors/ErrorNotFound');

const getMovies = (req, res, next) => {
  const userId = req.user._id;
  Movies.find({ owner: userId })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

const createMovies = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;
  Movies.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    owner,
    nameRU,
    nameEN,
  })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ErrorBadRequest('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

const deleteMovies = (req, res, next) => {
  const { id } = req.params;
  Movies.findById(id)
    .orFail(() => next(new ErrorNotFound('Фильм не найден')))
    .then((movie) => {
      if (req.user._id !== movie.owner.toString()) {
        next(new ErrorForbidden('У вас нет прав на удаление данного фильма'));
      } else {
        Movies.findByIdAndRemove(id)
          .then(() => {
            res.send({ message: 'Фильм успешно удален' });
          })
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ErrorBadRequest('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = { createMovies, getMovies, deleteMovies };
