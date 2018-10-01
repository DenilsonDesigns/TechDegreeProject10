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
      let listAllBooks = response[1];
      // // console.log(listAllBooks[0].dataValues.title);
      // listAllBooks = response[1].map(element => {
      //   element.dataValues.title;
      // });

      const loanedOutBookTitles = response[0].map(element => {
        element.book.dataValues.title;
      });
      const availBooks = listAllBooks.filter(element => {
        return !loanedOutBookTitles.includes(element.dataValues.title);
      });

      const patrons = response[2];
      console.log(availBooks);
      return [patrons, availBooks];
    })
    .then(response => {
      // console.log(response[1]);
      res.render("new_loan");
    });
});

module.exports = router;
