const Sequelize = require("sequelize");
const sequelize = require("./index");

const Book = require("./book");
const Patron = require("./patron");

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

module.exports = Loan;
