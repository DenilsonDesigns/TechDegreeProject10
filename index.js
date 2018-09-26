const express = require("express");
const app = express();
const Sequelize = require("sequelize");

//SET VIEW ENGINE
app.set("view engine", "pug");
app.use("/static", express.static("public"));

//CONFIG SEQUELIZE
const sequelize = new Sequelize("development", "root", "password", {
  dialect: "sqlite",
  port: 3306 // or 5432 (for postgres)
});

//GET INDEX
app.get("/", (req, res) => {
  res.render("index");
});

//GET ALL BOOKS
app.get("/all_books", (req, res) => {
  res.render("all_books");
});

//GET ALL PATRONS
app.get("/all_patrons", (req, res) => {
  res.render("all_patrons");
});

//GET ALL LOANS
app.get("/all_loans", (req, res) => {
  res.render("all_loans");
});

//////////////////
//SERVER SETUP////
//////////////////
const port = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log("Library Manager fired up");
  });
});

//NOTES*********
// var Sequelize = require('sequelize')
//   , sequelize = new Sequelize('database_name', 'username', 'password', {
//       dialect: "mysql", // or 'sqlite', 'postgres', 'mariadb'
//       port:    3306, // or 5432 (for postgres)
//     });

// sequelize
//   .authenticate()
//   .then(function(err) {
//     console.log('Connection has been established successfully.');
//   }, function (err) {
//     console.log('Unable to connect to the database:', err);
//   });
