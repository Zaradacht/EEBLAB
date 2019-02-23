const mongoose = require("mongoose");
const Temp = require("./models/Temp");

const data = [
  {
    data: {
      A: 25.6,
      B: 25.8,
      C: 25.5,
      D: 25,
      E: 24
    }
  },
  {
    data: {
      A: 23.6,
      B: 23.8,
      C: 23.5,
      D: 23,
      E: 22
    }
  },
  {
    data: {
      A: 21.6,
      B: 21.8,
      C: 21.5,
      D: 21,
      E: 20
    }
  },
  {
    data: {
      A: 22.6,
      B: 22.8,
      C: 22.5,
      D: 22,
      E: 21
    }
  }
];

module.exports = seedDB = () => {
  //Remove all campgrounds
  Temp.remove({}, err => {
    if (err) {
      console.log(err);
    }
    console.log("removed temperatures!");
    //add a few campgrounds
    data.forEach(seed => {
      Temp.create(seed, (err, temp) => {
        if (err) {
          console.log(err);
        } else {
          console.log("added a temperature: " + JSON.stringify(temp, null, 2));
        }
      });
    });
  });
  //add a few comments
};

module.exports = seedDB;
