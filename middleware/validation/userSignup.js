const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = validateSignupInput = data => {
  let errors = {};

  data.username = !isEmpty(data.username) ? data.username : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.firstname = !isEmpty(data.firstname) ? data.firstname : "";
  data.lastname = !isEmpty(data.lastname) ? data.lastname : "";
  data.phonenumber = !isEmpty(data.phonenumber) ? data.phonenumber : "";
  data.cin = !isEmpty(data.cin) ? data.cin : "";

  Validator.escape(data.username);
  Validator.escape(data.password);
  Validator.escape(data.password2);
  Validator.escape(data.email);
  Validator.escape(data.firstname);
  Validator.escape(data.lastname);
  Validator.escape(data.phonenumber);
  Validator.escape(data.cin);

  if (Validator.isEmpty(data.username))
    errors.username = "Username field required";
  if (!Validator.isLength(data.username, { min: 5, max: 30 }))
    errors.username = "Username must be between 5 and 30";
  if (Validator.isEmpty(data.password))
    errors.password = "Password field required";
  if (!Validator.isLength(data.password, { min: 6 }))
    errors.password =
      "Password must be at least contain 6 characters and numbers";
  if (!Validator.equals(data.password, data.password2))
    errors.password2 = "Passwords do not match";
  if (Validator.isEmpty(data.email)) errors.email = "Email field required";
  if (!Validator.isEmail(data.email)) errors.email = "Invalid email";
  if (Validator.isEmpty(data.firstname))
    errors.firstname = "Firstname field required";
  if (Validator.isEmpty(data.lastname))
    errors.lastname = "Lastname field required";
  if (Validator.isEmpty(data.phonenumber))
    errors.phonenumber = "Username field required";
  if (Validator.isEmpty(data.cin)) errors.cin = "Cin field required";

  return { data, errors, isValid: isEmpty(errors) };
};
