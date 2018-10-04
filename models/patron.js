const Sequelize = require("sequelize");
const sequelize = require("./index");

//Define Patron model
const Patron = sequelize.define(
  "patron",
  {
    first_name: {
      type: Sequelize.TEXT,
      validate: {
        notEmpty: {
          msg: "First name is required"
        }
      }
    },
    last_name: {
      type: Sequelize.TEXT,
      validate: {
        notEmpty: {
          msg: "Last name is required"
        }
      }
    },
    address: {
      type: Sequelize.TEXT,
      validate: {
        notEmpty: {
          msg: "Address is required"
        }
      }
    },
    email: {
      type: Sequelize.TEXT,
      validate: {
        notEmpty: {
          msg: "Email is required"
        }
      }
    },
    library_id: {
      type: Sequelize.TEXT,
      validate: {
        notEmpty: {
          msg: "Library ID is required"
        }
      }
    },
    zip_code: {
      type: Sequelize.INTEGER,
      validate: {
        notEmpty: {
          msg: "Zip code is required"
        }
      }
    }
  },
  {
    timestamps: false
  }
);

module.exports = Patron;
