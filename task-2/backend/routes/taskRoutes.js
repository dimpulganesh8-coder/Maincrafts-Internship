const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/Task');

const router = express.Router();

// Middleware to verify MongoDB connection
const ensureDbConnected = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database is not connected. Please check your MONGO_URI in backend/.env and ensure MongoDB Atlas or local MongoDB is accessible.',
    });
  }
  next();
};

/**
 * @route   GET /tasks
 * @desc    Retrieve all tasks from MongoDB sorted by newest first
 */
router.get('/tasks', ensureDbConnected, async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    return res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve tasks from the database.',
      error: error.message,
    });
  }
});

/**
 * @route   POST /add
 * @desc    Add a new task to MongoDB
 */
router.post('/add', ensureDbConnected, async (req, res) => {
  try {
    const { text, priority, category } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid task description.',
      });
    }

    if (text.trim().length > 300) {
      return res.status(400).json({
        success: false,
        message: 'Task text cannot exceed 300 characters.',
      });
    }

    const newTask = await Task.create({
      text: text.trim(),
      priority: ['low', 'medium', 'high'].includes(priority) ? priority : 'medium',
      category: ['Personal', 'Work', 'Study', 'Urgent'].includes(category) ? category : 'Personal',
    });

    return res.status(201).json(newTask);
  } catch (error) {
    console.error('Error adding task:', error.message);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to save the task to the database.',
      error: error.message,
    });
  }
});

/**
 * @route   PATCH /tasks/:id/toggle
 * @desc    Toggle completion status of a task
 */
router.patch('/tasks/:id/toggle', ensureDbConnected, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format.',
      });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    task.completed = !task.completed;
    await task.save();

    return res.status(200).json(task);
  } catch (error) {
    console.error('Error toggling task:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to update task status.',
      error: error.message,
    });
  }
});

/**
 * @route   PUT /tasks/:id
 * @desc    Update task fields (text, completed, priority, category)
 */
router.put('/tasks/:id', ensureDbConnected, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format.',
      });
    }

    const updates = {};
    if (typeof req.body.text === 'string') {
      if (!req.body.text.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Task text cannot be empty.',
        });
      }
      updates.text = req.body.text.trim();
    }
    if (typeof req.body.completed === 'boolean') {
      updates.completed = req.body.completed;
    }
    if (['low', 'medium', 'high'].includes(req.body.priority)) {
      updates.priority = req.body.priority;
    }
    if (['Personal', 'Work', 'Study', 'Urgent'].includes(req.body.category)) {
      updates.category = req.body.category;
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to update task.',
      error: error.message,
    });
  }
});

/**
 * @route   DELETE /tasks/completed
 * @desc    Delete all completed tasks from MongoDB
 */
router.delete('/tasks/completed', ensureDbConnected, async (req, res) => {
  try {
    const result = await Task.deleteMany({ completed: true });
    return res.status(200).json({
      success: true,
      deletedCount: result.deletedCount,
      message: `Cleared ${result.deletedCount} completed task(s).`,
    });
  } catch (error) {
    console.error('Error clearing completed tasks:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to clear completed tasks.',
      error: error.message,
    });
  }
});

/**
 * @route   DELETE /tasks/:id
 * @desc    Delete a single task by ID
 */
router.delete('/tasks/:id', ensureDbConnected, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format.',
      });
    }

    const deletedTask = await Task.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully.',
      task: deletedTask,
    });
  } catch (error) {
    console.error('Error deleting task:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete task.',
      error: error.message,
    });
  }
});

module.exports = router;

