const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, ""],
      trim: true,
    },
    password: {
      type: String,
      required: [true, ""],
      min: 6,
      max: 64,
    },
    role: {
      type: String,
      default: "USER",
    },
    email: {
      type: String,
      required: [true, ""],
      trim: true,
      unique: true,
    },
    fullname: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },

    image: {
      public_id: {
        type: String,
        required: [true, ""],
      },
      url: {
        type: String,
        required: [true, ""],
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
