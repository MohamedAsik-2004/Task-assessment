const PRIORITY_CLASS = {
  High: 'priority-high',
  Medium: 'priority-medium',
  Low: 'priority-low',
}

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function TaskItem({ task, onEdit, onDelete, onToggleStatus }) {
  const isCompleted = task.status === 'Completed'

  return (
    <li className={`task-card ${PRIORITY_CLASS[task.priority]}`}>
      <div className="task-card-main">
        <label className="task-checkbox">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={() => onToggleStatus(task.id)}
            aria-label={
              isCompleted ? 'Mark task as pending' : 'Mark task as completed'
            }
          />
        </label>

        <div className="task-info">
          <h3 className={isCompleted ? 'task-title task-title--done' : 'task-title'}>
            {task.title}
          </h3>
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
          <div className="task-meta">
            <span className={`badge ${PRIORITY_CLASS[task.priority]}`}>
              {task.priority}
            </span>
            <span className={`badge status-${task.status.toLowerCase()}`}>
              {task.status}
            </span>
            {task.dueDate && (
              <span className="task-due-date">Due {formatDate(task.dueDate)}</span>
            )}
          </div>
        </div>
      </div>

      <div className="task-actions">
        <button className="btn btn-small btn-ghost" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button
          className="btn btn-small btn-danger-ghost"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </div>
    </li>
  )
}

export default TaskItem
