const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const demoUsers = require("../config/demoUsers");

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

function createUserPayload(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
}

async function login(req, res) {
  const { email, password } = req.body;

  const user = demoUsers.find((item) => item.email === email);

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password."
    });
  }

  const isMatch = bcrypt.compareSync(password, user.passwordHash);

  if (!isMatch) {
    return res.status(401).json({
      message: "Invalid email or password."
    });
  }

  const payload = createUserPayload(user);
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "8h"
  });

  res.json({
    message: "Login successful",
    token,
    user: payload
  });
}

module.exports = {
  login
};
