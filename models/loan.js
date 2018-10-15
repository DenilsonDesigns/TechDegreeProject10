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
      type: Sequelize.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: {
          isDate: true,
          msg: "Loaned on date is required"
        }
      }
    },
    return_by: {
      type: Sequelize.DATEONLY,
      validate: {
        notEmpty: {
          msg: "Return by date required"
        }
      }
    },
    returned_on: {
      type: Sequelize.DATEONLY
    }
  },
  {
    timestamps: false
  }
);

// zip_code: {
//   type: Sequelize.INTEGER,
//   validate: {
//     notEmpty: {
//       msg: "Zip code is required"
//     }
//   }
// }

Loan.belongsTo(Patron, { foreignKey: "patron_id" });
Loan.belongsTo(Book, { foreignKey: "book_id" });

module.exports = Loan;
