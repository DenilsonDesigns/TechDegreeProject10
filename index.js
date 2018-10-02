const express = require("express");
const app = express();
const sequelize = require("./models/index");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

//ROUTER
const bookRoutes = require("./routes/books");
const patronRoutes = require("./routes/patrons");
const loanRoutes = require("./routes/loans");
app.use("/", bookRoutes, patronRoutes, loanRoutes);

//SET VIEW ENGINE
app.set("view engine", "pug");
app.use("/static", express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//GET INDEX
app.get("/", (req, res) => {
  res.render("index");
});

//////////////////////
/////SERVER SETUP/////
//////////////////////
const port = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log("Library Manager fired up");
  });
});
