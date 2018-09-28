const express = require("express");
const app = express();
const Sequelize = require("sequelize");
// const Book = require("./models/book");

//SET VIEW ENGINE
app.set("view engine", "pug");
app.use("/static", express.static("public"));

//CONFIG SEQUELIZE
const sequelize = new Sequelize("development", "root", "password", {
  dialect: "sqlite",
  storage: "./library.db"
});

//Define book model
const Book = sequelize.define(
  "book",
  {
    title: {
      type: Sequelize.TEXT
    },
    author: {
      type: Sequelize.TEXT
    },
    genre: {
      type: Sequelize.STRING
    },
    first_published: {
      type: Sequelize.INTEGER
    }
  },
  {
    timestamps: false
  }
);

//Define Patron model
const Patron = sequelize.define(
  "patron",
  {
    first_name: {
      type: Sequelize.TEXT
    },
    last_name: {
      type: Sequelize.TEXT
    },
    address: {
      type: Sequelize.TEXT
    },
    email: {
      type: Sequelize.TEXT
    },
    library_id: {
      type: Sequelize.TEXT
    },
    zip_code: {
      type: Sequelize.INTEGER
    }
  },
  {
    timestamps: false
  }
);

//Define Loan model
const Loan = sequelize.define(
  "loan",
  {
    book_id: {
      type: Sequelize.INTEGER
    },
    patron_id: {
      type: Sequelize.INTEGER
    },
    loaned_on: {
      type: Sequelize.DATE
    },
    return_by: {
      type: Sequelize.DATE
    },
    returned_on: {
      type: Sequelize.DATE
    }
  },
  {
    timestamps: false
  }
);

//GET INDEX
app.get("/", (req, res) => {
  res.render("index");
});

//GET ALL BOOKS
app.get("/all_books", (req, res) => {
  Book.findAll().then(bookerT => {
    res.render("all_books", { books: bookerT });
    // console.log(bookerT[0].dataValues);
  });
});

//GET ALL PATRONS
app.get("/all_patrons", (req, res) => {
  Patron.findAll().then(patronage => {
    res.render("all_patrons", { patrons: patronage });
    // console.log(patronage[0].dataValues);
  });
});

//GET ALL LOANS
app.get("/all_loans", (req, res) => {
  Loan.findAll().then(loaner => {
    res.render("all_loans", { loans: loaner });
    console.log(loaner[0].dataValues);
  });
});

// Uploading a value- Book (working)
// sequelize
//   .sync()
//   .then(() =>
//     Book.create({
//       title: "Smararfield",
//       author: "JK Boring",
//       genre: "Childrens",
//       first_published: 2012,
//       timestamps: false
//     })
//   )
//   .then(jane => {
//     console.log(jane.toJSON());
//   });

//Uploading a value- User (working)
// sequelize
//   .sync()
//   .then(() =>
//     User.create({
//       username: "harry potter smells"
//     })
//   )
//   .then(jane => {
//     console.log(jane.toJSON());
//   });

// Pulling a value- (working)
// sequelize.sync().then(() =>
//   Book.findAll().then(user => {
//     console.log(user);
//   })
// );

//////////////////
//SERVER SETUP////
//////////////////
const port = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log("Library Manager fired up");
  });
});
