var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var flash = require("connect-flash");
var session = require("express-session");
var passport = require("passport");
var expressValidator = require("express-validator");
var indexRouter = require("./routes/index");
var shippingRouter = require("./routes/shipping");
const appInsights = require("applicationinsights");
var app = express();
var hbs = require("hbs");
appInsights.setup("d005c79c-2dbf-44a1-a001-b1d454ed2275");
appInsights.start();
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
//parser middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
//session
app.use(session({ secret: "secret", saveUninitialized: true, resave: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(expressValidator());
app.use(flash());
app.use(function(req, res, next) {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});
app.use(function(req, res, next) {
  //global variable
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});
app.use(function(req, res, next) {
  if (
    res.locals.user == null &&
    (req.path != "/login" && req.path != "/register")
  ) {
    req.flash("error_msg", "Please login to proceed!");
    return res.redirect("/login");
  } else {
    next();
  }
});
hbs.registerHelper("when",function(operand_1, operator, operand_2, options) {
  var operators = {
   'eq': function(l,r) { return l == r; },
   'noteq': function(l,r) { return l != r; },
   'gt': function(l,r) { return Number(l) > Number(r); },
   'or': function(l,r) { return l || r; },
   'and': function(l,r) { return l && r; },
   '%': function(l,r) { return (l % r) === 0; }
  }
  , result = operators[operator](operand_1,operand_2);

  if (result) return options.fn(this);
  else  return options.inverse(this);
});
app.use("/", indexRouter);
app.use("/shipping", shippingRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
