const validateSignupInput = require("../middleware/validation/signup");
const validateLoginInput = require("../middleware/validation/login");

exports.validateSignup = (req, res, next) => {
  const { data, errors, isValid } = validateSignupInput(req.body);
  if (!isValid) {
    // res.locals.errors = errors;
    // console.log("res.locals.errors: " + res.locals.errors);
    req.flash("error", errors);
    return res.redirect("back");
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
