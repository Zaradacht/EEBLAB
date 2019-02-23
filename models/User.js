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

// user Model
const User = mongoose.model("User", userSchema);

module.exports = User;
