const express = require("express");
const router = express.Router();
var flash = require("connect-flash");

router.get("/add", (req, res, next) => {
  res.render("shipping", { layout: "homelayout.hbs" });
});
router.post("/add", (req, res, next) => {
  var departure = req.body.departureport;
  var arrival = req.body.arrivalport;
  var date = req.body.date;
  var weight = req.body.weight;
  var desc = req.body.desc;
  console.log(req.body);
  req.checkBody("date", "Date is required!").notEmpty();
  req.checkBody("weight", "Weight is required!").notEmpty();
  req.checkBody("desc", "Desc is required!").notEmpty();
  var errors = req.validationErrors();
  console.log(errors);
  if (errors) {
    res.render("shipping", { errors: errors, layout: "homelayout.hbs" });
  } else {
    console.log("perform add shipping");
  }
});

module.exports = router;
