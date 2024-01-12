const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  title: String,
  image: String,
});

const CategorySchema = mongoose.model("Category", categorySchema);
module.exports = CategorySchema;
