const User = require("../models/user.model");
const crypto = require("crypto");
const { sendPasswordToEmail } = require("../utils/send-mail.utils");
const { success, failure } = require("../utils/response.utils");
const { httpsStatusCodes, serverResponseMessage } = require("../constants/");
const { jwtConfig } = require("../configs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
  try {
    let { user } = req.params;
    let { email, password, first_name, last_name } = req.body;
    let userType = 2;
    if (user === "admin") {
      userType = 1;
      password = crypto.randomBytes(5).toString("hex");
      const email = await User.findOne({ email: req.body.email });
      if (email) {
        return failure(
          res,
          httpsStatusCodes.BAD_REQUEST,
          serverResponseMessage.EMAIL_ALREADY_EXISTS
        );
      }
      subject = "welcome to blogging world";
      text = `<h1>Dear ${
        first_name.toUpperCase() + " " + last_name.toUpperCase()
      } ,</h1>
      <h1>Welcome to Blogging World </h1> <br> 
      <h2>Your account has been created on blogging world.</h2> 
      <h4>Your new password is: ${password}.</h4>
      <h4>You can <a href="http://192.168.10.79:3000/login">login</a> now </h4> 
      <h4>you can change your password after login from our website.</h4>
      <h4>Best regards, <br>
      Blogging World Team</h4>
      `;
      sendPasswordToEmail(email, subject, text);
    }
    let encryptPassword = await bcrypt.hash(password, 10);
    const data = {
      ...req.body,
      password: encryptPassword,
      user_type: userType,
    };
    const UserEmail = await User.findOne({ email });
    if (UserEmail) {
      return failure(
        res,
        httpsStatusCodes.BAD_REQUEST,
        serverResponseMessage.EMAIL_ALREADY_EXISTS
      );
    }
    const response = await User.create(data);
    return success(
      res,
      httpsStatusCodes.CREATED,
      serverResponseMessage.USER_CREATED_SUCCESSFULLY,
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

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return failure(
        res,
        httpsStatusCodes.UNAUTHORIZED,
        serverResponseMessage.INVALID_CREDENTIALS
      );
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return failure(
        res,
        httpsStatusCodes.UNAUTHORIZED,
        serverResponseMessage.INVALID_CREDENTIALS
      );
    }
    const token = jwt.sign(
      { email: user.email, id: user._id, user_type: user.user_type },
      jwtConfig.jwtSecret,
      {
        expiresIn: jwtConfig.tokenExpiration,
      }
    );
    const data = {
      name: user.first_name + " " + user.last_name,
      id: user._id,
      email: user.email,
      user_type: user.user_type,
      token,
    };
    return success(
      res,
      httpsStatusCodes.SUCCESS,
      serverResponseMessage.LOGIN_SUCCESSFULL,
      data
    );
  } catch (error) {
    return failure(
      res,
      httpsStatusCodes.INTERNAL_SERVER_ERROR,
      serverResponseMessage.INTERNAL_SERVER_ERROR
    );
  }
};

