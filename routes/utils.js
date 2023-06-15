const jwt = require("jsonwebtoken");

exports.generateToken = (user) => {
  const payload = { sub: user.user_id, username: user.username };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24 * 30,
  }); // expires in 30 days
  return token;
};
