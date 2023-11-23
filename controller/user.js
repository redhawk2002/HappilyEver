const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, universityId, password } = req.body;

    const user = await User.findOne({ universityId });
    console.log(name, universityId, password);
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      universityId,
      password: hashedPassword,
    });

    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET);

    return res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
exports.login = async (req, res) => {
  try {
    const { universityId, password } = req.body;
    const user = await User.findOne({ universityId });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user does not exist",
      });
    }
    const CryptPassword = user.password;
    const isMatch = await bcrypt.compare(password, CryptPassword);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    return res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.pendingList = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const list = user.booked_sessions;

    return res.status(200).json({
      PendingList: list,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.available = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { day, time } = req.body;
    if (!day || !time) {
      return res
        .status(400)
        .json({ success: false, message: "Day and time are required" });
    }
    user.availability.push({
      day,
      time,
    });
    user.save();
    return res
      .status(200)
      .json({ success: true, message: "Availability added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
