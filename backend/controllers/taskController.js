// Controllers hold the logic for each API endpoint.
const mongoose = require('mongoose');
const Task = require('../models/Task');

// Helper: create an error with an HTTP status code.
const httpError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

// Helper: make sure the :id in the URL is a valid MongoDB ObjectId.
const checkId = (id) => {
  if (!mongoose.isValidObjectId(id)) throw httpError(400, 'Invalid task ID');
};

// GET /api/tasks  -> all tasks (newest first)
exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

// GET /api/tasks/:id  -> one task
exports.getTaskById = async (req, res, next) => {
  try {
    checkId(req.params.id);
    const task = await Task.findById(req.params.id);
    if (!task) throw httpError(404, 'Task not found');
    res.json(task);
  } catch (err) {
    next(err);
  }
};

// POST /api/tasks  -> create a task
exports.createTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const task = await Task.create({ title, description });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

// PUT /api/tasks/:id  -> update title, description and/or status
exports.updateTask = async (req, res, next) => {
  try {
    checkId(req.params.id);
    const { title, description, status } = req.body;
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;

    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true, // return the updated document
      runValidators: true, // apply schema rules to the update
    });
    if (!task) throw httpError(404, 'Task not found');
    res.json(task);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/tasks/:id/complete  -> mark as Completed
exports.completeTask = async (req, res, next) => {
  try {
    checkId(req.params.id);
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: 'Completed' },
      { new: true }
    );
    if (!task) throw httpError(404, 'Task not found');
    res.json(task);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/tasks/:id  -> delete a task
exports.deleteTask = async (req, res, next) => {
  try {
    checkId(req.params.id);
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) throw httpError(404, 'Task not found');
    res.json({ message: 'Task deleted successfully', id: req.params.id });
  } catch (err) {
    next(err);
  }
};
