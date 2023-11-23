const User = require("../model/user");
const jwt = require("jsonwebtoken");

exports.isAuthenticated = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  try {
    if (!authHeader) {
      return res.status(401).json({
        message: "please login first",
      });
    }
    const [bearer, token] = authHeader.split(" ");
    console.log(`${bearer} is [ ${token}]`);

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id);
    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
