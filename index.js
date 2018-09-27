const express = require("express");
const app = express();
const Sequelize = require("sequelize");
// const Book = require("./models").book;

//SET VIEW ENGINE
app.set("view engine", "pug");
app.use("/static", express.static("public"));

//CONFIG SEQUELIZE
const sequelize = new Sequelize("development", "root", "password", {
  dialect: "sqlite",
  storage: "./library.db"
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

const User = sequelize.define("user", {
  username: Sequelize.STRING,
  birthday: Sequelize.DATE
});

const Book = sequelize.define("book", {
  title: Sequelize.TEXT,
  author: Sequelize.TEXT,
  genre: Sequelize.TEXT,
  first_published: Sequelize.INTEGER
});

sequelize
  .sync()
  .then(() =>
    Book.create({
      title: "harry potter smells",
      author: "JK Boring",
      genre: "Childrens",
      first_published: 2012
    })
  )
  .then(jane => {
    console.log(jane.toJSON());
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
