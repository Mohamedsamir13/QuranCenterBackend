const express = require('express');
const cors = require('cors');
const studentRoutes = require('./src/routes/studentRoutes');

const app = express();
app.use(express.json());
app.use(cors());

console.log('studentRoutes:', studentRoutes); // debug

app.use('/api/students', studentRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
