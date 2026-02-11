import { useState, useEffect } from 'react'

const DEFAULTS = { title: '', description: '', status: 'todo', priority: 'medium' }

export default function TaskModal({ task, onSave, onClose }) {
  const [form, setForm] = useState(DEFAULTS)

  useEffect(() => {
    setForm(task ? { id: task.id, title: task.title, description: task.description || '', status: task.status, priority: task.priority } : DEFAULTS)
  }, [task])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    onSave(form)
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>{task ? 'Edit Task' : 'New Task'}</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <label>
            Title *
            <input
              autoFocus
              required
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="What needs to be done?"
            />
          </label>

          <label>
            Description
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Add details (optional)…"
            />
          </label>

          <div className="modal-row">
            <label>
              Status
              <select value={form.status} onChange={(e) => set('status', e.target.value)}>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </label>

            <label>
              Priority
              <select value={form.priority} onChange={(e) => set('priority', e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">{task ? 'Save Changes' : 'Create Task'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
