const mongoose = require("mongoose");
const keys = require("./keys");

// setting db
let db = "";
if (process.env.NODE_ENV === "production") {
  db = keys.mongoURI;
} else {
  db = keys.mongoDevURI;
}
//connecting to db
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => console.log("MongoDB Connected Successfuly!"))
  .catch(err => console.log(err));
