// api/index.js
const express = require('express');
const cors = require('cors');

// Import routes
const studentRoutes = require('../src/routes/studentRoutes');
// const teacherRoutes = require('../src/routes/teacherRoutes');

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/students', studentRoutes);
// app.use('/api/teachers', teacherRoutes);

// ✅ مهم جدًا: لا تكتب app.listen()
// لأن Vercel بيعمل listen بنفسه
module.exports = app;
