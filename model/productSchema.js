const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  name: String,
  price: Number,
  discountPrice: Number,
  description: String,
  images: Array,
  category: String,
  gender: {
    type: String,
    default: "Women",
  },
  fabric: {
    type: String,
    default: "Cotton",
  },
  color: {
    type: String,
    default: "",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  featured: {
    type: Boolean,
    default: false,
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
