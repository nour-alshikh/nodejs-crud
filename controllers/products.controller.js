const { validationResult } = require("express-validator");
const Product = require("../models/product.model");
const { SUCCESS, ERROR, FAIL } = require("../utils/httpStatusText");

const getProducts = async (req, res) => {
  const { limit = 10, page = 1 } = req.query;
  try {
    const products = await Product.find({}, { __v: false })
      .limit(Number(limit))
      .skip(Number((page - 1) * limit));
    return res.status(200).json({
      status: SUCCESS,
      data: { products },
    });
  } catch (error) {
    return res.status(500).json({
      status: ERROR,
      message: error.message,
      code: 500,
      data: null,
    });
  }
};

const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id, { __v: false });
  if (!product) {
    return res.status(404).json({
      status: FAIL,
      message: "Product not found",
    });
  }
  return res.status(200).json({
    status: SUCCESS,
    data: {
      product,
    },
  });
};

const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: FAIL,
      errors: errors.array(),
    });
  }
  try {
    const product = await Product.create(req.body);
    return res.status(201).json({
      status: SUCCESS,
      data: {
        product,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: ERROR,
      message: error.message,
      code: 500,
      data: null,
    });
  }
};

const updateProduct = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      status: FAIL,
      message: "No data to update",
    });
  }
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({
        status: FAIL,
        message: "Product not found",
      });
    }
    return res.status(200).json({
      status: SUCCESS,
      data: {
        product,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: ERROR,
      message: error.message,
      code: 500,
      data: null,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        status: FAIL,
        message: "Product not found",
      });
    }
    return res.status(200).json({
      status: SUCCESS,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: ERROR,
      message: error.message,
      code: 500,
      data: null,
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
