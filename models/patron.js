const Sequelize = require("sequelize");
const sequelize = require("./index");

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

module.exports = Patron;
