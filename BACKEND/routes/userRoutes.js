const express = require("express");
const {
  registerController,
  loginController,
} = require("../controllers/authcontroller");

const router = express.Router();

router.post("/auth/createUser", registerController);

router.post("/auth/login", loginController);

module.exports = { router };
