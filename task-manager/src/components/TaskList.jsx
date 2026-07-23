import TaskItem from './TaskItem.jsx'

function TaskList({ tasks, onEdit, onDelete, onToggleStatus }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks match your current search and filters.</p>
        <p className="empty-state-hint">
          Try clearing the search box or filters, or add a new task.
        </p>
      </div>
    )
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </ul>
  )
}

export default TaskList
