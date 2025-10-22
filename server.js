const app = require("./api/index");


const studentRoutes = require('./src/routes/studentRoutes');
console.log('studentRoutes:', studentRoutes); // debug
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
