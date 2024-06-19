const express = require("express");
const router = express.Router();
module.exports = () => {
  router.use("/certificate", require("./certificate.routes")(router));
  router.use("/enquiry", require("./enquiry.routes")(router));
  router.use("/user", require("./user.routes")(router));
  router.use("/blog", require("./blog.routes")(router));
  return router;
};
