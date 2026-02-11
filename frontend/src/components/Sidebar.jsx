export default function Sidebar({
  projects, selectedProject,
  onSelectProject, onNewProject, onEditProject, onDeleteProject
}) {
  const totalTasks = projects.reduce((n, p) => n + (p.tasks?.length || 0), 0)

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">TaskFlow</span>
        </div>
      </div>

      {/* Project list */}
      <div className="sidebar-section">
        <div className="section-label">
          <span>PROJECTS</span>
          <button className="btn-icon" onClick={onNewProject} title="New project">+</button>
        </div>

        <div className="project-list">
          {projects.length === 0 && (
            <p className="sidebar-empty">No projects yet</p>
          )}
          {projects.map(p => (
            <div
              key={p.id}
              className={`project-item ${selectedProject?.id === p.id ? 'active' : ''}`}
              onClick={() => onSelectProject(p)}
            >
              <span className="project-dot" style={{ backgroundColor: p.color }} />
              <span className="project-name">{p.name}</span>
              <span className="project-task-count">{p.tasks?.length || 0}</span>
              <div className="project-actions">
                <button
                  className="btn-icon-sm"
                  title="Edit"
                  onClick={(e) => { e.stopPropagation(); onEditProject(p) }}
                >✎</button>
                <button
                  className="btn-icon-sm danger"
                  title="Delete"
                  onClick={(e) => { e.stopPropagation(); onDeleteProject(p.id) }}
                >✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer stats */}
      <div className="sidebar-footer">
        <div className="stat">
          <span className="stat-num">{projects.length}</span>
          <span className="stat-lbl">Projects</span>
        </div>
        <div className="stat">
          <span className="stat-num">{totalTasks}</span>
          <span className="stat-lbl">Tasks</span>
        </div>
      </div>
    </aside>
  )
}
