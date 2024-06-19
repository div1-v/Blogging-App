const mongoose = require("mongoose");

const Schema = mongoose.Schema;
``;
const userSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  user_name: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  user_type: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
