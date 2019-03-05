const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Temp schema
scenario1Schema = new Schema({
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

// Scenario Model
const Scenario1 = mongoose.model("Scenario1", scenario1Schema);

module.exports = Scenario1;
