const express = require("express");
const app = express();
const Sequelize = require("sequelize");
const bodyParser = require("body-parser");

//SET VIEW ENGINE
app.set("view engine", "pug");
app.use("/static", express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//CONFIG SEQUELIZE
const sequelize = new Sequelize("development", "root", "password", {
  dialect: "sqlite",
  omitNull: true,
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

Loan.belongsTo(Patron, { foreignKey: "patron_id" });
Loan.belongsTo(Book, { foreignKey: "book_id" });

//GET INDEX
app.get("/", (req, res) => {
  res.render("index");
});

//GET ALL BOOKS
app.get("/all_books", (req, res) => {
  sequelize.sync().then(() => {
    Book.findAll().then(bookerT => {
      res.render("all_books", { books: bookerT });
      // console.log(bookerT[0].dataValues);
    });
  });
});

//GET ALL PATRONS
app.get("/all_patrons", (req, res) => {
  sequelize.sync().then(() => {
    Patron.findAll().then(patronage => {
      res.render("all_patrons", { patrons: patronage });
      // console.log(patronage[0].dataValues);
    });
  });
});
// Patron.hasOne(Loan, { foreignKey: "patron_id" });
//GET ALL LOANS
app.get("/all_loans", (req, res) => {
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

//GET new book form
app.get("/books/new", (req, res) => {
  res.render("new_book");
});

//POST book form
app.post("/books/new", (req, res) => {
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

//////////////////
//SERVER SETUP////
//////////////////
const port = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log("Library Manager fired up");
  });
});
