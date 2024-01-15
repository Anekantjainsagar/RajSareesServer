const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  title: String,
  image: String,
  desc: String,
  date: {
    type: Date,
    default: Date.now(),
  },
});

const CategorySchema = mongoose.model("Category", categorySchema);
module.exports = CategorySchema;
