const router = require('express').Router();

const { createMovies, getMovies, deleteMovies } = require('../controllers/movies');

const { movieValid, movieIdValid } = require('../middlewares/validations');

router.get('/', getMovies);

router.post('/', movieValid, createMovies);

router.delete('/:id', movieIdValid, deleteMovies);

module.exports = router;
