const mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "sports_club",
  port: "3306",
  queueLimit: 0,
  connectionLimit: 0,
});

con.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected to MySQL database..!");
  }
});

module.exports = con;
