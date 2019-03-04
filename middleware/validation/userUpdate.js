const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = validateSignupInput = data => {
  let errors = {};

  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  Validator.escape(data.password);
  Validator.escape(data.password2);

  if (Validator.isEmpty(data.password))
    errors.password = "Password field required";
  if (!Validator.isLength(data.password, { min: 6 }))
    errors.password =
      "Password must be at least contain 6 characters and numbers";
  if (!Validator.equals(data.password, data.password2))
    errors.password2 = "Passwords do not match";

  return { data, errors, isValid: isEmpty(errors) };
};
