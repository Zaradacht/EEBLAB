var express = require("express");
var router = express.Router();

// userController import
const userController = require("../controllers/userController");
const userValidation = require("../middleware/userValidation");

// import middleware
const middleware = require("../middleware");

// @route   GET /
// @desc    Show index page
// @access  Public
router.get("/", (req, res, next) => res.render("landing"));

// @route   GET /signup
// @desc    Show the user signup page
// @access  Public
router.get("/signup", (req, res, next) => res.render("auth/signup"));

// @route   POST /signup
// @desc    Create a new user
// @access  Public
router.post("/signup", userValidation.validateSignup, userController.signup);

// @route   GET /login
// @desc    Show the login page
// @access  Public
router.get("/login", (req, res) => {
  if (req.user) {
    return res.redirect("/");
  } else {
    return res.render("auth/login");
  }
});

// @route   POST /logout
// @desc    Logout a user
// @access  Public
router.post("/login", userValidation.validateLogin, userController.login);

// @route   POST /logout
// @desc    Logout a user
// @access  Private
router.get("/logout", middleware.isLoggedIn, userController.logout);

module.exports = router;
