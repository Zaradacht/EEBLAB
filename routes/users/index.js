const router = require("express").Router();

// middleware
const middleware = require("../../middleware/userValidation");

// user controller
const userController = require("../../controllers/userControllers");

// @route   GET /login
// @desc    Show index page
// @access  Public
router.get("/", (req, res) => res.render("user/landing"));
// @route   GET /login
// @desc    Show index page
// @access  Public
router.get("/login", (req, res) => {
  if (req.user) {
    return res.redirect("/users/");
  } else {
    return res.render("user/auth/login");
  }
});

// @route   POST /login
// @desc    Log-in a new user
// @access  Public
router.post("/login", userController.loginUser);

// @route   GET /signup
// @desc    signup request form
// @access  Public
router.get("/signup", (req, res) => res.render("user/auth/signup"));

// @route   POST /signup
// @desc    process a signup request form
// @access  Public
router.post(
  "/signup",
  middleware.validateUserSignupForm,
  userController.signupForm
);

module.exports = router;
