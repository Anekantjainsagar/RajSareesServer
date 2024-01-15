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

category.post("/add", async (req, res) => {
  try {
    let { title, image, desc } = req.body;

    const category = Category({
      image,
      title,
      desc,
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

category.post("/delete/:id", async (req, res) => {
  const { id } = req.params;
  console.log(req.params);

  try {
    const result = await Category.deleteOne({ _id: id });

    // Check if the delete operation was successful
    if (result.deletedCount > 0) {
      res.send({ success: true, message: "Category deleted successfully" });
    } else {
      res.status(404).send({ success: false, message: "Category not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});

category.post("/update/:id", async (req, res) => {
  const { title, image, desc } = req.body;
  const { id } = req.params;

  const response = await Category.updateOne(
    { _id: id },
    { title, image, desc }
  );
  res.send(response);
});

module.exports = category;
