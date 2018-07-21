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
module.exports.AddShipping = (depart,arrival,date,weight,desc,status,duration,cost,custid,container,callback) => {
  new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
      return pool.query`insert into dbo.shipping (shipping_departure_port,shipping_arrival_port,shipping_date,shipping_status,shipping_duration,shipping_cost,shipping_weight,shipping_remark,customer_id,container_id) values (${depart},${arrival},${date},${status},${duration},${cost},${weight},${desc},${custid},${container})`;
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
module.exports.GetShippingByID = (id,callback)=>{
  new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    return pool.query`select * from dbo.shipping where shipping_id = ${id}`;
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
}
module.exports.GetShippingByPort = (name,callback)=>{
  new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    return pool.query`select * from dbo.shipping where shipping_departure_port = ${name} or shipping_arrival_port = ${name}`;
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
}
module.exports.GetShippingByCust = (id,callback)=>{
  new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    return pool.query`select * from dbo.shipping where customer_id = ${id}`;
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
}
module.exports.CancelShip = (id,callback)=>{
  new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    return pool.query`update dbo.shipping set shipping_status = 'Cancelled' where shipping_id = ${id}`;
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
}
module.exports.UpdateShip = (id,status,container,callback)=>{
  new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    return pool.query`update dbo.shipping set shipping_status = ${status},container_id=${container} where shipping_id = ${id}`;
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
}

