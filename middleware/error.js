const pino = require("pino");
const path = require("path");

// err middleware. a special kind of mdw, should be called after every middleware
module.exports = (err, req, res, next) => {
  const transport = pino.transport({
    targets: [
      {
        target: "pino/file",
        options: { destination: path.join(__dirname, "..", "logs", "app.log") },
      },
      {
        target: "pino-mongodb",
        options: {
          uri: process.env.MONGO_DB_URI,
          database: process.env.MONGO_DB,
          collection: "log",
          // mongoOptions: {
          //   auth: {
          //     username: process.env.MONGO_USER,
          //     password: process.env.MONGO_PASSWORD,
          //   }
          // }
        },
      },
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
    pino.destination(`${__dirname}/../logs/app.log`)
  );

  logger.error(err.message, err);
  res.status(500).send("Something failed.");
};
