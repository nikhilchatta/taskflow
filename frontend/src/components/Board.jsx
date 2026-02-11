import Column from './Column'

const COLUMNS = [
  { id: 'todo',        label: 'To Do',       color: '#64748b' },
  { id: 'in_progress', label: 'In Progress', color: '#f59e0b' },
  { id: 'done',        label: 'Done',        color: '#10b981' },
]

export default function Board({ project, tasks, loading, onStatusChange, onNewTask, onEditTask, onDeleteTask }) {
  if (!project) {
    return (
      <div className="empty-state">
        <span className="empty-icon">📋</span>
        <h2>No project selected</h2>
        <p>Pick a project from the sidebar or create a new one.</p>
      </div>
    )
  }

  const done  = tasks.filter(t => t.status === 'done').length
  const pct   = tasks.length ? Math.round((done / tasks.length) * 100) : 0

  return (
    <div className="board">
      {/* Board header */}
      <div className="board-header">
        <div className="board-title">
          <span className="project-chip" style={{ backgroundColor: project.color }} />
          <div>
            <h1>{project.name}</h1>
            {project.description && <p className="board-desc">{project.description}</p>}
          </div>
        </div>

        <div className="board-meta">
          <div className="progress-wrap">
            <span>{pct}% complete</span>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${pct}%`, backgroundColor: project.color }}
              />
            </div>
          </div>
          <button className="btn-primary" onClick={onNewTask}>+ New Task</button>
        </div>
      </div>

      {/* Columns */}
      <div className="board-columns">
        {COLUMNS.map(col => (
          <Column
            key={col.id}
            column={col}
            tasks={tasks.filter(t => t.status === col.id)}
            loading={loading}
            onStatusChange={onStatusChange}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>
    </div>
  )
}
