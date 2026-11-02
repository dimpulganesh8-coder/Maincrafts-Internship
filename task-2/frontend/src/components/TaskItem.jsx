import { useState } from 'react';

function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [isBusy, setIsBusy] = useState(false);

  const formattedDate = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Just now';

  const handleToggle = async () => {
    if (isBusy) return;
    setIsBusy(true);
    await onToggle(task._id);
    setIsBusy(false);
  };

  const handleDelete = async () => {
    if (isBusy) return;
    setIsBusy(true);
    await onDelete(task._id);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const trimmed = editText.trim();
    if (!trimmed || trimmed === task.text) {
      setEditText(task.text);
      setIsEditing(false);
      return;
    }
    setIsBusy(true);
    const ok = await onEdit(task._id, { text: trimmed });
    setIsBusy(false);
    if (ok) {
      setIsEditing(false);
    }
  };

  const priorityClass = `priority-badge-${task.priority || 'medium'}`;
  const categoryClass = `category-badge-${(task.category || 'Personal').toLowerCase()}`;

  return (
    <article
      className={`task-card ${task.completed ? 'task-completed' : ''} ${
        isBusy ? 'task-busy' : ''
      }`}
    >
      <div className="task-card-left">
        <button
          type="button"
          className={`check-button ${task.completed ? 'checked' : ''}`}
          onClick={handleToggle}
          disabled={isBusy}
          aria-label={
            task.completed ? 'Mark task as active' : 'Mark task as completed'
          }
          title={
            task.completed ? 'Mark as incomplete' : 'Mark as completed'
          }
        >
          {task.completed && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>

        <div className="task-body">
          {isEditing ? (
            <form onSubmit={handleSaveEdit} className="inline-edit-form">
              <input
                type="text"
                className="inline-edit-input"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                autoFocus
                maxLength={300}
              />
              <div className="inline-edit-actions">
                <button type="submit" className="inline-save-btn" disabled={isBusy}>
                  Save
                </button>
                <button
                  type="button"
                  className="inline-cancel-btn"
                  onClick={() => {
                    setEditText(task.text);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <p className="task-text">{task.text}</p>
              <div className="task-meta">
                <span className={`meta-badge ${categoryClass}`}>
                  {task.category || 'Personal'}
                </span>
                <span className={`meta-badge ${priorityClass}`}>
                  <span className={`priority-dot priority-${task.priority || 'medium'}`} />
                  {(task.priority || 'medium').toUpperCase()}
                </span>
                <span className="task-timestamp" title="Saved in MongoDB">
                  {formattedDate}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {!isEditing && (
        <div className="task-actions">
          <button
            type="button"
            className="action-icon-btn edit-btn"
            onClick={() => setIsEditing(true)}
            disabled={isBusy}
            title="Edit task text"
            aria-label="Edit task"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
              />
            </svg>
          </button>

          <button
            type="button"
            className="action-icon-btn delete-btn"
            onClick={handleDelete}
            disabled={isBusy}
            title="Delete task"
            aria-label="Delete task"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      )}
    </article>
  );
}

export default TaskItem;

