//required npm packages and setting variables
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const con = require("./server");
const { disable } = require("express/lib/application");
const port = 3300;
var success_b_id;
var success_sports_name;
var success_username;
var success_t_id = null;
var success_b_coach;
var admin_username = "main_admin";
var admin_password = "main_password";
//MIDDLEWARES
app.set("view engine", "ejs");
app.engine("ejs", require("ejs").renderFile);
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true }));

//ROUTES
app.get("/home", (req, res) => {
  con.query("select * from sports;", (err, result) => {
    if (err) console.log(err);
    res.render("home", {
      s_details: result,
    });
  });
});

//To display the signup page
app.get("/signup", (req, res) => {
  res.render("signup");
});
//To display the tournament page, where admin can add new tournaments
app.get("/add-tour", (req, res) => {
  res.render("add-tour");
});

//To add the tournaments
app.post("/add-tour", async (req, res) => {
  await con.query(
    `insert into tournaments values(${req.body.t_id},"${req.body.t_name}","${req.body.t_type}","${req.body.t_duration}","${req.body.t_date}","${req.body.t_day}","${req.body.t_venue}");`,
    (err, result) => {
      if (err) {
        throw err;
      } else {
        console.log("1 record inserted");
      }
    }
  );
  res.redirect("/admin-tournaments");
  res.end();
});

//To sign-up the new users
app.post("/signup", async (req, res) => {
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
      "'," +
      null +
      "," +
      null +
      ")",
    (err, result) => {
      if (err) {
        throw err;
      } else {
        console.log("1 record inserted");
      }
    }
  );
  res.redirect("/login");
  res.end();
});

//To display login page
var uname;
app.get("/login", (req, res) => {
  res.render("login");
});

//To login the existing users
app.post("/login", async (req, res) => {
  uname = req.body.username;
  success_username = uname;
  var pass = req.body.password;
  if (uname == "main_admin" && pass == "main_password") {
    res.redirect("/admin");
  } else {
    con.query(
      `select * from users where username="${uname}"`,
      async (err, result) => {
        if (err) {
          throw err;
        }
        if (result[0].password == pass) {
          success_username = uname;
          res.redirect(`/sports/${uname}`);
        } else {
          res.send("Username and password didn't match, refresh and try again");
        }
      }
    );
  }
});

//To display the batch page of a the particular sport
app.get("/batch/:batchId", async (req, res) => {
  await con.query(
    `select * from batch where b_sport="${req.params.batchId}"`,
    (err, result) => {
      if (err) console.log(err);
      console.log(result);
      success_b_id = result[0].b_id;
      success_sports_name = req.params.batchId;
      res.render("batch", {
        b_details: result,
        sports_name: req.params.batchId,
      });
    }
  );
});

//To show the sports page when a user is not logged-in
app.get("/sports", async (req, res) => {
  await con.query("select * from sports;", (err, result) => {
    if (err) console.log(err);
    res.render("sports", {
      s_details: result,
      myprofile: req.params.username,
      username: "",
      Login: "Login",
      Register: "Signup",
      logout: "",
    });
  });
});

//To display the sports page when the user is logged-in
app.get("/sports/:username", async (req, res) => {
  await con.query("select * from sports;", (err, result) => {
    if (err) console.log(err);
    res.render("sports", {
      username: uname,
      s_details: result,
      myprofile: req.params.username,
      Login: "",
      Register: "",
      logout: "Logout",
    });
  });
});

//To display the users to the admin
app.get("/admin-users", async (req, res) => {
  await con.query("select * from users;", (err, result) => {
    if (err) console.log(err);
    console.log(result);
    res.render("admin-users", {
      members: result,
    });
  });
});

//Display the admin page
app.get("/admin", async (req, res) => {
  await con.query("select * from users;", (err, result) => {
    if (err) console.log(err);
    console.log(result);
    res.render("admin");
  });
});

//Not required
app.get("/admincoach", async (req, res) => {
  await con.query("select * from coach;", (err, result) => {
    if (err) console.log(err);
    console.log(result);
    res.render("admincoach");
  });
});

//To display the tournament section in the admin dashboard
app.get("/admintournment", async (req, res) => {
  await con.query("select * from tournaments;", (err, result) => {
    if (err) console.log(err);
    console.log(result);
    res.render("admintournment");
  });
});

//To view the tournaments by the admin in the admin dashboard
app.get("/admin-tournaments", async (req, res) => {
  con.query("select * from tournaments;", (err, result) => {
    if (err) console.log(err);
    console.log(result);
    res.render("admin-tournaments", {
      tournament: result,
    });
  });
});

//To display the tournaments
app.get("/tournaments", async (req, res) => {
  await con.query("select * from tournaments;", (err, result) => {
    if (err) console.log(err);
    console.log(result);
    if (uname == null) {
      res.render("tournaments", {
        t_details: result,
        username: uname,
        myprofile: req.params.username,
        Login: "Login",
        Register: "Signup",
      });
    } else {
      res.render("tournaments", {
        t_details: result,
        username: uname,
        myprofile: uname,
        Login: "",
        Register: "",
      });
    }
  });
});

//To display the profile of a user
var user;
app.get("/profile/:username", (req, res) => {
  con.query(`select * from users where username="${uname}";`, (err, result) => {
    if (err) console.log(err);
    console.log(result);
    var user = result[0];
    res.render("myprofile", {
      myprofile: user.username,
      fullname: user.fullname,
      username: user.username,
      mobile: user.phnumber,
      address: user.address,
      email: user.email,
      dob: user.dob,
      Login: "",
      Register: "",
      sports_name: user.s_name,
      tour_name: user.t_name,
    });
  });
});
const viewUsers = () => {
  document.querySelector(".view-users").addEventListener(() => {
    app.get("/admin-users", async (req, res) => {
      await con.query("select * from users;", (err, result) => {
        if (err) console.log(err);
        console.log(result);
        res.render("admin", {
          members: result,
        });
      });
    });
  });
};

//To display the page when a user successfully registers for a sport
app.get("/success-register", (req, res) => {
  con.query(
    `select * from batch where b_id="${success_b_id}";`,
    (err, result) => {
      if (err) {
        res.send("You have already been enrolled!");
      }
      success_b_coach = result[0].b_coach;
    }
  );
  con.query(
    `update users set s_name="${success_sports_name}" where username="${success_username}"`
  );
  con.query(
    `insert into registrations values("${success_username}","${success_sports_name}",${success_b_id},${success_t_id})`,
    (err, result) => {
      if (err) {
        res.set("Content-Type", "text/html");
        res.send(
          Buffer.from(
            `<h1 style='color: red;font-family: poppins'>You have alreday been enrolled!</h1>`
          )
        );
      } else {
        res.render("celebration", {
          s_sname: success_sports_name,
          s_uname: success_username,
        });
      }
    }
  );
});

//Admin can delete the tournaments
app.get("/delete/:id", (req, res) => {
  con.query(
    `DELETE FROM tournaments WHERE t_id=${req.params.id}`,
    (err, result) => {
      if (err) console.log(err);
      res.redirect("/admin-tournaments");
    }
  );
});

//To enroll the user to the particular tournament
app.get("/batch-enroll/:id", (req, res) => {
  con.query(
    `update users set t_name=(select t_name from tournaments where t_id=${req.params.id}) where username="${uname}"`
  );
  con.query(
    `UPDATE registrations
    SET t_id=${req.params.id}
    WHERE username="${uname}";`,
    (err, result) => {
      if (err) console.log(err);
      res.redirect(`/profile/${uname}`);
    }
  );
});

//-------------------------------------------------------------------------------------------------------

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
