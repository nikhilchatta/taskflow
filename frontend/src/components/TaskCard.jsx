const PRIORITY = {
  low:    { bg: '#64748b22', color: '#94a3b8' },
  medium: { bg: '#f59e0b22', color: '#f59e0b' },
  high:   { bg: '#ef444422', color: '#ef4444' },
}

const STATUS_OPTS = [
  { value: 'todo',        label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done',        label: 'Done' },
]

export default function TaskCard({ task, onStatusChange, onEdit, onDelete }) {
  const p = PRIORITY[task.priority] || PRIORITY.medium

  return (
    <div className="task-card" onClick={() => onEdit(task)}>
      {/* Header row */}
      <div className="tc-head">
        <span className="priority-tag" style={{ background: p.bg, color: p.color }}>
          {task.priority}
        </span>
        <button
          className="btn-icon-sm danger"
          title="Delete task"
          onClick={(e) => { e.stopPropagation(); onDelete(task.id) }}
        >✕</button>
      </div>

      {/* Title */}
      <p className="tc-title">{task.title}</p>

      {/* Description */}
      {task.description && <p className="tc-desc">{task.description}</p>}

      {/* Status selector */}
      <div className="tc-foot" onClick={(e) => e.stopPropagation()}>
        <select
          className="status-select"
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
        >
          {STATUS_OPTS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}
