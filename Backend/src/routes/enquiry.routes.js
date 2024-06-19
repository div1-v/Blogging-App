const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/authentication.middelware");
const {
  createEnquiry,
  getEnquiries,
  deleteEnquiries,
} = require("../controller/enquiry.controller");

module.exports = () => {
  router.post("/createEnquiry", createEnquiry);
  router.get("/getEnquiry", isAuthenticated, getEnquiries);
  router.delete("/deleteEnquiry", isAuthenticated, deleteEnquiries);
  return router;
};
