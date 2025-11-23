const express = require("express");
const {
  getUsers,
  register,
  login,
} = require("../controllers/users.controller");
const verifyToken = require("../middlwares/verifyToken");
const allowedTo = require("../middlwares/allowedTo");
const userRoles = require("../utils/userRoles");
const router = express.Router();

const multer = require("multer");

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const uniqueSuffix = `user-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}.${ext}`;
    cb(null, uniqueSuffix);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type.Must be an image."), false);
  }
};

const upload = multer({ storage: diskStorage, fileFilter });

router.route("/").get(verifyToken, allowedTo(userRoles.ADMIN), getUsers);
router.route("/register").post(upload.single("avatar"), register);
router.route("/login").post(login);

module.exports = router;
