const validateLoginInput = require("./validation/login");
const validateUserSignupInput = require("./validation/userSignup");

exports.validateUserSignupForm = (req, res, next) => {
  const { data, errors, isValid } = validateUserSignupInput(req.body);
  if (!isValid) {
    req.flash("error", "Validation error");
    return res.redirect("back");
  } else {
    res.locals = { ...data };
    next();
  }
};
