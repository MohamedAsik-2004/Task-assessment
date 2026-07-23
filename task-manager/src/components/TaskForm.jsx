import { useState } from 'react'

const emptyTask = {
  title: '',
  description: '',
  dueDate: '',
  priority: 'Medium',
}

function TaskForm({ initialTask, onSave, onCancel }) {
  // If we were given a task to edit, pre-fill the form with its values.
  const [formData, setFormData] = useState(() =>
    initialTask
      ? {
          title: initialTask.title,
          description: initialTask.description || '',
          dueDate: initialTask.dueDate || '',
          priority: initialTask.priority,
        }
      : emptyTask
  )
  const [errors, setErrors] = useState({})

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required.'
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required.'
    if (!formData.priority) newErrors.priority = 'Priority is required.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (validate()) {
      onSave({ ...formData, title: formData.title.trim() })
    }
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
      >
        <h2 id="task-form-title">{initialTask ? 'Edit task' : 'New task'}</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={handleChange('title')}
              className={errors.title ? 'input-error' : ''}
              placeholder="e.g. Finish quarterly report"
            />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={handleChange('description')}
              placeholder="Optional details about this task"
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="dueDate">Due date *</label>
              <input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange('dueDate')}
                className={errors.dueDate ? 'input-error' : ''}
              />
              {errors.dueDate && (
                <span className="field-error">{errors.dueDate}</span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="priority">Priority *</label>
              <select
                id="priority"
                value={formData.priority}
                onChange={handleChange('priority')}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {initialTask ? 'Save changes' : 'Add task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskForm
