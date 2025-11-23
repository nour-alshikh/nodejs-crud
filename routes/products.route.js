const express = require("express");
const {
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  createProduct,
} = require("../controllers/products.controller");
const { productValidation } = require("../middlwares/product-validation");
const verifyToken = require("../middlwares/verifyToken");
const router = express.Router();

router
  .route("/")
  .get(verifyToken, (req, res) => {
    getProducts(req, res);
  })
  .post(productValidation(), verifyToken, (req, res) => {
    createProduct(req, res);
  });

router
  .route("/:id")
  .get(verifyToken, (req, res) => {
    getProduct(req, res);
  })
  .patch(verifyToken, (req, res) => {
    updateProduct(req, res);
  })
  .delete(verifyToken, (req, res) => {
    deleteProduct(req, res);
  });

module.exports = router;
