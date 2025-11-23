const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const userRoles = require("../utils/userRoles");

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: [userRoles.ADMIN, userRoles.USER, userRoles.MANAGER],
    default: userRoles.USER,
  },
  avatar: { type: String, default: "uploads/default-avatar.png" },
});

module.exports = mongoose.model("User", userSchema);
