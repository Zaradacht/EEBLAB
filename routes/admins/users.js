const router = require("express").Router();

// @route   GET /users/
// @desc    Show users page
// @access  Private

// @route   GET /users/:id
// @desc    Show a user page /// NOT OBLIGATORY.
// @access  Public

// @route   GET /users/register
// @desc    Show users register page
// @access  Private

// @route   POST /users
// @desc    Create a new user
// @access  Private

// @route   GET /users/:id/edit
// @desc    Show users edit page
// @access  Private

// @route   PUT /users/:id
// @desc    Update an existing user
// @access  Private

// @route   DEL /users/:id
// @desc    delete an existing user
// @access  Private

module.exports = router;
