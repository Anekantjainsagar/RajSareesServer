const express = require("express");
const login = express.Router();
const mongoose = require("mongoose");

const Order = require("../../model/orderSchema");

// Controllers
const {
  signInUser,
  signUp,
  getUser,
  updateUser,
} = require("../../controllers/Login/index");
// const { sendMail } = require("../../controllers/Login/otp");
// const {
//   sendUrl,
//   verifyUrl,
//   resetPassword,
// } = require("../../controllers/Login/passwordReset");

// Middlewares
const {
  validateSignUp,
  userValidationResult,
} = require("../../middlewares/index");
const { validateSingin } = require("../../middlewares/auth");
// const {
//   passswordValidate,
//   passswordValidationResult,
// } = require("../../middlewares/passwordReset");

// Routes
login.post("/get-user", validateSingin, getUser);
login.post("/update-user", validateSingin, updateUser);

login.post("/signup", validateSignUp, userValidationResult, signUp);
login.post("/signin", signInUser);

login.post("/get-orders", validateSingin, async (req, res) => {
  const { id } = req;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid user ID");
  }

  try {
    const result = await Order.find({
      user_id: id,
      status: "NewOrder",
    }).populate("user_id payment_id");
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Password reset
// login.post("/password-reset", sendUrl);
// login.get("/password-reset/:id/:token", verifyUrl);
// login.post(
//   "/password-reset/reset/:id/:token",
//   passswordValidate,
//   passswordValidationResult,
//   resetPassword
// );

// login.use("/otp-verification", validateSignUp, userValidationResult, sendMail);

module.exports = login;
