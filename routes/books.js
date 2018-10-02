const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));

// const Sequelize = require("sequelize");
const sequelize = require("../models/index");

//Method override
const methodOverride = require("method-override");
router.use(methodOverride("_method"));

//MODELS
const Book = require("../models/book");
const Loan = require("../models/loan");
const Patron = require("../models/patron");

//GET ALL BOOKS
router.get("/all_books", (req, res) => {
  sequelize.sync().then(() => {
    Book.findAll().then(bookerT => {
      res.render("all_books", { books: bookerT });
      // console.log(bookerT[0].dataValues);
    });
  });
});

//GET new book form
router.get("/books/new", (req, res) => {
  res.render("new_book");
});

//GET checked books
router.get("/checked_books", (req, res) => {
  sequelize.sync().then(() => {
    Loan.findAll({
      //Check if 'returned_on' = null
      where: {
        returned_on: null
      },
      include: [{ model: Patron }, { model: Book }]
    }).then(checkedBooks => {
      // console.log(checkedBooks[3].dataValues);
      res.render("checked_books", { checkedBooks: checkedBooks });
    });
  });
});

//TODO: MUST MAKE PROPER QUERY
//GET overdue books
router.get("/overdue_books", (req, res) => {
  res.render("overdue_books");
  // sequelize.sync().then(() => {
  //   Loan.findAll({
  //     //Check if 'returned_on' = null
  //     where: {
  //       returned_on: null
  //     },
  //     include: [{ model: Patron }, { model: Book }]
  //   }).then(checkedBooks => {
  //     // console.log(checkedBooks[3].dataValues);
  //     res.render("checked_books", { checkedBooks: checkedBooks });
  //   });
  // });
});

//POST book form
router.post("/books/new", (req, res) => {
  const bookTitle = req.body.title;
  const bookAuthor = req.body.author;
  const bookGenre = req.body.genre;
  const firstPub = req.body.first_published;
  Book.create({
    title: bookTitle,
    author: bookAuthor,
    genre: bookGenre,
    first_published: firstPub,
    timestamps: false
  })
    .then(book => {
      console.log(book);
      res.redirect("/all_books");
    })
    .catch(err => console.log(err));
});

//GET- book detail
router.get("/books/:id/edit", (req, res) => {
  //Get patron by id- must get loan history
  Book.findById(req.params.id).then(book => {
    // console.log(book);
    res.render("book_detail", { book: book });
  });
});

//PUT- Update book details
router.put("/books/:id/", (req, res) => {
  //Find and update correct patron
  // console.log(req.params.id);
  Book.findById(req.params.id)
    .then(book => {
      console.log(book);
      book.update(req.body.book);
    })
    .then(() => {
      res.redirect("../../all_books");
    });
});

module.exports = router;
