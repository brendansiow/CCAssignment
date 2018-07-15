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
module.exports.Register = (name, email, password, callback) => {
  new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
      return pool.query`insert into dbo.customer values (${name},${email},${password})`;
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
module.exports.Login = (email, password, callback) => {
  new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
      return pool.query`select * from dbo.customer where customer_email =${email} and customer_password = ${password}`;
    })
    .then(result => {
      sql.close();
      if (result.rowsAffected[0] !== 0) {
        callback(result.recordset[0]);
      } else {
        new sql.ConnectionPool(config)
          .connect()
          .then(pool => {
            return pool.query`select * from dbo.staff where staff_email =${email} and staff_password = ${password}`;
          })
          .then(result => {
            sql.close();
            if (result.rowsAffected[0] !== 0) {
              callback(result.recordset[0]);
            } else {
              callback(false);
            }
          });
      }
    })
    .catch(err => {
      console.log(err);
    });
};
module.exports.GetUserByID = (email, callback) => {
  new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
      return pool.query`select * from dbo.customer where customer_email =${email}`;
    })
    .then(result => {
      sql.close();
      if (result.rowsAffected[0] !== 0) {
        callback(result.recordset[0]);
      } else {
        new sql.ConnectionPool(config)
          .connect()
          .then(pool => {
            return pool.query`select * from dbo.staff where staff_email =${email}`;
          })
          .then(result => {
            if (result.rowsAffected[0] !== 0) {
              callback(result.recordset[0]);
            } else {
              callback(false);
            }
          });
      }
    })
    .catch(err => {
      console.log(err);
    });
};
