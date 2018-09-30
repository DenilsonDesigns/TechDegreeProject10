const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));

// const Sequelize = require("sequelize");
const sequelize = require("../models/index");

const Book = require("../models/book");
const Loan = require("../models/loan");
const Patron = require("../models/patron");

//GET ALL PATRONS
router.get("/all_patrons", (req, res) => {
  sequelize.sync().then(() => {
    Patron.findAll().then(patronage => {
      res.render("all_patrons", { patrons: patronage });
      // console.log(patronage[0].dataValues);
    });
  });
});
// Patron.hasOne(Loan, { foreignKey: "patron_id" });

//GET new patron form
router.get("/patrons/new", (req, res) => {
  res.render("new_patron");
});

//POST patron form
router.post("/patrons/new", (req, res) => {
  const firstName = req.body.first_name;
  const lastName = req.body.last_name;
  const address = req.body.address;
  const email = req.body.email;
  const libID = req.body.library_ID;
  const zipper = req.body.zip_code;
  Patron.create({
    first_name: firstName,
    last_name: lastName,
    address: address,
    email: email,
    library_id: libID,
    zip_code: zipper
  })
    .then(patron => {
      console.log(patron);
      res.redirect("/all_patrons");
    })
    .catch(err => console.log(err));
});

module.exports = router;
