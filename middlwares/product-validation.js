const { body } = require("express-validator");
const productValidation = () => {
  return [
    body("name")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters long"),
    body("price").isFloat().withMessage("Price must be a number"),
  ];
};

module.exports = { productValidation };
