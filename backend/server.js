// Entry point of the backend: sets up Express and starts the server.
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors()); // allow the mobile app to call this API
app.use(express.json()); // read JSON request bodies

app.get('/', (req, res) => res.json({ message: 'To-Do List API is running' }));
app.use('/api/tasks', taskRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  // '0.0.0.0' lets phones on the same Wi-Fi reach the server.
  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
});
