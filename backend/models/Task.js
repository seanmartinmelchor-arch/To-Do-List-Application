// Mongoose schema = the "shape" of every document in the tasks collection.
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be longer than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Description cannot be longer than 500 characters'],
    },
    status: {
      type: String,
      enum: { values: ['Pending', 'Completed'], message: 'Status must be Pending or Completed' },
      default: 'Pending',
    },
  },
  {
    // Mongoose automatically adds and maintains createdAt and updatedAt.
    timestamps: true,
    collection: 'tasks',
  }
);

module.exports = mongoose.model('Task', taskSchema);
