const LocalStrategy = require("passport-local").Strategy;

const Admin = require("../models/Admin");
const User = require("../models/User");

module.exports = passport => {
  passport.use(
    "admin",
    new LocalStrategy((username, password, done) => {
      // attempt to authenticate user
      Admin.getAuthenticated(username, password, (err, user, reason) => {
        if (err) {
          done(err);
        }
        // login was successful if we have a user
        if (user) {
          return done(null, user);
        } else {
          // otherwise we can determine why we failed
          const reasons = Admin.failedLogin;
          const errors = {};
          //   console.log("reason: " + reason);
          //   console.log("reasons.NOt_FOUND" + reasons.NOT_FOUND);
          //   console.log(reasons.NOT_FOUND === reason);
          switch (reason) {
            case reasons.NOT_FOUND:
              errors.reason = "Account not found.";
              break;
            case reasons.PASSWORD_INCORRECT:
              errors.reason = "Password is incorrect.";
              break;
            case reasons.MAX_ATTEMPTS:
              errors.reason = "Max attempts reached.";
              break;
          }
          //   console.log("errors.reason: " + errors.reason);
          return done(null, false, { message: errors.reason });
        }
      });
    })
  );
  passport.use(
    "user",
    new LocalStrategy((username, password, done) => {
      // attempt to authenticate user
      User.getAuthenticated(username, password, (err, user, reason) => {
        if (err) {
          done(err);
        }
        // login was successful if we have a user
        if (user) {
          return done(null, user);
        } else {
          // otherwise we can determine why we failed
          const reasons = Admin.failedLogin;
          const errors = {};
          //   console.log("reason: " + reason);
          //   console.log("reasons.NOt_FOUND" + reasons.NOT_FOUND);
          //   console.log(reasons.NOT_FOUND === reason);
          switch (reason) {
            case reasons.NOT_FOUND:
              errors.reason = "Account not found.";
              break;
            case reasons.PASSWORD_INCORRECT:
              errors.reason = "Password is incorrect.";
              break;
          }
          //   console.log("errors.reason: " + errors.reason);
          return done(null, false, { message: errors.reason });
        }
      });
    })
  );
  passport.serializeUser((user, done) => {
    // console.log(
    //   "Inside SerializeUser: user looks like: " +
    //     user +
    //     "and user.id looks like: " +
    //     user.id
    // );
    console.log("Inside [serializeUser]");
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    console.log("Inside [deserializeUser]");
    Admin.findById(id, (err, user) => {
      if (err) {
        done(err);
      }
      if (user) {
        done(null, user);
      } else {
        User.findById(id, (err, user) => {
          if (err) {
            done(err);
          } else {
            done(err, user);
          }
        });
      }
    });
  });
};
