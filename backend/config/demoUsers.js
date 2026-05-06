const bcrypt = require("bcryptjs");

const demoUsers = [
  {
    id: "u1",
    name: "RPA Editor",
    email: "editor@dhl.local",
    role: "Editor",
    passwordHash: bcrypt.hashSync("Editor12345", 10)
  },
  {
    id: "u2",
    name: "KB Reviewer",
    email: "reviewer@dhl.local",
    role: "Reviewer",
    passwordHash: bcrypt.hashSync("Reviewer12345", 10)
  },
  {
    id: "u3",
    name: "KB Viewer",
    email: "viewer@dhl.local",
    role: "Viewer",
    passwordHash: bcrypt.hashSync("Viewer12345", 10)
  }
];

module.exports = demoUsers;
