import TaskCard from './TaskCard'

export default function Column({ column, tasks, loading, onStatusChange, onEdit, onDelete }) {
  return (
    <div className="column">
      <div className="column-header">
        <div className="col-title">
          <span className="col-dot" style={{ backgroundColor: column.color }} />
          <span>{column.label}</span>
        </div>
        <span className="col-badge">{tasks.length}</span>
      </div>

      <div className="column-body">
        {loading ? (
          <>
            <div className="skeleton" />
            <div className="skeleton" />
            <div className="skeleton" style={{ opacity: 0.5 }} />
          </>
        ) : tasks.length === 0 ? (
          <div className="col-empty">No tasks</div>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}
