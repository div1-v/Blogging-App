const Blog = require("../models/blog.model");
const User = require("../models/user.model");
const { success, failure } = require("../utils/response.utils");
const { httpsStatusCodes, serverResponseMessage } = require("../constants");
const {cloudinary} = require("../configs");

exports.getBlogs = async (req, res) => {
  try {
    const response = await Blog.find();
    return success(
      res,
      httpsStatusCodes.SUCCESS,
      serverResponseMessage.BLOGS_FETCHED_SUUCESSFULLY,
      response
    );
  } catch (error) {
    return failure(
      res,
      httpsStatusCodes.INTERNAL_SERVER_ERROR,
      serverResponseMessage.INTERNAL_SERVER_ERROR
    );
  }
};

exports.getBlog = async (req, res) => {
  try {
    const { _id } = req.body;
    const blog = await Blog.findOne({ _id });
    if (!blog) {
      return failure(
        res,
        httpsStatusCodes.NOT_FOUND,
        serverResponseMessage.BLOG_NOT_FOUND
      );
    }
    return success(
      res,
      httpsStatusCodes.SUCCESS,
      serverResponseMessage.BLOG_FETCHED_SUUCESSFULLY,
      blog
    );
  } catch (error) {
    return failure(
      res,
      httpsStatusCodes.INTERNAL_SERVER_ERROR,
      serverResponseMessage.INTERNAL_SERVER_ERROR
    );
  }
};

exports.createBlog = async (req, res) => {
  try {
    // console.log(req.headers.host)
    const { user } = req;
    const author = await User.findOne({ _id: user.id });
    const result = await cloudinary.uploader.upload(req.file.path);
    const blogPath = result.secure_url; 
    const date = new Date();
    const data = {
      ...req.body,
      author: author.first_name + " " + author.last_name,
      blogUrl: blogPath,
      Publication_date: date,
      created_by: user.id,
    };
    const response = await Blog.create(data);
    return success(
      res,
      httpsStatusCodes.CREATED,
      serverResponseMessage.BLOG_CREATED_SUCCESSFULLY,
      response
    );
  } catch (error) {
    console.log(error);
    return failure(
      res,
      httpsStatusCodes.INTERNAL_SERVER_ERROR,
      serverResponseMessage.INTERNAL_SERVER_ERROR
    );
  }
};

exports.getMyBlogs = async (req, res) => {
  try {
    const { user } = req;
    const response = await Blog.find({ created_by: user.id });
    return success(
      res,
      httpsStatusCodes.SUCCESS,
      serverResponseMessage.BLOGS_FETCHED_SUUCESSFULLY,
      response
    );
  } catch (error) {
    return failure(
      res,
      httpsStatusCodes.INTERNAL_SERVER_ERROR,
      serverResponseMessage.INTERNAL_SERVER_ERROR
    );
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { user } = req;
    let blogPath;
    const { _id } = req.body;
    const blog = await Blog.findOne({ _id });
    if (!blog) {
      return failure(
        res,
        httpsStatusCodes.NOT_FOUND,
        serverResponseMessage.BLOG_NOT_FOUND
      );
    }
    if (user.id !== blog.created_by) {
      return failure(
        res,
        httpsStatusCodes.ACCESS_DENIED,
        serverResponseMessage.ACCESS_DENIED
      );
    }
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      blogPath = result.secure_url;
    } else {
      blogPath = blog.blogUrl;
    }
    const data = {
      ...req.body,
      blogUrl: blogPath,
    };
    const response = await Blog.findByIdAndUpdate(_id, data, { new: true });
    return success(
      res,
      httpsStatusCodes.SUCCESS,
      serverResponseMessage.BLOG_UPDATED_SUCCESSFULLY,
      response
    );
  } catch (error) {;
    return failure(
      res,
      httpsStatusCodes.INTERNAL_SERVER_ERROR,
      serverResponseMessage.INTERNAL_SERVER_ERROR
    );
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { user } = req;
    const { _id } = req.body;
    const blog = await Blog.findOne({ _id });
    if (!blog) {
      return failure(
        res,
        httpsStatusCodes.NOT_FOUND,
        serverResponseMessage.BLOG_NOT_FOUND
      );
    }
    if (user.id !== blog.created_by) {
      return failure(
        res,
        httpsStatusCodes.ACCESS_DENIED,
        serverResponseMessage.ACCESS_DENIED
      );
    }
    await removeBlog(blog);
    await Blog.findByIdAndDelete(_id);
    return success(
      res,
      httpsStatusCodes.SUCCESS,
      serverResponseMessage.BLOG_DELETED_SUCCESSFULLY
    );
  } catch (error) {
    return failure(
      res,
      httpsStatusCodes.INTERNAL_SERVER_ERROR,
      serverResponseMessage.INTERNAL_SERVER_ERROR
    );
  }
};
