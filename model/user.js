const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter a name"],
  },
  universityId: {
    type: String,
    required: [true, "please enter the universityId"],
  },
  password: {
    type: String,
    required: [true, "please enter a password"],
  },
  availability: [
    {
      day: {
        type: String,
      },
      time: {
        type: String,
      },
    },
  ],
  booked_sessions: [
    {
      day: {
        type: String,
      },
      time: {
        type: String,
      },
      session: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
