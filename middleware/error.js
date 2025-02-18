// err middleware. a special kind of mdw, should be called after every middleware
module.exports = (err, req, res, next) => {
  res.status(500).send("Something failed."); // log ex too
};
