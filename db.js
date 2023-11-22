const { Sequelize } = require("sequelize");

const connetDb = new Sequelize("upwork-test", "root", null, {
  host: "localhost",
  dialect: "mysql"
});

module.exports = connetDb;
