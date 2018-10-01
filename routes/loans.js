const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));

// const Sequelize = require("sequelize");
const sequelize = require("../models/index");

const Book = require("../models/book");
const Loan = require("../models/loan");
const Patron = require("../models/patron");

//GET ALL LOANS
router.get("/all_loans", (req, res) => {
  sequelize.sync().then(() => {
    Loan.findAll({
      include: [{ model: Patron }, { model: Book }],
      order: [["id", "ASC"]]
    }).then(loaner => {
      res.render("all_loans", { loans: loaner });
      // console.log(loaner[1].dataValues);
      // console.log(loaner[1].dataValues.book.dataValues.title);
    });
  });
});

//GET checked_loans
router.get("/checked_loans", (req, res) => {
  sequelize.sync().then(() => {
    Loan.findAll({
      //Check if 'returned_on' = null
      where: {
        returned_on: null
      },
      include: [{ model: Patron }, { model: Book }]
    }).then(loaner => {
      // console.log(loaner[3].dataValues);
      res.render("checked_loans", { loans: loaner });
    });
  });
});

//GET new loan form
router.get("/loans/new", (req, res) => {
  //Must search book, patron, and loan
  //Get all books and filter out books not returned (ie: exist in loan table but returned= null)
  Promise.all([
    Loan.findAll({
      //Check if 'returned_on' = null
      where: {
        returned_on: null
      },
      include: [{ model: Book }]
    }),
    Book.findAll(),
    Patron.findAll()
  ])
    .then(response => {
      //produce array of just all book titles
      let listAllBooks = response[1].map(element => {
        return element.dataValues;
      });

      //produce array of only loaned out book titles
      const loanedOutBookTitles = response[0].map(element => {
        return element.book.dataValues.title;
      });

      //array to slice out loaned out books
      const availBooks = listAllBooks.filter(element => {
        return loanedOutBookTitles.indexOf(element.title) < 0;
      });

      const patrons = response[2];
      return [patrons, availBooks];
    })
    .then(response => {
      res.render("new_loan", { patrons: response[0], freeBooks: response[1] });
    });
});

//POST loan form
router.post("/loans/new", (req, res) => {
  //get required form data
  // const loanedOn = req.body.loaned_on.slice(0, 10);
  // console.log(loanedOn);
  //create loan instance
  Loan.create({
    book_id: req.body.book_id,
    patron_id: req.body.patron_id,
    loaned_on: req.body.loaned_on,
    return_by: req.body.return_by,
    timestamps: false
  })
    .then(loan => {
      // console.log(loan);
      res.redirect("/all_loans");
    })
    .catch(err => console.log(err));
});

module.exports = router;
