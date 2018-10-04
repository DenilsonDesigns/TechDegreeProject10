const Sequelize = require("sequelize");
const sequelize = require("./index");

//Define book model
const Book = sequelize.define(
  "book",
  {
    title: {
      type: Sequelize.TEXT,
      validate: {
        notEmpty: {
          msg: "Title is required"
        }
      }
    },
    author: {
      type: Sequelize.TEXT,
      validate: {
        notEmpty: {
          msg: "Author is required"
        }
      }
    },
    genre: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: {
          msg: "Genre is required"
        }
      }
    },
    first_published: {
      type: Sequelize.INTEGER,
      validate: {
        notEmpty: {
          msg: "Published year is required"
        },
        isInt: {
          msg: "Please enter a year 'YYYY'"
        }
      }
    }
  },
  {
    timestamps: false
  }
);

module.exports = Book;
