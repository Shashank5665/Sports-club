const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const con = require("./server");
const port = 3300;
const addUserData = require("./controllers/controller.js");
const req = require("express/lib/request");

//middlewares
app.set("view engine", "html");
app.engine("html", require("ejs").renderFile);
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public/css"));
app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/signup", (req, res) => {
  res.render("ssclubsignup");
});
app.post("/signup", async (req, res) => {
  // var fullname = req.body.fullname;
  // var email = req.body.email;
  // var address = req.body.address;
  // var dob = req.body.dob;
  // var phonenumber = req.body.phonenumber;
  // var username = req.body.username;
  // var password = req.body.password;
  // console.dir(con);
  await con.query(
    "insert into users values('" +
      req.body.fullname +
      "','" +
      req.body.email +
      "','" +
      req.body.address +
      "','" +
      req.body.dob +
      "','" +
      req.body.phonenumber +
      "','" +
      req.body.username +
      "','" +
      req.body.password +
      "')",
    (err, result) => {
      if (err) console.log(err);
      console.log("1 record inserted");
    }
  );
  res.send("Record inserted");
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
