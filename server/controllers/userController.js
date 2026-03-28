const User = require('../models/User');
const { validateUserData } = require('../models/validation');

/**
 * Get all users
 */
async function getAllUsers(req, res) {
  try {
    const users = User.getAllUsers();
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
      count: users.length
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      error: error.message
    });
  }
}

/**
 * Create a new user
 */
async function createUser(req, res) {
  try {
    const userData = {
      fullName: req.body.fullName?.trim(),
      email: req.body.email?.trim().toLowerCase(),
      phone: req.body.phone?.trim(),
      address: req.body.address?.trim(),
      city: req.body.city?.trim(),
      state: req.body.state?.trim(),
      country: req.body.country?.trim(),
      zipCode: req.body.zipCode?.trim(),
      notes: req.body.notes?.trim() || ''
    };

    // Validate input
    const validation = validateUserData(userData);

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    // Add user to storage
    const newUser = User.addUser(userData);

    res.status(201).json({
      success: true,
      message: 'User added successfully',
      data: newUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message
    });
  }
}

module.exports = {
  getAllUsers,
  createUser
};
