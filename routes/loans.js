const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

const Sequelize = require("sequelize");
const sequelize = require("../models/index");
const Op = Sequelize.Op;

//Method override
const methodOverride = require("method-override");
router.use(methodOverride("_method"));

//Bodyparser middleware
router.use(bodyParser.urlencoded({ extended: true }));

const Book = require("../models/book");
const Loan = require("../models/loan");
const Patron = require("../models/patron");

//GET ALL LOANS
router.get("/all_loans", (req, res) => {
  sequelize
    .sync()
    .then(() => {
      Loan.findAll({
        include: [{ model: Patron }, { model: Book }],
        order: [["id", "ASC"]]
      }).then(loaner => {
        res.render("all_loans", { loans: loaner });
      });
    })
    .catch(err => {
      res.send(500, err);
    });
});

//GET checked_loans
router.get("/checked_loans", (req, res) => {
  sequelize
    .sync()
    .then(() => {
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
    })
    .catch(err => {
      res.send(500, err);
    });
});

//GET- overdue loans
router.get("/overdue_loans", (req, res) => {
  let todaysDate = new Date().toISOString().slice(0, 10);
  Loan.findAll({
    where: {
      returned_on: null,
      return_by: {
        //HOW?
        [Op.lt]: todaysDate
      }
    },
    include: [{ model: Patron }, { model: Book }]
  })
    .then(overdueLoans => {
      // console.log(overdueLoans);
      res.render("overdue_loans", { loans: overdueLoans });
    })
    .catch(err => {
      res.send(500, err);
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
    //I PUT IN THIS CODE TO FILTER OUT BOOKS ALREADY LOANED OUT BUT THIS IN UNNECCSSARY
    // .then(response => {
    //   //produce array of just all book titles
    //   let listAllBooks = response[1].map(element => {
    //     return element.dataValues;
    //   });

    //   //produce array of only loaned out book titles
    //   const loanedOutBookTitles = response[0].map(element => {
    //     return element.book.dataValues.title;
    //   });

    //   //array to slice out loaned out books
    //   const availBooks = listAllBooks.filter(element => {
    //     return loanedOutBookTitles.indexOf(element.title) < 0;
    //   });

    //   const patrons = response[2];
    //   return [patrons, availBooks];
    // })
    .then(response => {
      res.render("new_loan", { patrons: response[2], freeBooks: response[1] });
    })
    .catch(err => {
      console.log(err);
      res.send(500, err);
    });
});

//POST loan form
router.post("/loans/new", (req, res) => {
  //create loan instance
  Loan.create({
    book_id: req.body.book_id,
    patron_id: req.body.patron_id,
    loaned_on: req.body.loaned_on,
    return_by: req.body.return_by,
    timestamps: false
  })
    .then(() => {
      Loan.findAll({
        include: [{ model: Patron }, { model: Book }],
        order: [["id", "ASC"]]
      }).then(loaner => {
        res.redirect("/all_loans");
      });
    })
    //catch validation errors
    .catch(err => {
      console.log(err);
      if (err.name === "SequelizeValidationError") {
        Promise.all([Book.findAll(), Patron.findAll()]).then(response => {
          res.render("new_loan", {
            patrons: response[1],
            freeBooks: response[0],
            errors: err.errors
          });
        });
      } else {
        throw error;
      }
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

//GET- get return form
router.get("/loans/:id/return_book", (req, res) => {
  //GET book details
  Loan.findById(req.params.id, {
    include: [{ model: Patron }, { model: Book }]
  })
    .then(loan => {
      // console.log(loan.dataValues);
      //Render page
      res.render("return_book", {
        loan: loan,
        patron: loan.patron.dataValues,
        book: loan.book.dataValues
      });
    })
    .catch(err => {
      res.send(500, err);
    });
});

//PUT- update loan details (ie, return book)
router.put("/loans/:id/", (req, res) => {
  //Find loan
  Loan.findById(req.params.id)
    .then(loan => {
      loan
        .update(req.body)
        .then(() => {
          res.redirect("/all_loans");
        })
        .catch(async err => {
          console.log(err);
          if (err.name === "SequelizeValidationError") {
            const loan = await Loan.findById(req.params.id, {
              include: [{ model: Patron }, { model: Book }]
            });
            // console.log(loan.dataValues);
            //Render page
            res.render("return_book", {
              loan: loan,
              patron: loan.patron.dataValues,
              book: loan.book.dataValues,
              errors: err.errors
            });
          } else {
            throw error;
          }
        });
    })

    .catch(err => {
      res.status(500).send(err);
    });
});

module.exports = router;
