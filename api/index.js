// api/index.js
const express = require('express');
const cors = require('cors');

// Import routes
const studentRoutes = require('../src/routes/studentRoutes');
const teacherRoutes = require('../src/routes/teacherRoutes'); 
const authRoutes = require('../src/routes/authRoutes');

// const teacherRoutes = require('../src/routes/teacherRoutes');

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
console.log('🧩 Routes imported:', { studentRoutes, teacherRoutes, authRoutes });



// console.log('✅ Serverless app initialized successfully');

module.exports = app;
