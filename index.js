require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const { FAIL } = require("./utils/httpStatusText");
const productsRoute = require("./routes/products.route");
const usersRoute = require("./routes/users.route");
const path = require("path");
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });

app.use(express.json());

app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/products", productsRoute);
app.use("/api/users", usersRoute);

app.use((req, res) => {
  return res.status(404).json({
    status: FAIL,
    message: "Page not found",
  });
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Server started on port " + process.env.PORT);
});
