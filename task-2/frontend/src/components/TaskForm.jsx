import { useState } from 'react';

const PRIORITIES = [
  { value: 'low', label: 'Low Priority', dotClass: 'priority-low' },
  { value: 'medium', label: 'Medium Priority', dotClass: 'priority-medium' },
  { value: 'high', label: 'High Priority', dotClass: 'priority-high' },
];

const CATEGORIES = ['Personal', 'Work', 'Study', 'Urgent'];

function TaskForm({ onAddTask, isSubmitting }) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('Personal');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();

    if (!trimmed) {
      setValidationError('Please enter a task description before adding.');
      return;
    }

    if (trimmed.length > 300) {
      setValidationError('Task description cannot exceed 300 characters.');
      return;
    }

    setValidationError('');
    const success = await onAddTask({
      text: trimmed,
      priority,
      category,
    });

    if (success) {
      setText('');
    }
  };

  return (
    <section className="composer-card" aria-label="Add a new task">
      <div className="composer-header">
        <div>
          <span className="section-eyebrow">Quick Capture</span>
          <h2 className="composer-title">What needs to get done today?</h2>
        </div>
        <span className="char-counter">{text.length}/300</span>
      </div>

      <form onSubmit={handleSubmit} className="composer-form" noValidate>
        <div className="input-row">
          <div className="input-wrapper">
            <svg
              className="input-lead-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <input
              type="text"
              className={`task-input ${validationError ? 'input-error' : ''}`}
              placeholder="Enter a new task (e.g., Complete MongoDB Atlas integration for Task 2)..."
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (validationError) setValidationError('');
              }}
              disabled={isSubmitting}
              aria-label="New task description"
            />
            {text && (
              <button
                type="button"
                className="clear-input-btn"
                onClick={() => setText('')}
                title="Clear input"
                aria-label="Clear input"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="submit"
            className="add-task-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="btn-spinner" />
                <span>Adding...</span>
              </>
            ) : (
              <>
                <span>Add Task</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12h14M12 5l7 7-7 7"
                  />
                </svg>
              </>
            )}
          </button>
        </div>

        {validationError && (
          <p className="field-error" role="alert">
            {validationError}
          </p>
        )}

        <div className="composer-options">
          <div className="option-group">
            <span className="option-label">Category:</span>
            <div className="pill-selector" role="group" aria-label="Task category">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`selector-pill ${category === cat ? 'active' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="option-group">
            <span className="option-label">Priority:</span>
            <div className="pill-selector" role="group" aria-label="Task priority">
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  className={`selector-pill priority-pill ${
                    priority === p.value ? `active ${p.dotClass}` : ''
                  }`}
                  onClick={() => setPriority(p.value)}
                >
                  <span className={`priority-dot ${p.dotClass}`} />
                  {p.value.charAt(0).toUpperCase() + p.value.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

export default TaskForm;

