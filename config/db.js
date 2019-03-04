const mongoose = require("mongoose");
const Pusher = require("pusher");
const keys = require("./keys");

// Configuring PUSHER
const pusher = new Pusher({
  appId: "720636",
  key: "b24e46be724a9ba963bb",
  secret: "42b90948a56f4d07a479",
  cluster: "eu",
  useTLS: true
});
const channel = "temps";

// setting db
let URI = "";
if (process.env.NODE_ENV === "production") {
  URI = keys.mongoURI;
} else {
  URI = keys.mongoDevURI;
}
//connecting to URI
mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => console.log("MongoDB Connected Successfuly!"))
  .catch(err => console.log(err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));

db.once("open", () => {
  const tempCollection = db.collection("temps");
  const changeStream = tempCollection.watch();

  changeStream.on("change", change => {
    console.log("=========");
    console.log("[db.js] change = " + JSON.stringify(change, null, 2));
    if (change.operationType === "insert") {
      const temp = change.fullDocument;
      console.log("[db.js-if] temp= " + JSON.stringify(temp, null, 2));
      pusher.trigger(channel, "inserted", { ...temp });
    }
  });
});
