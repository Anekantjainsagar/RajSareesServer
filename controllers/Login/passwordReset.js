const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const Login = require("../../model/loginSchema");
const bcrypt = require("bcryptjs");

exports.sendUrl = async (req, res) => {
  const email = req.body.email;
  console.log(req.body);
  const modifiedMail = email.toLowerCase();

  let data = await Login.findOne({ email: modifiedMail });
  if (data) {
    const jwtToken = jwt.sign(
      {
        user: data._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "1hr",
      }
    );
    const uri = `${"https://consciousleap.co"}/user/password-reset/${
      data._id
    }/${jwtToken}`;
    console.log(uri);

    res.status(200).send({
      data: "Password reset link sent to your email account. If not received check spam folder once.",
      url: uri,
      user: data,
    });
  } else {
    res.status(203).json({ data: "User not found", success: false });
  }
};

exports.verifyUrl = async (req, res) => {
  const { id, token } = req.params;

  if (!token) {
    res.status(404).json({ success: false, data: "Cookie not found" });
  } else {
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        res.status(203).json({ success: false, data: "Invalid Url" });
      } else if (user?.user === id) {
        res.status(200).json({ success: true, data: "Url verified" });
      } else {
        res.status(203).json({ success: false, data: "Invalid Url" });
      }
    });
  }
};

exports.resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const data = await Login.findById(id);
  if (data) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const response = await Login.updateOne(
      { _id: id },
      { password: hashedPassword }
    );
    res.status(200).json({ data: data, success: true });
  }
};
