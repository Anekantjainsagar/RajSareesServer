const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  title: String,
  price: Number,
  discountPrice: Number,
  description: String,
  images: Array,
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
