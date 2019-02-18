const Validator = require("validator");
const isEmpty = require("./isEmpty");
module.exports = validateLoginInput = data => {
  let errors = {};

  data.username = !isEmpty(data.username) ? data.username : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  data.username = Validator.escape(data.username);
  data.password = Validator.escape(data.password);

  if (Validator.isEmpty(data.username))
    errors.username = "Username field required";
  if (Validator.isEmpty(data.password))
    errors.password = "Password field required";

  return { data, errors, isValid: isEmpty(errors) };
};
