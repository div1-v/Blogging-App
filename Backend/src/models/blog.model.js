const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  blogUrl: {
    type: String,
    required: false,
  },
  author: {
    type: String,
    required: true,
  },
  Publication_date: {
    type: Date,
    required: true,
  },
  created_by: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Blog", blogSchema);
