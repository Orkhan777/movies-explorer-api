const router = require('express').Router();

const { userUpdateValid } = require('../middlewares/validations');

const {
  getUser,
  updateUser,
} = require('../controllers/users');

router.get('/me', getUser);

router.patch('/me', userUpdateValid, updateUser);

module.exports = router;
