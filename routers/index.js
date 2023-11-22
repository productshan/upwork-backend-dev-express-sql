const user = require("./user.router");
const auth = require("./auth.router");

const routers = {
  user: user,
  auth: auth
};

module.exports = routers;
