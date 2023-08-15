const router = require('express').Router();

const { createMovies, getMovies, deleteMovies } = require('../controllers/movies');

const { movieValidation, movieIdValidation } = require('../middlewares/validations');

router.get('/', getMovies);

router.post('/', movieValidation, createMovies);

router.delete('/:id', movieIdValidation, deleteMovies);

module.exports = router;
