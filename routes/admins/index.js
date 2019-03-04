var express = require("express");
var router = express.Router();

// userController import
const adminController = require("../../controllers/adminController");
const adminValidation = require("../../middleware/adminValidation");

// import middleware
const middleware = require("../../middleware");

// @route   GET /
// @desc    Show index page
// @access  Public
router.get("/", middleware.isAdmin, (req, res, next) =>
  res.render("admin/landing")
);

// @route   GET /admins/dashboard : done
// @desc    Show dashboard page
// @access  Public
router.get("/dashboard", middleware.isAdmin, (req, res, next) =>
  res.render("admin/dashboard")
);

// @route   GET /signup
// @desc    Show the user signup page
// @access  Public
router.get("/signup", middleware.isAdmin, (req, res, next) =>
  res.render("admin/auth/signup")
);

// @route   POST /signup
// @desc    Create a new user
// @access  Public
router.post(
  "/signup",
  middleware.isAdmin,
  adminValidation.validateSignup,
  adminController.signup
);

// @route   GET /login
// @desc    Show the login page
// @access  Public
router.get("/login", (req, res) => {
  if (req.user) {
    return res.redirect("/admins/");
  } else {
    return res.render("admin/auth/login");
  }
});

// @route   POST /logout
// @desc    Logout a user
// @access  Public
router.post("/login", adminValidation.validateLogin, adminController.login);

// @route   POST /logout
// @desc    Logout a user
// @access  Private
router.get("/logout", middleware.isAdmin, adminController.logout);

module.exports = router;
