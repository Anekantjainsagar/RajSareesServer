const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  image: {
    type: String,
    default:
      "https://res.cloudinary.com/dpbsogbtr/image/upload/v1704950539/hgmdbrneq6vaifstxmht.png",
  },
  gender: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

const Login = mongoose.model("Users", loginSchema);
module.exports = Login;
