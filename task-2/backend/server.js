require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/maincrafts_todo';

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully (Maincrafts Task 2 - To-Do List).');
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log(
      '💡 Tip: Make sure MONGO_URI is set in task-2/backend/.env with valid MongoDB Atlas credentials and IP whitelist.'
    );
  });

// Mount Task Routes at root ('/add', '/tasks') and '/api' ('/api/add', '/api/tasks')
app.use('/', taskRoutes);
app.use('/api', taskRoutes);

// Health Check & API Info Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'Maincrafts Technology - Task 2 To-Do List API is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    endpoints: {
      addTask: 'POST /add',
      getTasks: 'GET /tasks',
      toggleTask: 'PATCH /tasks/:id/toggle',
      updateTask: 'PUT /tasks/:id',
      deleteTask: 'DELETE /tasks/:id',
      clearCompleted: 'DELETE /tasks/completed',
    },
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'Maincrafts Technology - Task 2 To-Do List API is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    endpoints: {
      addTask: 'POST /add',
      getTasks: 'GET /tasks',
      toggleTask: 'PATCH /tasks/:id/toggle',
      updateTask: 'PUT /tasks/:id',
      deleteTask: 'DELETE /tasks/:id',
      clearCompleted: 'DELETE /tasks/completed',
    },
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Task 2 Express server running on http://localhost:${PORT}`);
});

