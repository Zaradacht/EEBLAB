// Import user model
const User = require("../models/User");
const passport = require("passport");

exports.signup = (req, res, next) => {
  let errors = {};
  const data = { ...res.locals };
  User.findOne({
    $or: [{ username: data.username }, { email: data.email }]
  })
    .then(user => {
      if (user != null) {
        if (user.username == data.username) {
          errors.username = "The username is already used";
        } else if (user.email == data.email) {
          errors.email = "email is already used.";
        }
        req.flash("error", {
          errors,
          email: data.email,
          username: data.username
        });
        return res.redirect("back");
      } else {
        // create the user
        const newUser = new User({
          username: data.username,
          password: data.password,
          email: data.email
        });
        newUser
          .save()
          .then(user => {
            req.flash("success", "Successfuly created the account");
            res.redirect("/login");
          })
          .catch(err => {
            console.log(err);
            res.sendStatus(500);
            return;
          });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500);
      return;
    });
};

exports.login = (req, res, next) => {
  let errors = {};
  const data = { ...res.locals };
  if (req.user) {
    req.flash(
      "error",
      "Can't GET the authentication page, you are already logged in"
    );
    return res.render("/", { currentUser: req.user });
  } else {
    passport.authenticate(
      "local",
      { failureRedirect: "/" },
      (err, user, info) => {
        if (err) {
          console.log("Triggered[err]");
          return next(err);
        }
        if (user) {
          console.log("Triggered[user]");
          // console.log(
          //   "What user looks like after authentication passport: " + user
          // );
          req.logIn(user, function(err) {
            if (err) {
              return next(err);
            }
            req.flash("success", "Succesfuly logged in");
            return res.redirect("/");
          });
          // return next(null, user);
        }
        if (info) {
          req.flash("error", info.message);
          res.redirect("back");
        }
      }
    )(req, res, next);
  }
};

exports.logout = (req, res, next) => {
  req.logout();
  req.flash("success", "LOGGED YOU OUT!");
  res.redirect("/");
};
