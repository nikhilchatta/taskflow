import { useState, useEffect, useCallback } from 'react'
import Sidebar from './components/Sidebar'
import Board from './components/Board'
import TaskModal from './components/TaskModal'
import ProjectModal from './components/ProjectModal'
import { api } from './api'

export default function App() {
  const [projects, setProjects]             = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [tasks, setTasks]                   = useState([])
  const [loading, setLoading]               = useState(false)
  const [taskModal, setTaskModal]           = useState({ open: false, task: null })
  const [projectModal, setProjectModal]     = useState({ open: false, project: null })
  const [error, setError]                   = useState(null)

  const loadProjects = useCallback(async () => {
    const data = await api.getProjects()
    setProjects(data)
    // auto-select first project only if none is selected yet
    setSelectedProject(prev => prev || data[0] || null)
  }, [])

  const loadTasks = useCallback(async (projectId) => {
    if (!projectId) return
    setLoading(true)
    const data = await api.getTasks(projectId)
    setTasks(data)
    setLoading(false)
  }, [])

  // Boot: seed demo data then load projects
  useEffect(() => {
    const boot = async () => {
      try {
        await api.seed()
        await loadProjects()
      } catch {
        setError('Cannot reach the backend. Is the server running on port 8000?')
      }
    }
    boot()
  }, [loadProjects])

  // Reload tasks whenever selected project changes
  useEffect(() => {
    if (selectedProject) loadTasks(selectedProject.id)
  }, [selectedProject, loadTasks])

  // ── Task handlers ──────────────────────────────────────────────────────────

  const handleStatusChange = async (taskId, newStatus) => {
    await api.updateTask(taskId, { status: newStatus })
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
  }

  const handleTaskSave = async (formData) => {
    if (formData.id) {
      const updated = await api.updateTask(formData.id, formData)
      setTasks(prev => prev.map(t => t.id === formData.id ? updated : t))
    } else {
      const created = await api.createTask({ ...formData, project_id: selectedProject.id })
      setTasks(prev => [...prev, created])
    }
    setTaskModal({ open: false, task: null })
  }

  const handleTaskDelete = async (taskId) => {
    await api.deleteTask(taskId)
    setTasks(prev => prev.filter(t => t.id !== taskId))
  }

  // ── Project handlers ───────────────────────────────────────────────────────

  const handleProjectSave = async (formData) => {
    if (formData.id) {
      const updated = await api.updateProject(formData.id, formData)
      setProjects(prev => prev.map(p => p.id === formData.id ? updated : p))
      setSelectedProject(prev => prev?.id === formData.id ? updated : prev)
    } else {
      const created = await api.createProject(formData)
      setProjects(prev => [...prev, created])
      setSelectedProject(created)
      setTasks([])
    }
    setProjectModal({ open: false, project: null })
  }

  const handleProjectDelete = async (projectId) => {
    await api.deleteProject(projectId)
    setProjects(prev => {
      const remaining = prev.filter(p => p.id !== projectId)
      setSelectedProject(curr => {
        if (curr?.id === projectId) {
          setTasks([])
          return remaining[0] || null
        }
        return curr
      })
      return remaining
    })
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  if (error) {
    return (
      <div className="error-screen">
        <span className="error-icon">⚠</span>
        <h2>Connection Error</h2>
        <p>{error}</p>
        <code>cd taskflow/backend &amp;&amp; uvicorn main:app --reload</code>
      </div>
    )
  }

  return (
    <div className="app">
      <Sidebar
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={(p) => { setSelectedProject(p); setTasks([]) }}
        onNewProject={() => setProjectModal({ open: true, project: null })}
        onEditProject={(p) => setProjectModal({ open: true, project: p })}
        onDeleteProject={handleProjectDelete}
      />

      <main className="main">
        <Board
          project={selectedProject}
          tasks={tasks}
          loading={loading}
          onStatusChange={handleStatusChange}
          onNewTask={() => setTaskModal({ open: true, task: null })}
          onEditTask={(t) => setTaskModal({ open: true, task: t })}
          onDeleteTask={handleTaskDelete}
        />
      </main>

      {taskModal.open && (
        <TaskModal
          task={taskModal.task}
          onSave={handleTaskSave}
          onClose={() => setTaskModal({ open: false, task: null })}
        />
      )}

      {projectModal.open && (
        <ProjectModal
          project={projectModal.project}
          onSave={handleProjectSave}
          onClose={() => setProjectModal({ open: false, project: null })}
        />
      )}
    </div>
  )
}
