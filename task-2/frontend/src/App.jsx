import { useState, useEffect, useCallback } from 'react';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import TaskStats from './components/TaskStats';
import {
  fetchTasks,
  addTask,
  toggleTaskStatus,
  updateTask,
  deleteTask,
  clearCompletedTasks,
} from './services/taskService';
import './App.css';

const STATUS_TABS = [
  { id: 'all', label: 'All Tasks' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
];

const CATEGORY_TABS = ['All', 'Personal', 'Work', 'Study', 'Urgent'];

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [toast, setToast] = useState(null);

  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, 3200);
  };

  // Load all tasks from GET /tasks via Axios
  const loadTasks = useCallback(async (showSpinner = true) => {
    try {
      if (showSpinner) setLoading(true);
      setErrorMessage('');
      const data = await fetchTasks();
      setTasks(Array.isArray(data) ? data : []);
      setBackendConnected(true);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Unable to connect to Express API at http://localhost:5001';
      setErrorMessage(msg);
      setBackendConnected(false);
    } finally {
      if (showSpinner) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks(true);
  }, [loadTasks]);

  // Add a new task via POST /add and immediately update state
  const handleAddTask = async (taskPayload) => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      const createdTask = await addTask(taskPayload);
      setTasks((prev) => [createdTask, ...prev]);
      setBackendConnected(true);
      showToast('Task saved to MongoDB!', 'success');
      return true;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to add task. Please check backend connection.';
      setErrorMessage(msg);
      showToast(msg, 'error');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle task completion status via PATCH /tasks/:id/toggle
  const handleToggleTask = async (taskId) => {
    try {
      const updated = await toggleTaskStatus(taskId);
      setTasks((prev) =>
        prev.map((item) => (item._id === taskId ? updated : item))
      );
      showToast(
        updated.completed ? 'Task marked as completed!' : 'Task reopened!',
        'success'
      );
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Failed to update task status.';
      showToast(msg, 'error');
    }
  };

  // Edit task text via PUT /tasks/:id
  const handleEditTask = async (taskId, updates) => {
    try {
      const updated = await updateTask(taskId, updates);
      setTasks((prev) =>
        prev.map((item) => (item._id === taskId ? updated : item))
      );
      showToast('Task updated successfully!', 'success');
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update task.';
      showToast(msg, 'error');
      return false;
    }
  };

  // Delete single task via DELETE /tasks/:id
  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((item) => item._id !== taskId));
      showToast('Task removed from MongoDB.', 'info');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete task.';
      showToast(msg, 'error');
    }
  };

  // Clear all completed tasks via DELETE /tasks/completed
  const handleClearCompleted = async () => {
    try {
      const res = await clearCompletedTasks();
      setTasks((prev) => prev.filter((item) => !item.completed));
      showToast(res.message || 'Completed tasks cleared.', 'info');
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Failed to clear completed tasks.';
      showToast(msg, 'error');
    }
  };

  // Derived statistics
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const activeCount = totalCount - completedCount;

  // Filtered task list
  const filteredTasks = tasks.filter((task) => {
    if (statusFilter === 'active' && task.completed) return false;
    if (statusFilter === 'completed' && !task.completed) return false;
    if (
      categoryFilter !== 'All' &&
      (task.category || 'Personal') !== categoryFilter
    ) {
      return false;
    }
    if (
      searchQuery.trim() &&
      !task.text.toLowerCase().includes(searchQuery.trim().toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="studio-shell">
      {/* Top Header Bar */}
      <header className="studio-header">
        <div className="header-inner">
          <div className="brand-identity">
            <div className="brand-mark" aria-hidden="true">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <div className="brand-row">
                <h1 className="brand-name">TaskFlow Studio</h1>
                <span className="task-badge">Internship Task 2</span>
              </div>
              <p className="brand-tagline">
                Maincrafts Technology · MERN Stack To-Do Workspace
              </p>
            </div>
          </div>

          <div className="header-meta">
            <span className="date-pill">{todayFormatted}</span>
            <div
              className={`db-status-badge ${
                backendConnected ? 'status-online' : 'status-offline'
              }`}
            >
              <span className="status-indicator" />
              <span>
                {backendConnected ? 'MongoDB Connected' : 'API Offline'}
              </span>
            </div>
            <button
              type="button"
              className="sync-button"
              onClick={() => loadTasks(true)}
              title="Refresh tasks from MongoDB"
            >
              ↻ Sync
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {toast && (
        <div className={`toast-banner toast-${toast.type}`} role="status">
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Split Workspace */}
      <main className="studio-workspace">
        {/* Left Column: Productivity & API Overview */}
        <TaskStats
          total={totalCount}
          active={activeCount}
          completed={completedCount}
        />

        {/* Right Column: Task Composer & Interactive Task Board */}
        <div className="board-column">
          {errorMessage && (
            <div className="connection-alert" role="alert">
              <div className="alert-content">
                <strong>Connection Notice:</strong>
                <p>{errorMessage}</p>
              </div>
              <button
                type="button"
                className="alert-retry-btn"
                onClick={() => loadTasks(true)}
              >
                Retry
              </button>
            </div>
          )}

          {/* Add Task Input & Button */}
          <TaskForm onAddTask={handleAddTask} isSubmitting={isSubmitting} />

          {/* Filter & Search Toolbar */}
          <section className="board-toolbar" aria-label="Filter tasks">
            <div className="toolbar-top">
              <div className="status-tabs" role="tablist">
                {STATUS_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={statusFilter === tab.id}
                    className={`status-tab ${
                      statusFilter === tab.id ? 'active' : ''
                    }`}
                    onClick={() => setStatusFilter(tab.id)}
                  >
                    <span>{tab.label}</span>
                    <span className="tab-count">
                      {tab.id === 'all'
                        ? totalCount
                        : tab.id === 'active'
                        ? activeCount
                        : completedCount}
                    </span>
                  </button>
                ))}
              </div>

              <div className="search-box">
                <svg
                  className="search-box-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="search"
                  className="search-box-input"
                  placeholder="Filter tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Filter tasks by keyword"
                />
              </div>
            </div>

            <div className="toolbar-bottom">
              <div className="category-strip">
                {CATEGORY_TABS.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`category-chip ${
                      categoryFilter === cat ? 'active' : ''
                    }`}
                    onClick={() => setCategoryFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {completedCount > 0 && (
                <button
                  type="button"
                  className="clear-completed-btn"
                  onClick={handleClearCompleted}
                >
                  Clear Completed ({completedCount})
                </button>
              )}
            </div>
          </section>

          {/* Tasks Feed */}
          <section className="tasks-feed" aria-live="polite">
            {loading ? (
              <div className="feed-state-card">
                <div className="loader-ring" />
                <h3>Loading your workspace...</h3>
                <p>Fetching saved tasks from Express & MongoDB (`GET /tasks`)</p>
              </div>
            ) : filteredTasks.length > 0 ? (
              <div className="task-list">
                {filteredTasks.map((task) => (
                  <TaskItem
                    key={task._id}
                    task={task}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                    onEdit={handleEditTask}
                  />
                ))}
              </div>
            ) : (
              <div className="feed-state-card empty-feed">
                <div className="empty-illustration" aria-hidden="true">
                  ✓
                </div>
                <h3>
                  {tasks.length === 0
                    ? 'Your task list is fresh and empty'
                    : 'No matching tasks found'}
                </h3>
                <p>
                  {tasks.length === 0
                    ? 'Type a task above and click "Add Task" to store your first item in MongoDB.'
                    : 'Try clearing your search or switching category/status tabs.'}
                </p>
                {tasks.length > 0 && (
                  <button
                    type="button"
                    className="reset-filters-btn"
                    onClick={() => {
                      setStatusFilter('all');
                      setCategoryFilter('All');
                      setSearchQuery('');
                    }}
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="studio-footer">
        <p>
          Maincrafts Technology MERN Stack Internship —{' '}
          <strong>Task 2: To-Do List Application</strong> (React · Axios ·
          Express · Mongoose · MongoDB Atlas)
        </p>
      </footer>
    </div>
  );
}

export default App;

