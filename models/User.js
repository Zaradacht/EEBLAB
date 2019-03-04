const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

// const
const SALT_WORK_FACTOR = 10;

// userSchema
const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  phonenumber: {
    type: String,
    required: true
  },
  cin: {
    type: String,
    required: true
  },
  submitDate: {
    type: Date
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// define prehooks for the save method
userSchema.pre("save", function(next) {
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

userSchema.methods.checkpassword = function(inputPassword, cb) {
  bcrypt
    .compare(inputPassword, this.password)
    .then(isMatch => cb(null, isMatch))
    .catch(err => cb(err));
};

// expose enum on the model, and provide an internal convenience reference
const reasons = (userSchema.statics.failedLogin = {
  NOT_FOUND: 0,
  PASSWORD_INCORRECT: 1
});

userSchema.statics.getAuthenticated = function(username, password, cb) {
  this.findOne({ username })
    .then(user => {
      // make sure the user exists
      if (!user) {
        return cb(null, null, reasons.NOT_FOUND);
      }
      // test for a matching password
      user.checkpassword(password, (err, isMatch) => {
        if (err) {
          return cb(err);
        }
        // check if the password was a match
        if (isMatch) {
          cb(null, user);
        } else {
          // password is incorrect
          cb(null, null, reasons.PASSWORD_INCORRECT);
        }
      });
    })
    .catch(err => cb(err));
};

// user Model
const User = mongoose.model("User", userSchema);

module.exports = User;
