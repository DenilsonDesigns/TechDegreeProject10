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
      }
    }),
    Book.findAll(),
    Patron.findAll()
  ]).then(response => {
    // console.log(response[0][0]); //Unreturned loans (first one);
    // console.log(response[1][0].dataValues); //Books (all)- this lists first one;
    const listAllBooks = response[1];
    //
    console.log(listAllBooks.length);
    // console.log(response[2][0].dataValues); //Patrons (all)- this lists first one;
    res.render("new_loan");
  });
});

module.exports = router;
