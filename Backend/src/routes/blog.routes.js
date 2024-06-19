const express = require("express");
const router = express.Router();
const { uploadImgStorage } = require("../utils/file-upload.utils");
const { isAuthenticated } = require("../middleware/authentication.middelware");
const {
  getBlog,
  getBlogs,
  createBlog,
  getMyBlogs,
  updateBlog,
  deleteBlog
} = require("../controller/blog.controller");

module.exports = () => {
  router.get("/getBlogs", getBlogs);
  router.post("/getBlog", getBlog);
  router.get("/myBlog", isAuthenticated, getMyBlogs);
  router.post("/createBlog", isAuthenticated, uploadImgStorage, createBlog);
  router.patch("/updateBlog", isAuthenticated, uploadImgStorage, updateBlog);
  router.delete("/deleteBlog",isAuthenticated, uploadImgStorage, deleteBlog);
  return router;
};
