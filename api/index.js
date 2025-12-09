const express = require("express");
const cors = require("cors");
const path = require("path");

// Import routes
const studentRoutes = require("../src/routes/studentRoutes");
const teacherRoutes = require("../src/routes/teacherRoutes");
const authRoutes = require("../src/routes/authRoutes");
const groupRoutes = require("../src/routes/groupRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/groups", groupRoutes);

// 🧠 Honeypot trap content (funny fake secrets)
const funnyTrapText = `
🤫 Ohhh, so you found secrets.txt huh?

CONGRATS, Agent 404! 🎉
Your hacking skills have unlocked... absolutely nothing 😂

While you're here:
  - Maybe drink some water 💧
  - Touch some grass 🌱
  - Or, you know… stop poking random servers 😎

P.S. We just logged your IP → Have a nice day, Mr. Hacker 🕵️‍♂️
`;

// 🔹 Trap route for secrets.txt
app.get("/secrets.txt", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  console.log(
    `⚠️ Hacker alert! IP: ${ip} tried to access secrets.txt at ${new Date().toISOString()}`
  );
  res.type("text").status(403).send(funnyTrapText);
});

// 🔹 Trap route for passwords.txt
app.get("/passwords.txt", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  console.log(
    `⚠️ Hacker alert! IP: ${ip} tried to access passwords.txt at ${new Date().toISOString()}`
  );
  res.type("text").status(403).send(`
😈 Welcome to passwords.txt!

PASSWORD LIST:
1. admin: 123456
2. root: letmein
3. hacker: gotcha 😂

Oops... these were from 1998.  
Also — we logged your IP (${ip}).  
Expect a call from the Cyber Police 🚔
`);
});

console.log("🧩 Routes imported:", {
  studentRoutes,
  teacherRoutes,
  authRoutes,
});

module.exports = app;
