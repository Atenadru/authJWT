require("dotenv").config();
module.exports = {
  PORT: process.env.PORT,
  AUTH_PORT: process.env.AUTH_PORT,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_ACCESS: process.env.REFRESH_TOKEN_ACCESS,
};
