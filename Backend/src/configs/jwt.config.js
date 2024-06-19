"use strict";
require("dotenv").config();

const jwtConfig = {
  /*
  |--------------------------------------------------------------------------
  | JWT
  |--------------------------------------------------------------------------
  */
  jwtSecret: process.env.JWT_SECRET,
  tokenExpiration: process.env.TOKEN_EXPIRY,
  resetPasswordSecret: process.env.RESET_PASSWORD_SECRET,
  resetPasswordTokenExpiration: process.env.RESET_PASSWORD_TOKEN_EXPIRATION,
};
module.exports = jwtConfig;
