require("express-async-errors");
const pino = require("pino");

module.exports = function () {
  process.on("uncaughtException", (ex) => {
    pino.error(ex);
    process.exit(1);
  });

  process.on("unhandledRejection", (ex) => {
    // pino.error(ex.message, ex);
    // process.exit(1);
    throw ex; // passing it to uncaugthException handler
  });

  // const p = Promise.reject(new Error("something failed miserably"));
  // p.then(() => console.log("done"));
};
