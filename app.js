const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const createError = require("http-errors");
const mongoose = require("mongoose");
const passport = require("passport");
const express = require("express");
const logger = require("morgan");
const flash = require("connect-flash");
const path = require("path");

// importing routes
const indexRouter = require("./routes/index");
const adminIndexRouter = require("./routes/admins/index");
const userIndexRouter = require("./routes/users/index");

// DEFINE CONSTANTS
const SESSION_EXPIRATION_DATE = new Date(Date.now() + 86400 * 1000); //24h

// import keys
const keys = require("./config/keys");

// APP.
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(keys.secretOrKey));
app.use(express.static(path.join(__dirname, "public")));

// DB
require("./config/db");

// SEED THE DATABASE
require("./seeds")();

// setting session
app.use(
  session({
    secret: keys.secretOrKey,
    resave: false,
    expires: SESSION_EXPIRATION_DATE,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    saveUninitialized: false
  })
);

// importing passport
// passport config
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

// catch 404 and forward to error handler
// app.use((req, res, next) => {
//   next(createError(404));
// });

// passing variables to view pages.
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  // console.log("[app.js] req.user = " + res.locals.currentUser);
  res.locals.success = req.flash("success");
  res.locals.errors = req.flash("error");
  next();
});
// using routes
app.use("/", indexRouter);
app.use("/admins", adminIndexRouter);
app.use("/users", userIndexRouter);

// error handler
// app.use((err, req, res, next) => {
// set locals, only providing error in development
// res.locals.message = err.message;
// res.locals.error = req.app.get("env") === "development" ? err : {};

// render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });

module.exports = app;
