require("express-async-errors");
const pino = require("pino");

const fileTransport = pino.transport({
  targets: [
    {
      target: "pino/file",
      options: { destination: `${__dirname}/../logs/app.log` },
    },
    { target: "pino-pretty" },
  ],
});

const logger = pino(
  {
    level: process.env.PINO_LOG_LEVEL || "info",
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  fileTransport,
);

module.exports = function () {
  process.on("uncaughtException", (ex) => {
    logger.error(ex);
    process.exit(1);
  });

  process.on("unhandledRejection", (ex) => {
    // logger.error(ex.message, ex);
    // process.exit(1);
    throw ex; // passing it to uncaugthException handler
  });

  // const p = Promise.reject(new Error("something failed miserably"));
  // p.then(() => console.log("done"));
};
