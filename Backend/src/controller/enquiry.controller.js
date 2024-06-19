const Enquiry = require("../models/enquiry.model");
// const emailQueue = require("../utils/emailQueue.utils");
const { sendPasswordToEmail } = require("../utils/send-mail.utils");
const { success, failure } = require("../utils/response.utils");
const { httpsStatusCodes, serverResponseMessage } = require("../constants/");
// const useragent = require("useragent");

exports.createEnquiry = async (req, res) => {
  try {
    const { name, title, email } = req.body;
    // const userAgentString = req.headers["user-agent"];
    // const agent = useragent.parse(userAgentString);

    // const browserName = agent.family;
    // const deviceName = `${agent.os.family} ${agent.device.family}`;
    // console.log("Browser Name:", browserName);
    // console.log("Device Name:", deviceName);
    const data = {
      ...req.body,
    };
    subject = `Your Enquiry about ${title} has been received`;
    text = `<h1>Dear ${name.toUpperCase()}</h1> 
    <h4>Thank you for reaching out to us regarding ${title}. 
    We appreciate your interest and are pleased to provide you with the information you requested.</h4> 
    <h4>If you have any further questions or need additional information, please do not hesitate to contact us. 
    We are here to assist you and ensure you have all the information you need.</h4>
    <h4>Best regards, <br>
    Blogging World Team</h4>`;
    sendPasswordToEmail(email, subject, text);
    const response = await Enquiry.create(data);
    return success(
      res,
      httpsStatusCodes.CREATED,
      serverResponseMessage.ENQUIRY_CREATED_SUCCESSFULLY,
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

exports.getEnquiries = async (req, res) => {
  try {
    const { user } = req;
    if (user.user_type === 2) {
      return failure(
        res,
        httpsStatusCodes.ACCESS_DENIED,
        serverResponseMessage.ACCESS_DENIED
      );
    }
    const response = await Enquiry.find();
    return success(
      res,
      httpsStatusCodes.SUCCESS,
      serverResponseMessage.ENQUIRY_FETCHED_SUCCESSFULLY,
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

exports.deleteEnquiries = async (req, res) => {
  try {
    const { user } = req;
    const { _id } = req.body;
    if (user.user_type === 2) {
      return failure(
        res,
        httpsStatusCodes.ACCESS_DENIED,
        serverResponseMessage.ACCESS_DENIED
      );
    }
    const response = await Enquiry.findByIdAndDelete(_id);
    return success(
      res,
      httpsStatusCodes.SUCCESS,
      serverResponseMessage.ENQUIRY_DELETED_SUCCESSFULLY,
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
