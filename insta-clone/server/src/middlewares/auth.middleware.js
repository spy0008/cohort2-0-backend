const jwt = require("jsonwebtoken");

async function authCheckUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "UnAuthenticated user - token empty" });
  }

  let decoded = null;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      message: "UnAuthorized - Token not verifyed",
    });
  }
  req.user = decoded;

  next();
}

module.exports = authCheckUser;
