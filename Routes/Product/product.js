const express = require("express");
const product = express.Router();
const Product = require("../../model/productSchema");

product.get("/get-all", async (req, res) => {
  try {
    const result = await Product.find().populate("category_id");
    res.status(200).send(result);
  } catch (error) {
    res.send(error);
  }
});

product.post("/add-new", async (req, res) => {
  try {
    let { category_id, title, price, discountPrice, description, images } =
      req.body;
    price = parseInt(price);
    discountPrice = parseInt(discountPrice);

    const product = Product({
      category_id,
      title,
      price,
      discountPrice,
      description,
      images,
    });
    product
      .save()
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.send(error);
      });
  } catch (error) {
    res.send(error);
  }
});

module.exports = product;
