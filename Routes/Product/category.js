const category = require("express").Router();
const Category = require("../../model/categorySchema");

category.get("/get-all", async (req, res) => {
  try {
    const result = await Category.find();
    res.status(200).send(result);
  } catch (error) {
    res.send(error);
  }
});

category.post("/add-new", async (req, res) => {
  try {
    let { title, image } = req.body;

    const category = Category({
      image,
      title,
    });
    category
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

module.exports = category;
