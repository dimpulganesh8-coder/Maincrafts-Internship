function TaskStats({ total, active, completed }) {
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <aside className="stats-panel" aria-label="Productivity Overview">
      <div className="progress-card">
        <div className="progress-header">
          <div>
            <span className="section-eyebrow">Daily Momentum</span>
            <h3 className="progress-title">Task Completion</h3>
          </div>
          <div className="percentage-badge">{completionRate}%</div>
        </div>

        <div
          className="progress-track"
          role="progressbar"
          aria-valuenow={completionRate}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div
            className="progress-fill"
            style={{ width: `${completionRate}%` }}
          />
        </div>

        <p className="progress-caption">
          {total === 0
            ? 'Add your first task to start tracking your daily workflow.'
            : completed === total
            ? 'All tasks completed! Great work staying on top of your goals.'
            : `${completed} of ${total} tasks completed — ${active} remaining.`}
        </p>
      </div>

      <div className="metrics-grid">
        <div className="metric-box">
          <span className="metric-label">Total Saved</span>
          <strong className="metric-value">{total}</strong>
          <span className="metric-sub">MongoDB Documents</span>
        </div>

        <div className="metric-box metric-active">
          <span className="metric-label">In Progress</span>
          <strong className="metric-value">{active}</strong>
          <span className="metric-sub">Pending Action</span>
        </div>

        <div className="metric-box metric-done">
          <span className="metric-label">Completed</span>
          <strong className="metric-value">{completed}</strong>
          <span className="metric-sub">Finished Tasks</span>
        </div>
      </div>

      <div className="api-info-card">
        <h4 className="api-info-title">MERN Architecture Status</h4>
        <ul className="api-endpoints-list">
          <li>
            <code className="method-badge post">POST</code>
            <span>/add</span>
            <span className="endpoint-desc">Save task to MongoDB</span>
          </li>
          <li>
            <code className="method-badge get">GET</code>
            <span>/tasks</span>
            <span className="endpoint-desc">Fetch all tasks</span>
          </li>
          <li>
            <code className="method-badge patch">PATCH</code>
            <span>/tasks/:id/toggle</span>
            <span className="endpoint-desc">Complete task</span>
          </li>
          <li>
            <code className="method-badge delete">DELETE</code>
            <span>/tasks/:id</span>
            <span className="endpoint-desc">Remove task</span>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default TaskStats;

