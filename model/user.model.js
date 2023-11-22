const { DataTypes } = require("sequelize");
const dbController = require("../db");

const User = dbController.define(
  "user",
  {
    //Start Region
    //Defining table attribute
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    loginAttemps: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    lastLoginAttemp: {
      type: DataTypes.DATE,
      defaultValue: null
    }
    //End Region
  },
  //Soft deleting implemented
  { paranoid: true }
);

module.exports = User;
