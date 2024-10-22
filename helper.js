const express = require("express");
const app = express();
const port = 3001;

const mysql = require("mysql2");
const cors = require("cors");

const pool = mysql.createPool({
  host: "193.203.184.7",
  user: "u223830212_pnkj",
  password: "TenC@1234",
  database: "u223830212_pankaj",
});

pool.getConnection(function (err, con) {
  if (err) throw err;
  console.log("Connected!");

  // Create the customers table
  var createTableSql =
    "CREATE TABLE IF NOT EXISTS company (Uid VARCHAR(255), id VARCHAR(255),  name VARCHAR(255),description VARCHAR(255),price VARCHAR(255),image VARCHAR(255))";
  con.query(createTableSql, function (err) {
    if (err) throw err;
    console.log("Table created or already exists");
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
