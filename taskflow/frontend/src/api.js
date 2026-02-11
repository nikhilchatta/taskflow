const BASE = 'http://localhost:8000/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (res.status === 204) return null
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(err.detail || 'Request failed')
  }
  return res.json()
}

export const api = {
  // Projects
  getProjects:   ()           => request('/projects'),
  createProject: (data)       => request('/projects',       { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id, data)   => request(`/projects/${id}`, { method: 'PUT',  body: JSON.stringify(data) }),
  deleteProject: (id)         => request(`/projects/${id}`, { method: 'DELETE' }),

  // Tasks
  getTasks:   (projectId)   => request(`/tasks?project_id=${projectId}`),
  createTask: (data)        => request('/tasks',       { method: 'POST', body: JSON.stringify(data) }),
  updateTask: (id, data)    => request(`/tasks/${id}`, { method: 'PUT',  body: JSON.stringify(data) }),
  deleteTask: (id)          => request(`/tasks/${id}`, { method: 'DELETE' }),

  // Seed demo data
  seed: () => request('/seed', { method: 'POST' }),
}
