// api/index.js
const express = require('express');
const cors = require('cors');

// Import routes
const studentRoutes = require('../src/routes/studentRoutes');
const teacherRoutes = require('../src/routes/teatcherRoutes'); 

// const teacherRoutes = require('../src/routes/teacherRoutes');

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.get('/', (req, res) => {
  res.send('🚀 QuranCenter API is live and healthy!');
});


// console.log('✅ Serverless app initialized successfully');

module.exports = app;
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`🚀 Local server running on port ${PORT}`));
}
