const jwt = require("jsonwebtoken");
const { FAIL, SUCCESS, ERROR } = require("../utils/httpStatusText");

const verifyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      status: FAIL,
      message: "Unauthorized",
      code: 401,
      data: null,
    });
  }

  const token = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      status: FAIL,
      message: "Forbidden",
      code: 403,
      data: null,
    });
  }
};

module.exports = verifyToken;
