const express = require("express");
const {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory,
} = require("../../controllers/categories/categoriesController");
const isLoggedIn = require("../../middlewares/isLogged");

const categoryRouter = express.Router();

//create
categoryRouter.post("/", isLoggedIn, createCategory);
//?all
categoryRouter.get("/", getCategories);
// ! delete
categoryRouter.delete("/:id", isLoggedIn, deleteCategory);
// * Update
categoryRouter.put("/:id", isLoggedIn, updateCategory);

module.exports = categoryRouter;
