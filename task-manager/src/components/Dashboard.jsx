import { useState, useMemo } from 'react'
import SearchFilterBar from './SearchFilterBar.jsx'
import TaskList from './TaskList.jsx'
import TaskForm from './TaskForm.jsx'

const PRIORITY_WEIGHT = { High: 3, Medium: 2, Low: 1 }

function Dashboard({ tasks, setTasks, onLogout }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [sortBy, setSortBy] = useState('dueDate')

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  // --- Derived summary counts (recomputed only when tasks change) ---
  const stats = useMemo(() => {
    return {
      total: tasks.length,
      completed: tasks.filter((t) => t.status === 'Completed').length,
      pending: tasks.filter((t) => t.status === 'Pending').length,
      highPriority: tasks.filter((t) => t.priority === 'High').length,
    }
  }, [tasks])

  // --- Search + filter + sort pipeline ---
  const visibleTasks = useMemo(() => {
    let result = tasks

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase()
      result = result.filter((t) => t.title.toLowerCase().includes(term))
    }

    if (statusFilter !== 'All') {
      result = result.filter((t) => t.status === statusFilter)
    }

    if (priorityFilter !== 'All') {
      result = result.filter((t) => t.priority === priorityFilter)
    }

    // .slice() copies the array first so .sort() never mutates
    // the original `tasks` state directly.
    result = result.slice().sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate) - new Date(b.dueDate)
      }
      if (sortBy === 'priority') {
        return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority]
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title)
      }
      return 0
    })

    return result
  }, [tasks, searchTerm, statusFilter, priorityFilter, sortBy])

  // --- Task CRUD handlers ---
  const openAddForm = () => {
    setEditingTask(null)
    setIsFormOpen(true)
  }

  const openEditForm = (task) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingTask(null)
  }

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      // Edit: replace the matching task, leave everything else untouched.
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? { ...t, ...taskData } : t))
      )
    } else {
      // Create: append a new task with a fresh id and default status.
      const newTask = {
        id: crypto.randomUUID(),
        status: 'Pending',
        ...taskData,
      }
      setTasks((prev) => [newTask, ...prev])
    }
    closeForm()
  }

  const handleDeleteTask = (id) => {
    if (window.confirm('Delete this task? This cannot be undone.')) {
      setTasks((prev) => prev.filter((t) => t.id !== id))
    }
  }

  const handleToggleStatus = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' }
          : t
      )
    )
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="auth-brand">
          <span className="auth-brand-mark">TF</span>
          <span className="auth-brand-name">TaskFlow</span>
        </div>
        <button className="btn btn-ghost" onClick={onLogout}>
          Log out
        </button>
      </header>

      <main className="dashboard-body">
        <section className="stats-grid">
          <StatCard label="Total tasks" value={stats.total} accent="neutral" />
          <StatCard label="Completed" value={stats.completed} accent="completed" />
          <StatCard label="Pending" value={stats.pending} accent="pending" />
          <StatCard
            label="High priority"
            value={stats.highPriority}
            accent="high"
          />
        </section>

        <section className="toolbar">
          <SearchFilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            priorityFilter={priorityFilter}
            onPriorityChange={setPriorityFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
          <button className="btn btn-primary" onClick={openAddForm}>
            + New task
          </button>
        </section>

        <TaskList
          tasks={visibleTasks}
          onEdit={openEditForm}
          onDelete={handleDeleteTask}
          onToggleStatus={handleToggleStatus}
        />
      </main>

      {isFormOpen && (
        <TaskForm
          initialTask={editingTask}
          onSave={handleSaveTask}
          onCancel={closeForm}
        />
      )}
    </div>
  )
}

function StatCard({ label, value, accent }) {
  return (
    <div className={`stat-card stat-card--${accent}`}>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

export default Dashboard
