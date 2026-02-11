import { useState, useEffect } from 'react'

const PALETTE = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6']
const DEFAULTS = { name: '', description: '', color: '#6366f1' }

export default function ProjectModal({ project, onSave, onClose }) {
  const [form, setForm] = useState(DEFAULTS)

  useEffect(() => {
    setForm(project ? { id: project.id, name: project.name, description: project.description || '', color: project.color } : DEFAULTS)
  }, [project])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    onSave(form)
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>{project ? 'Edit Project' : 'New Project'}</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <label>
            Project Name *
            <input
              autoFocus
              required
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="My awesome project…"
            />
          </label>

          <label>
            Description
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="What is this project about? (optional)"
            />
          </label>

          <label>
            Colour
            <div className="colour-picker">
              {PALETTE.map(c => (
                <button
                  key={c}
                  type="button"
                  className={`colour-btn ${form.color === c ? 'selected' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => set('color', c)}
                />
              ))}
            </div>
          </label>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">{project ? 'Save Changes' : 'Create Project'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
