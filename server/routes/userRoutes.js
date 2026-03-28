const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

/**
 * User Routes
 */

// GET /api/users - Fetch all users
router.get('/', userController.getAllUsers);

// POST /api/users - Create a new user
router.post('/', userController.createUser);

module.exports = router;
