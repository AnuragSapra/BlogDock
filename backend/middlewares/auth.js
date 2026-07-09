const { validateToken } = require("../utils/auth");

exports.checkForToken = function (req, res, next) {
  const token = req.cookies["token"];
  if (!token) return next();
  try {
    const userPayload = validateToken(token);
    req.user = userPayload;
    next();
  } catch (error) {
    next();
  }
};

exports.onlyGrantAccessTo = function (role) {
  return function (req, res, next) {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    if (req.user.role !== role) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }
    next();
  };
};

exports.ensureAuthenticated = function (req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  return next();
};
