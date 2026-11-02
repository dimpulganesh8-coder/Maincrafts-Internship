const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Task text is required'],
      trim: true,
      minlength: [1, 'Task text cannot be empty'],
      maxlength: [300, 'Task text cannot exceed 300 characters'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    category: {
      type: String,
      enum: ['Personal', 'Work', 'Study', 'Urgent'],
      default: 'Personal',
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;

