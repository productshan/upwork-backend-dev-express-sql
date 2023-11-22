const express = require("express");
const router = express.Router();
const models = require("../model/index");
const helper = require("../helper/index");

router.get("/users", async (req, res) => {
  try {
    const users = await models.user.findAll();
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong while fetching users."
    });
  }
});

router.post("/users", helper.bodyHelper.checkFields(["firstName", "lastName", "email", "password"]), async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const newUser = await models.user.create({ firstName, lastName, email, password });
    return res.status(200).json({ message: "Success", data: newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong while creating new user"
    });
  }
});

router.patch("/users/email=/:email", helper.bodyHelper.checkFields(["firstName", "lastName"]), async (req, res) => {
  const { firstName, lastName } = req.body;
  try {
    const updatedUser = await models.user.update({ firstName: firstName, lastName: lastName }, { where: { email: req.params.email } });
    return res.status(200).json({ message: "Success patching user", data: updatedUser });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while pathing user"
    });
  }
});

router.delete("/users/email=/:email", async (req, res) => {
  try {
    const deletedUser = await models.user.destroy({ where: { email: req.params.email } });
    return res.status(200).json({ message: "Success deleting user", data: deletedUser });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong while pathing user"
    });
  }
});

module.exports = router;
