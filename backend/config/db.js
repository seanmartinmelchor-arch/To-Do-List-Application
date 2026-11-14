// Connects the app to MongoDB using Mongoose.
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // The database name (todo_list_db) is part of the MONGO_URI in .env.
    // MongoDB creates the database and the "tasks" collection automatically
    // the first time a task is saved.
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Stop the server if there is no database.
  }
};

module.exports = connectDB;
