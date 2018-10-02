const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));

//Method override
const methodOverride = require("method-override");
router.use(methodOverride("_method"));

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

//GET- patron detail
router.get("/patrons/:id/edit", (req, res) => {
  //Get patron by id- must get loan history
  Patron.findById(req.params.id).then(patron => {
    // console.log(patron);
    res.render("patron_detail", { patron: patron });
  });
});

//PUT- Update patron details
router.put("/patrons/:id/", (req, res) => {
  //Find and update correct patron
  Patron.findById(req.params.id)
    .then(patron => {
      patron.update(req.body.patron);
    })
    .then(() => {
      res.redirect("../../all_patrons");
    });
});

module.exports = router;
