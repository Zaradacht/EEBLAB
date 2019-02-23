const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

// const
const SALT_WORK_FACTOR = 10;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000;

// User Schema
const adminSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: Number, // 0 for normal users, 1 admin, 2 super admin,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date
  },
  last_login: {
    type: Date
  },
  loginAttempts: {
    type: Number,
    required: true,
    default: 0
  },
  lockUntil: {
    type: Number
  }
});

// virtuals
adminSchema.virtual("isLocked").get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// define prehooks for the save method
adminSchema.pre("save", function(next) {
  if (!this.isModified("password")) return next();
  if (this.password && this.isModified("password")) {
    bcrypt
      .genSalt(SALT_WORK_FACTOR)
      .then(salt => {
        bcrypt
          .hash(this.password, salt)
          .then(hash => {
            this.password = hash;
            this.updated_at = new Date().toISOString();
            return next();
          })
          .catch(err => next(err));
      })
      .catch(err => next(err));
  }
});

// methods
adminSchema.methods.checkpassword = function(inputPassword, cb) {
  bcrypt
    .compare(inputPassword, this.password)
    .then(isMatch => cb(null, isMatch))
    .catch(err => cb(err));
};

// User model -- cb means callback, er means errback
adminSchema.methods.incLoginAttempts = function(cb) {
  // if we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne(
      { $set: { loginAttempts: 1 }, $unset: { lockUntil: 1 } },
      cb
    );
  }
  // otherwise we're incrementing
  let updates = { $inc: { loginAttempts: 1 } };
  // lock the account if we've reached max attempts and it's not locked already
  if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + LOCK_TIME };
  }
  return this.updateOne(updates, cb);
};

// expose enum on the model, and provide an internal convenience reference
const reasons = (adminSchema.statics.failedLogin = {
  NOT_FOUND: 0,
  PASSWORD_INCORRECT: 1,
  MAX_ATTEMPS: 2
});

adminSchema.statics.getAuthenticated = function(username, password, cb) {
  this.findOne({ username })
    .then(user => {
      // make sure the user exists
      if (!user) {
        return cb(null, null, reasons.NOT_FOUND);
      }

      // check if the account is currently locked
      if (user.isLocked) {
        // just increment login attempts if account is already locked
        return user.incLoginAttempts(err => {
          if (err) return cb(err);
          return cb(null, null, reasons.MAX_ATTEMPTS);
        });
      }

      // test for a matching password
      user.checkpassword(password, (err, isMatch) => {
        if (err) {
          return cb(err);
        }
        // check if the password was a match
        if (isMatch) {
          // if there's no lock or failed attempts, just return the user
          // console.log("what user looks like: " + user);
          if (!user.loginAttempts && !user.lockUntil) {
            return cb(null, user);
          }
          // reset attempts and lock info
          var updates = {
            $set: { loginAttempts: 0 },
            $unset: { lockUntil: 1 }
          };
          return user
            .updateOne(updates)
            .then(user => cb(null, user))
            .catch(err => cb(err));
        } else {
          // password is incorrect, so increment login attempts before responding
          user.incLoginAttempts(err => {
            if (err) {
              return cb(err);
            } else {
              return cb(null, null, reasons.PASSWORD_INCORRECT);
            }
          });
        }
      });
    })
    .catch(err => cb(err));
};

Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;

// http://devsmash.com/blog/implementing-max-login-attempts-with-mongoose
