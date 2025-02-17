module.exports = function(req, res, next) {
  // auth middleware shoud be called before this
  if (!req.user.isAdmin) return res.status(403).send("Unathorized.");
  next();
};