exports.getProfile = async (req, res) => {
  try {
    // const { user } = req;
    const userId = req.body.id;

    const response = await User.findOne({ _id: userId });
    if (!response) {
      return failure(
        res,
        httpsStatusCodes.NOT_FOUND,
        serverResponseMessage.USER_NOT_FOUND
      );
    }

    return success(
      res,
      httpsStatusCodes.SUCCESS,
      serverResponseMessage.PROFILE_FETCHED_SUUCESSFULLY,
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

exports.getProfiles = async (req, res) => {
  try {
    const { user } = req;
    if (user.user_type === 1) {
      const response = await User.find({ user_type: 2 });
      return success(
        res,
        httpsStatusCodes.SUCCESS,
        serverResponseMessage.PROFILES_FETCHED_SUUCESSFULLY,
        response
      );
    }
  } catch (error) {
    return failure(
      res,
      httpsStatusCodes.INTERNAL_SERVER_ERROR,
      serverResponseMessage.INTERNAL_SERVER_ERROR
    );
  }
};

exports.getAdminProfiles = async (req, res) => {
  try {
    const { user } = req;
    if (user.user_type === 1) {
      const response = await User.find({ user_type: 1 });
      return success(
        res,
        httpsStatusCodes.SUCCESS,
        serverResponseMessage.PROFILES_FETCHED_SUUCESSFULLY,
        response
      );
    }
  } catch (error) {
    return failure(
      res,
      httpsStatusCodes.INTERNAL_SERVER_ERROR,
      serverResponseMessage.INTERNAL_SERVER_ERROR
    );
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { user } = req;
    // let { password } = req.body;
    let data = { ...req.body };
    let userId = user.id;
    if (user.user_type === 1) {
      userId = req.body.id;
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: data },
      { new: true }
    );

    // Check if user was found and updated
    if (!updatedUser) {
      return failure(
        res,
        httpsStatusCodes.NOT_FOUND,
        serverResponseMessage.USER_NOT_FOUND
      );
    }

    // Respond with the updated user
    return success(
      res,
      httpsStatusCodes.SUCCESS,
      serverResponseMessage.PROFILE_UPDATED_SUCCESSFULLY,
      updatedUser
    );
  } catch (error) {
    return failure(
      res,
      httpsStatusCodes.INTERNAL_SERVER_ERROR,
      serverResponseMessage.INTERNAL_SERVER_ERROR
    );
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const { user } = req;
    let userId = user.id;
    if (user.user_type === 1) {
      userId = req.body.id;
    }
    const deleteUser = await User.findOneAndDelete(
      { _id: userId },
      { new: true }
    );
    return success(
      res,
      httpsStatusCodes.SUCCESS,
      serverResponseMessage.PROFILE_DELETED_SUCCESSFULLY,
      deleteUser
    );
  } catch (error) {
    return failure(
      res,
      httpsStatusCodes.INTERNAL_SERVER_ERROR,
      serverResponseMessage.INTERNAL_SERVER_ERROR
    );
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const secretCode = crypto.randomBytes(3).toString("hex");
    const userEmail = await User.findOne({ email });
    if (!userEmail) {
      return failure(
        res,
        httpsStatusCodes.NOT_FOUND,
        serverResponseMessage.USER_NOT_FOUND
      );
    }
    subject = "Password Reset";
    text = `<h4>You are requested to reset the password </h4> 
    <h4> Your secret code is: ${secretCode} </h4> 
    <h4>Don't Share this secret code with anyone.</h4>
    <h4> If you did not request a password reset, please ignore this email. </h4>
    <h4>Best regards, <br>
    Blogging World Team</h4>`;
    sendPasswordToEmail(email, subject, text);
    const token = jwt.sign(
      {
        email: userEmail.email,
        id: userEmail._id,
        user_type: userEmail.user_type,
        secretCode,
      },
      jwtConfig.resetPasswordSecret,
      {
        expiresIn: jwtConfig.resetPasswordTokenExpiration,
      }
    );
    return success(
      res,
      httpsStatusCodes.SUCCESS,
      serverResponseMessage.RESET_PASSWORD_LINK_SENT,
      token
    );
  } catch (error) {
    return failure(
      res,
      httpsStatusCodes.INTERNAL_SERVER_ERROR,
      serverResponseMessage.INTERNAL_SERVER_ERROR
    );
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { user } = req;
    const { userDetails } = user;
    const { secretCode, password, confirmPassword } = req.body;
    if (!secretCode || secretCode !== user.secretCode) {
      return failure(
        res,
        httpsStatusCodes.BAD_REQUEST,
        serverResponseMessage.INVALID_SECRET_CODE
      );
    }
    if (password !== confirmPassword) {
      return failure(
        res,
        httpsStatusCodes.BAD_REQUEST,
        serverResponseMessage.PASSWORD_NOT_MATCHED
      );
    }
    const encryptPassword = await bcrypt.hash(password, 10);
    const data = { password: encryptPassword };
    const updatedUser = await User.findOneAndUpdate(
      { _id: userDetails._id },
      { $set: data },
      { new: true }
    );

    return success(
      res,
      httpsStatusCodes.SUCCESS,
      serverResponseMessage.PASSWORD_UPDATED_SUCCESSFULLY,
      updatedUser
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

exports.changePassword = async (req, res) => {
  try {
    const { user } = req;
    console.log(user);
    const { oldPassword, password, confirmPassword } = req.body;
    const comparePassword = await bcrypt.compare(oldPassword, user.password);
    if (!comparePassword) {
      return failure(
        res,
        httpsStatusCodes.BAD_REQUEST,
        serverResponseMessage.INVALID_OLD_PASSWORD
      );
    }
    if (password !== confirmPassword) {
      return failure(
        res,
        httpsStatusCodes.BAD_REQUEST,
        serverResponseMessage.PASSWORD_NOT_MATCHED
      );
    }
    const encryptPassword = await bcrypt.hash(password, 10);
    const data = { password: encryptPassword };
    const updatedUser = await User.findOneAndUpdate(
      { _id: user.id },
      { $set: data },
      { new: true }
    );

    return success(
      res,
      httpsStatusCodes.SUCCESS,
      serverResponseMessage.PASSWORD_CHANGED_SUCCESSFULLY,
      updatedUser
    );
  } catch (error) {
    return failure(
      res,
      httpsStatusCodes.INTERNAL_SERVER_ERROR,
      serverResponseMessage.INTERNAL_SERVER_ERROR
    );
  }
};
