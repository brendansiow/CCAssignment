const sql = require("mssql");
const config = {
  user: "walaoehh",
  password: "cmsccProject123",
  server: "cmscc.database.windows.net",
  database: "CMS_db",

  options: {
    encrypt: true
  }
};
module.exports.GetPortByID = (id, callback) => {
    new sql.ConnectionPool(config)
      .connect()
      .then(pool => {
        return pool.query`select * from dbo.port where port_id = ${id}`;
      })
      .then(result => {
        sql.close();
        if (result.rowsAffected !== 0) {
          callback(result.recordset[0]);
        } else {
          callback(false);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  module.exports.GetAllPort = (callback) => {
    new sql.ConnectionPool(config)
      .connect()
      .then(pool => {
        return pool.query`select * from dbo.port`;
      })
      .then(result => {
        sql.close();
        if (result.rowsAffected !== 0) {
          callback(result.recordset);
        } else {
          callback(false);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };