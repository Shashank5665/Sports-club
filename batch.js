app.get("/batch", (req, res) => {
  con.query("select * from users where username='niti'", (err, result) => {
    if (err) console.log(err);
    console.log(result);
  });
  res.send("hi");
});
