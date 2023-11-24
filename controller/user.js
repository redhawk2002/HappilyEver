const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

exports.register = async (req, res) => {
  try {
    const { name, universityId, password } = req.body;

    const user = await User.findOne({ universityId });

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
exports.freeSession = async (req, res) => {
  try {
    const users = await User.find({});

    let availabilityData = [];

    users.forEach((user) => {
      const { availability } = user;
      if (availability.length === 0) {
        return;
      }
      availabilityData.push({
        userId: user._id,
        availability: availability,
      });
    });

    return res.json({
      success: true,
      total: availabilityData.length,
      availabilityData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.bookSlot = async (req, res) => {
  try {
    const { day, time, id } = req.body;
    const userId = new mongoose.Types.ObjectId(id);

    const user = await User.findById(userId);

    const existingBooking = user.booked_sessions.find(
      (booking) => booking.day === day && booking.time === time
    );

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "User has already booked a session for the same day and time",
      });
    }

    const bookedData = {
      day: day,
      time: time,
      session: req.user._id,
    };

    user.booked_sessions.push(bookedData);
    await user.save();

    return res.status(200).json({
      success: true,
      data: bookedData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.markCompleteSlot = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { day, time, id } = req.body;

    const index = user.booked_sessions.findIndex((booking) => {
      return (
        booking.day === day && booking.time === time && booking.session == id
      );
    });

    user.booked_sessions.splice(index, 1);
    if (index !== -1) {
      user.booked_sessions.splice(index, 1);

      await user.save();

      return res.status(200).json({
        success: true,
        message: "Slot removed successfully",
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Slot not found",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
