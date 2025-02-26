const express = require("express");
require("dotenv").config();

const app = express();

require("./startup/errorHandler")();
require("./startup/routes")(app);
require("./startup/db")();

app.listen(3000, () => console.log("Listening on port 3000"));
