const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// user schema
const tempUserSchema = new Schema({
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
  submitdate: {
    type: Date,
    default: Date.now()
  }
});

// TempUser model
const TempUser = mongoose.model("TempUser", tempUserSchema);

module.exports = TempUser;
