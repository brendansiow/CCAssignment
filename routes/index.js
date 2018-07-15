const express = require("express");
const router = express.Router();
var customer = require("./../src/customer");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    (email, password, done) => {
      customer.Login(email, password, user => {
        if (!user) {
          return done(null, false, {
            message: "Incorrect email and password."
          });
        }
        if (user.customer_id) {
          return done(null, user.customer_email);
        } else {
          return done(null, user.staff_email);
        }
      });
    }
  )
);
passport.serializeUser(function(email, done) {
  done(null, email);
});

passport.deserializeUser(function(email, done) {
  customer.GetUserByID(email, user => {
    let tempuser = [];
    if (user.customer_id) {
      tempuser.userid = user.customer_id;
      tempuser.name = user.customer_name;
      tempuser.email = user.customer_email;
      tempuser.portid = null;
      tempuser.role = "customer";
    } else {
      tempuser.userid = user.staff_id;
      tempuser.name = user.staff_name;
      tempuser.email = user.staff_email;
      tempuser.portid = user.port_id;
      tempuser.role = "staff";
    }
    user = tempuser;
    done(null, user);
  });
});
/* GET page. */
router.get("/", function(req, res, next) {
  res.render("home", { layout: "homelayout.hbs" });
});
router.get("/login", function(req, res, next) {
  res.render("login");
});
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  }),
  function(req, res) {
    res.redirect("/");
  }
);

router.get("/register", function(req, res, next) {
  res.render("register");
});
router.post("/register", function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  req.checkBody("name", "Name is required!").notEmpty();
  req.checkBody("email", "Email is not valid").isEmail();
  req.checkBody("password", "Password is required!").notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    res.render("register", { errors: errors });
  } else {
    customer.Register(
      req.body.name,
      req.body.email,
      req.body.password,
      callback => {
        req.flash("success_msg", "Registered successfully!");
        res.redirect("/login");
      }
    );
  }
});
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out!");
  res.redirect("/login");
});
module.exports = router;
