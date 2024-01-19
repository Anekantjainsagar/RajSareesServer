const express = require("express");
const product = express.Router();
const Product = require("../../model/productSchema");
const Login = require("../../model/loginSchema");

const { validateSingin } = require("../../middlewares/auth");

product.get("/get-all", async (req, res) => {
  try {
    const { categoryIds, color, gender, fabric } = req.query;

    let filter = {};
    if (categoryIds) {
      const categoryIdArray = categoryIds.split(",");
      filter.category_id = { $in: categoryIdArray };
    }

    if (fabric) {
      const categoryIdArray = fabric.split(",");
      filter.fabric = { $in: categoryIdArray };
    }

    if (gender) {
      const categoryIdArray = gender.split(",");
      filter.gender = { $in: categoryIdArray };
    }

    if (color) {
      const categoryIdArray = color.split(",");
      filter.color = { $in: categoryIdArray };
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
    let {
      category_id,
      name,
      price,
      discountPrice,
      description,
      images,
      gender,
      fabric,
      color,
    } = req.body;
    price = parseInt(price);
    discountPrice = parseInt(discountPrice);
    gender = gender.toLowerCase();
    fabric = fabric.toLowerCase();
    color = color.toLowerCase();

    const product = Product({
      category_id,
      name,
      price,
      discountPrice,
      description,
      images,
      gender,
      fabric,
      color,
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
  let {
    category_id,
    name,
    price,
    discountPrice,
    description,
    images,
    gender,
    fabric,
    color,
  } = req.body;
  price = parseInt(price);
  discountPrice = parseInt(discountPrice);
  gender = gender.toLowerCase();
  fabric = fabric.toLowerCase();
  color = color.toLowerCase();

  const { id } = req.params;

  const response = await Product.updateOne(
    { _id: id },
    {
      category_id,
      name,
      price,
      discountPrice,
      description,
      images,
      gender,
      fabric,
      color,
    }
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

product.post(
  "/add-to-wishlist/:product_id",
  validateSingin,
  async (req, res) => {
    const { id } = req;
    const { product_id } = req.params;

    try {
      const response = await Login.updateOne(
        { _id: id },
        { $push: { wishlist: product_id } }
      );
      res.send(response);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

product.post(
  "/remove-from-wishlist/:product_id",
  validateSingin,
  async (req, res) => {
    const { id } = req;
    const { product_id } = req.params;

    try {
      const response = await Login.updateOne(
        { _id: id },
        { $pull: { wishlist: product_id } }
      );
      res.send(response);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = product;
