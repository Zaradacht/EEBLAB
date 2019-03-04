const validateSignupInput = require("../middleware/validation/signup");
const validateLoginInput = require("../middleware/validation/login");
const validateUserSignupInput = require("../middleware/validation/userSignup");
const validateUserUpdateInput = require("../middleware/validation/userUpdate");

exports.validateSignup = (req, res, next) => {
  const { data, errors, isValid } = validateSignupInput(req.body);
  if (!isValid) {
    // res.locals.errors = errors;
    // console.log("res.locals.errors: " + res.locals.errors);
    req.flash("error", "An error occured");
    return res.render("user/auth/signup", { errors });
  } else {
    res.locals = { ...data };
    next();
  }
};

exports.validateLogin = (req, res, next) => {
  const { data, errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    res.locals.errors = errors;
    return res.status(403).json({ errors: res.locals.errors });
  } else {
    res.locals = { ...data };
    next();
  }
};

exports.validateUserRegister = (req, res, next) => {
  const { data, errors, isValid } = validateUserSignupInput(req.body);
  if (!isValid) {
    req.flash("error", "Validation error");
    return res.redirect("back");
  } else {
    res.locals = { ...data };
    next();
  }
};

exports.validateUserUpdate = (req, res, next) => {
  const { data, errors, isValid } = validateUserUpdateInput(req.body);
  if (!isValid) {
    req.flash("error", "Validation error");
    return res.redirect("back");
  } else {
    res.locals = { ...data };
    next();
  }
};
