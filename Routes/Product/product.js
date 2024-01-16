const express = require("express");
const product = express.Router();
const Product = require("../../model/productSchema");

product.get("/get-all", async (req, res) => {
  try {
    const { categoryIds } = req.query;

    let filter = {};
    if (categoryIds) {
      const categoryIdArray = categoryIds.split(",");
      filter = { category_id: { $in: categoryIdArray } };
    }

    const result = await Product.find(filter).populate("category_id");
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

product.post("/add", async (req, res) => {
  try {
    let { category_id, name, price, discountPrice, description, images } =
      req.body;
    price = parseInt(price);
    discountPrice = parseInt(discountPrice);

    const product = Product({
      category_id,
      name,
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

product.post("/update/:id", async (req, res) => {
  let { category_id, name, price, discountPrice, description, images } =
    req.body;
  price = parseInt(price);
  discountPrice = parseInt(discountPrice);

  const { id } = req.params;

  const response = await Product.updateOne(
    { _id: id },
    { category_id, name, price, discountPrice, description, images }
  );
  res.send(response);
});

product.post("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Product.deleteOne({ _id: id });

    // Check if the delete operation was successful
    if (result.deletedCount > 0) {
      res.send({ success: true, message: "Product deleted successfully" });
    } else {
      res.status(404).send({ success: false, message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});

product.post("/featured/:id", async (req, res) => {
  const { id } = req.params;

  let count = await Product.find({ featured: true });
  count = count.length;
  if (count < 4) {
    const response = await Product.updateOne({ _id: id }, { featured: true });
    res.send(response);
  } else {
    res.status(202).send("Remove prodcuts from featured");
  }
});

product.post("/remove-featured/:id", async (req, res) => {
  const { id } = req.params;

  const response = await Product.updateOne({ _id: id }, { featured: false });
  res.send(response);
});

module.exports = product;
