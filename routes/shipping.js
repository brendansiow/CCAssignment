const express = require("express");
const router = express.Router();
var port = require("./../src/port");
var ship = require("./../src/ship");
var container = require("./../src/container");
var flash = require("connect-flash");

router.get("/add", (req, res, next) => {
  port.GetAllPort(portList => {
    res.render("shipping", { portList: portList, layout: "homelayout.hbs" });
  });
});
router.post("/add", (req, res, next) => {
  var departure = req.body.departureport;
  var arrival = req.body.arrivalport;
  var date = req.body.date;
  var weight = req.body.weight;
  var desc = req.body.desc;
  req.checkBody("date", "Date is required!").notEmpty();
  req.checkBody("weight", "Weight is required!").notEmpty();
  req.checkBody("weight", "Weight should be in numbers!").isNumeric();
  req.checkBody("desc", "Desc is required!").notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    port.GetAllPort(portList => {
      res.render("shipping", {
        portList: portList,
        errors: errors,
        layout: "homelayout.hbs"
      });
    });
  } else {
    container.GetContainer(allcontainer => {
      const portname = [
        "Port Penang",
        "Port Weld Taping",
        "Port Klang",
        "Port Dickson",
        "Port Parameswara"
      ];
      let container = null;
      allcontainer.some(each => {
        container = each.container_id;
        return each.container_size > weight;
      });
      let days = Math.abs(
        portname.indexOf(departure) - portname.indexOf(arrival)
      );
      let cost = days * (weight * 10);
      ship.cost = cost;
      ship.AddShipping(
        departure,
        arrival,
        date,
        weight,
        desc,
        "Pending",
        days,
        cost,
        req.user.userid,
        container,
        callback => {
          req.flash("success_msg", "Shipping added successfully!");
          res.redirect("/");
        }
      );
    });
  }
});
router.get("/edit/:id", (req, res, next) => {
  ship.GetShippingByID(req.params.id, ship => {
    if (req.user.portid) {
      port.GetPortByID(req.user.portid, portdetails => {
        container.GetContainer(allcontainer => {
          let selectoption = [];
          if (portdetails.port_name == ship.shipping_departure_port) {
            let iamdepartport = true; // to know this is departure or arrival port
            if (ship.shipping_status != "Cancelled") {
              selectoption = ["Pending", "Approved", "Shipping", "Rejected"];
              var index = selectoption.indexOf(ship.shipping_status);
              if (index !== -1) {
                selectoption.splice(index, 1);
              }
            }
            containeroption = allcontainer.filter(function(el) {
              return el.container_id !== ship.container_id;
            });
            res.render("editshipping", {
              ship: ship,
              containeroption: containeroption,
              selectoption: selectoption,
              iamdepartport: iamdepartport,
              layout: "homelayout.hbs"
            });
          } else {
            let iamdepartport = false; // to know this is departure or arrival port
            if (ship.shipping_status != "Cancelled") {
              selectoption = ["Rejected", "Delivered"];
              var index = selectoption.indexOf(ship.shipping_status);
              if (index !== -1) {
                selectoption.splice(index, 1);
              }
            }
            res.render("editshipping", {
              ship: ship,
              selectoption: selectoption,
              iamdepartport: iamdepartport,
              layout: "homelayout.hbs"
            });
          }
        });
      });
    } else {
      res.render("editshipping", {
        ship: ship,
        layout: "homelayout.hbs"
      });
    }
  });
});
router.post("/edit/:id", (req, res, next) => {
  ship.UpdateShip(req.params.id,req.body.status,req.body.container, callback => {
    req.flash("success_msg", "Shipping edited successfully!");
    res.redirect("/");
  });
});
router.post("/cancel/:id", (req, res, next) => {
  ship.CancelShip(req.params.id, callback => {
    req.flash("success_msg", "Shipping cancelled successfully!");
    res.redirect("/");
  });
});
module.exports = router;
