const express = require('express');
const router = express.Router();

const checkAuth = require('../auth/check-auth.js');

const UserController = require('../controllers/user');

// routes

router.get('/', UserController.get_all_users);

router.get('/:userId', UserController.get_single_user);

router.post('/signup', UserController.user_registration);

router.post('/login', UserController.user_login);

router.post('/', UserController.create_new_user_deprecated);

router.patch('/:userId', UserController.update_user);

router.delete('/:userId', checkAuth, UserController.delete_user);

module.exports = router;