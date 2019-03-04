const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Temp schema
tempSchema = new Schema({
  data: {
    A: {
      type: Number
    },
    B: {
      type: Number
    },
    C: {
      type: Number
    },
    D: {
      type: Number
    },
    E: {
      type: Number
    }
  },
  time: {
    type: Number,
    default: Math.round(new Date().getTime() / 1000)
    // default: new Date().getTime() / 1000
  }
});

// Temp Model
const Temp = mongoose.model("Temp", tempSchema);

module.exports = Temp;
