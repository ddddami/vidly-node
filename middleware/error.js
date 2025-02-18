const pino = require("pino");

// err middleware. a special kind of mdw, should be called after every middleware
module.exports = (err, req, res, next) => {
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
    pino.destination(`${__dirname}/logs/app.log`),
  );

  logger.error(err.message, err);
  res.status(500).send("Something failed.");
};
