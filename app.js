const express = require("express");
const routers = require("./routers/index");
const sequelize = require("./db");
const session = require("express-session");

sequelize
  .sync()
  .then(() => {
    console.log("success");
  })
  .catch((err) => {
    console.log("something went wrong " + err);
  });

const app = express();

app.use(
  session({
    secret: "mySecretKeyhss",
    resave: false,
    saveUninitialized: false
  })
);
app.use(express.json());
app.use(routers.user);
app.use("/auth", routers.auth);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan pada port ${PORT}`);
});
