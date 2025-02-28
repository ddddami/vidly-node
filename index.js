const express = require("express");
require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

const app = express();

require("./startup/errorHandler")();
require("./startup/routes")(app);
require("./startup/db")();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log("Listening on port ", port));

module.exports = server;
