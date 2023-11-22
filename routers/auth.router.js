const express = require("express");
const router = express.Router();
const models = require("../model/index");
const helper = require("../helper/index");

function loginThrottle() {
  async (req, res, next) => {
    if (req.path === "/login" && req.method === "POST") {
      const { email, password } = req.body;
      const maxLoginAttempts = 3;
      // const lockOutTime = 60 * 3;
      const lockOutTime = 30;

      try {
        let user = await models.user.findOne({ where: { email: email } });

        if (!user) return res.status(404).json({ message: "Not found" });

        if (user.loginAttemps >= maxLoginAttempts) {
          const timeSinceLastAttemp = Math.floor((Date.now() - user.lastLoginAttemp) / 1000);
          const remainingTime = lockOutTime - timeSinceLastAttemp;
          if (timeSinceLastAttemp < lockOutTime) {
            return res.status(429).json({ message: `You reach maximum login attemp, please try again in ${remainingTime} second` });
          } else {
            user.loginAttemps = 0;
            user.save();
          }
        }

        if (password === user.password) {
          user.loginAttemps = 0;
        } else {
          user.loginAttemps++;
          user.lastLoginAttemp = Date.now();
        }
        await user.save();

        if (user.loginAttemps >= 1) return res.status(301).json({ message: "Wrong password or username" });
      } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
      }
    }
    next();
  };
}

router.post("/login", helper.bodyHelper.checkFields(["password", "email"]), loginThrottle(), async (req, res) => {
  try {
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.patch("/password/email=/:email", helper.bodyHelper.checkFields(["newPassword", "password"]), async (req, res) => {
  const { password, newPassword } = req.body;

  try {
    const user = await models.user.findOne({
      where: {
        email: req.params.email
      }
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.password !== password) return res.status(301).json({ message: "Invalid username or password" });

    await models.user.update({ password: newPassword }, { where: { email: req.params.email } });

    return res.status(200).json({ message: "Success patching password" });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong while try to login"
    });
  }
});

module.exports = router;
