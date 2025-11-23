const { validationResult } = require("express-validator");
const User = require("../models/user.model");
const { SUCCESS, ERROR, FAIL } = require("../utils/httpStatusText");
const bcrypt = require("bcryptjs");
const generateJWTToken = require("../utils/generateJWTToken");

const getUsers = async (req, res) => {
  const { limit = 10, page = 1 } = req.query;
  try {
    const users = await User.find({}, { __v: false, password: false })
      .limit(Number(limit))
      .skip(Number((page - 1) * limit));
    return res.status(200).json({
      status: SUCCESS,
      data: { users },
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

const register = async (req, res) => {
  try {
    // validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: FAIL,
        message: errors.array(),
        code: 400,
        data: null,
      });
    }
    const { firstName, lastName, email, password, role } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: FAIL,
        message: "User already exists",
        code: 400,
        data: null,
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      avatar: req.file.filename,
    });
    await user.save();
    return res.status(201).json({
      status: SUCCESS,
      data: { user },
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

const login = async (req, res) => {
  // validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: FAIL,
      message: errors.array(),
      code: 400,
      data: null,
    });
  }

  // check if user exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({
      status: FAIL,
      message: "User not found",
      code: 400,
      data: null,
    });
  }

  // check if password is correct
  const isPasswordCorrect = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!isPasswordCorrect) {
    return res.status(400).json({
      status: FAIL,
      message: "Incorrect password",
      code: 400,
      data: null,
    });
  }

  // generate token
  const token = generateJWTToken({
    user_id: user._id,
    email: user.email,
    role: user.role,
  });

  // return user and token
  return res.status(200).json({
    status: SUCCESS,
    data: { user, token },
  });
};

module.exports = {
  getUsers,
  register,
  login,
};
