import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login.jsx'
import Dashboard from './components/Dashboard.jsx'

const TASKS_STORAGE_KEY = 'taskflow_tasks'
const AUTH_STORAGE_KEY = 'taskflow_auth'

function App() {
  // isLoggedIn is initialised from localStorage so a page refresh
  // does not kick a logged-in user back to the login screen.
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
  )

  // tasks is the single source of truth for all task data in the app.
  // It is initialised lazily from localStorage (the function form of
  // useState only runs once, on the first render).
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(TASKS_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error('Failed to parse saved tasks:', error)
      return []
    }
  })

  // Whenever tasks change, persist them to localStorage.
  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const handleLogin = () => {
    localStorage.setItem(AUTH_STORAGE_KEY, 'true')
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setIsLoggedIn(false)
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          isLoggedIn ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login onLogin={handleLogin} />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          isLoggedIn ? (
            <Dashboard tasks={tasks} setTasks={setTasks} onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
