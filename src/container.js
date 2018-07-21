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
module.exports.GetContainer = (callback) => {
    new sql.ConnectionPool(config)
      .connect()
      .then(pool => {
        return pool.query`select * from dbo.container order by container_size asc`;
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