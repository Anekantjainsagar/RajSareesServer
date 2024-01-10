const Login = require("../../model/loginSchema");

exports.sendMail = async (req, res) => {
  let email = req.body.email;
  email = email.toLowerCase();

  let data = await Login.findOne({ email });

  if (data) {
    res.status(202).send({ data: "Email Already Exists", success: false });
  } else {
    if (email) {
      const otp = otpGenerator.generate(4, {
        upperCaseAlphabets: false,
        specialChars: false,
        digits: true,
        lowerCaseAlphabets: false,
      });

      res.status(200).send({
        data: "OTP sent successfully via Email. If not receiving email check spam folder",
        otp: otp,
        success: true,
      });
    } else {
      res
        .status(203)
        .json({ data: "Please enter a valid email", success: false });
    }
  }
};
