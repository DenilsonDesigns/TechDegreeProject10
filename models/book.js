const Sequelize = require("sequelize");
const sequelize = require("./index");

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

module.exports = Book;
