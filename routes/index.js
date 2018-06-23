var express = require("express");
var router = express.Router();
const sql = require("mssql");
const config = {
  user: "adminliquid",
  password: "LiquidCloud123",
  server: "liquidcloud.database.windows.net",
  database: "LiquidCloudDB",

  options: {
    encrypt: true
  }
};
/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("login");
});
router.get("/home", function(req, res, next) {
  GetContacts().then(result => {
    res.render("home", { result: result.recordset });
  });
});
router.post("/home", (req, res, next) => {
  new sql.ConnectionPool(config)
    .connect()
    .then((pool) => {
      return pool.query`insert into dbo.contacts values (${req.body.id},${req.body.name},'123123','Male','12312qweqwe','Single','2018-05-02')`;
    })
    .then(() => {
      sql.close();
      res.redirect("/home");
    })
    .catch(err => {
      console.log(err);
    });
});
//
function GetContacts() {
  return new Promise((resolve, reject) => {
    new sql.ConnectionPool(config)
      .connect()
      .then(pool => {
        return pool.query`select * from dbo.contacts`;
      })
      .then(result => {
        sql.close();
        console.log(result);
        resolve(result);
      })
      .catch(err => {
        console.log(err);
      });
  });
}
module.exports = router;

