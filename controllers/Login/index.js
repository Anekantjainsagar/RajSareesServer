const Login = require("../../model/loginSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
  let { name, email, password, phone } = req.body;

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  email = email.toLowerCase();

  const data = await Login.findOne({ email });

  if (data) {
    res.status(203).json({ data: "Email Already Exists", success: false });
  } else {
    const loginObj = Login({
      email,
      name,
      password,
      phone,
    });
    const jwtToken = jwt.sign(
      {
        user: loginObj._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );
    loginObj
      .save()
      .then((result) => {
        res
          .status(200)
          .send({ data: loginObj, token: jwtToken, success: true });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Internal server error");
      });
  }
};

exports.signInUser = async (req, res) => {
  let { email, password } = req.body;
  email = email.toLowerCase();

  let data = await Login.findOne({ email });

  if (data) {
    const matched = await bcrypt.compare(password, data.password);

    if (matched) {
      const jwtToken = jwt.sign(
        {
          user: data._id,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "1d",
        }
      );
      res.status(200).send({ jwtToken, user: "User" });
    } else {
      res.status(203).json({ data: "Invalid credentials", success: false });
    }
  } else {
    data = await Therapist.findOne({ email });
    if (data) {
      const matched = await bcrypt.compare(password, data.password);

      if (matched) {
        const jwtToken = jwt.sign(
          {
            user: data._id,
          },
          process.env.SECRET_KEY,
          {
            expiresIn: "1d",
          }
        );
        res.status(200).send({ jwtToken, user: "Therapist" });
      } else {
        res.status(203).json({ data: "Invalid credentials", success: false });
      }
    } else {
      data = await Admin.findOne({ email });
      if (data) {
        const matched = await bcrypt.compare(password, data.password);

        if (matched) {
          const jwtToken = jwt.sign(
            {
              user: data._id,
            },
            process.env.SECRET_KEY,
            {
              expiresIn: "1d",
            }
          );
          res.status(200).send({ jwtToken, user: "Admin" });
        } else {
          res.status(203).json({ data: "Invalid credentials", success: false });
        }
      } else {
        res.status(203).json({ data: "Invalid credentials", success: false });
      }
    }
  }
};

exports.getUser = async (req, res) => {
  const { id } = req;

  let user = await Login.findById(id);
  res.send(user);
};

exports.updateUser = async (req, res) => {
  const { id } = req;
  let { name, email, phone } = req.body;

  const response = await Login.updateOne({ _id: id }, { name, email, phone });
  res.status(200).send(response);
};