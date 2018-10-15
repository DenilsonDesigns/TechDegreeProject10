const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));

const Sequelize = require("sequelize");
const sequelize = require("../models/index");
const Op = Sequelize.Op;

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

//GET overdue books
router.get("/overdue_books", (req, res) => {
  let todaysDate = new Date().toISOString().slice(0, 10);
  //Get overdue loans
  Loan.findAll({
    where: {
      returned_on: null,
      return_by: {
        //HOW?
        [Op.lt]: todaysDate
      }
    },
    include: [{ model: Book }]
  }).then(overdueBooks => {
    // console.log(overdueBooks);
    res.render("overdue_books", { books: overdueBooks });
  });
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
    .catch(err => {
      if (err.name === "SequelizeValidationError") {
        res.render("new_book", { errors: err.errors });
      } else {
        throw error;
      }
    })
    .catch(err => {
      res.send(500, err);
    });
});

//GET- book detail
router.get("/books/:id/edit", (req, res) => {
  //Get patron by id- must get loan history
  Promise.all([
    Book.findById(req.params.id),
    Loan.findAll({
      where: { book_id: req.params.id },
      include: { model: Patron }
    })
  ])
    .then(response => {
      //chain a query here to loan table to get loan history by book id.
      // console.log(response[1]);
      res.render("book_detail", { book: response[0], loans: response[1] });
    })
    .catch(err => {
      res.send(500, err);
    });
});

//PUT- Update book details
router.put("/books/:id/", (req, res) => {
  //Find and update correct patron
  Book.findById(req.params.id)
    .then(book =>
      // console.log(book);
      book.update(req.body.book).catch(async error => {
        let book = Book.build(req.body);
        if (error.name === "SequelizeValidationError") {
          const book = await Book.findById(req.params.id);
          const loans = await Loan.findAll({
            where: { book_id: req.params.id },
            include: { model: Patron }
          });

          res.render("book_detail", {
            book: book,
            loans: loans,
            errors: error.errors
          });
        } else {
          throw error;
        }
      })
    )
    .then(() => {
      res.redirect("../../all_books");
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

module.exports = router;
