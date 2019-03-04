const TempUser = require("../models/TempUser");
const passport = require("passport");

exports.signupForm = (req, res, next) => {
  let errors = {};
  const data = { ...res.locals };
  const newTempUser = new TempUser({
    ...data
  });
  TempUser.findOne({
    $or: [{ username: data.username }, { email: data.email }]
  })
    .then(user => {
      if (user != null) {
        if (user.username == data.username) {
          errors.username = "The username is already used";
          req.flash("error", "Username Already in use");
        } else if (user.email == data.email) {
          errors.email = "email is already used.";
          req.flash("error", "Email Already in use");
        }
        return res.redirect("back");
      } else {
        // Submit the request.
        newTempUser
          .save()
          .then(usr => {
            req.flash(
              "success",
              "Your request is submitted successfully, The process might take 0 to several days."
            );
            return res.redirect("/");
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

exports.loginUser = (req, res, next) => {
  let errors = {};
  const data = { ...res.locals };
  console.log("[loginUserController] req.user = " + req.user);
  if (req.user) {
    req.flash(
      "error",
      "Can't GET the authentication page, you are already logged in"
    );
    return res.redirect("back");
  } else {
    passport.authenticate(
      "user",
      { failureRedirect: "/" },
      (err, user, info) => {
        if (err) {
          // console.log("Triggered[err]");
          return next(err);
        }
        if (user) {
          // console.log("Triggered[user]");
          // console.log(
          //   "What user looks like after authentication passport: " + user
          // );
          req.logIn(user, function(err) {
            if (err) {
              return next(err);
            }
            req.flash("success", "Succesfuly logged in");
            return res.redirect("/users");
          });
          // return next(null, user);
        }
        if (info) {
          req.flash("error", info.message);
          return res.redirect("back");
        }
      }
    )(req, res, next);
  }
};
