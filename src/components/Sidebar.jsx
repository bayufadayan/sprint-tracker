function formatShortDate(iso) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

export default function Sidebar({
  sprints,
  activeView,
  activeSprintId,
  backlogCount,
  onSelectBacklog,
  onSelectSprint,
  onNewSprint,
  onSelectGlossary,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-mark mono">S</span>
        <span className="sidebar-brand-name">Sprintline</span>
      </div>

<button
	  className={`sidebar-item sidebar-glossary ${
	    activeView === "glossary" ? "is-active" : ""
	  }`}
	  onClick={onSelectGlossary}
	>
	  <span>Grossary</span>
	</button>

      <button
        className={`sidebar-item ${activeView === "backlog" ? "is-active" : ""}`}
        onClick={onSelectBacklog}
      >
        <span>Backlog</span>
        <span className="sidebar-item-count mono">{backlogCount}</span>
      </button>

      <div className="sidebar-section-label">Sprint</div>

      <div className="sidebar-sprints">
        {sprints.map((s) => (
          <button
            key={s.id}
            className={`sidebar-item ${
              activeView === "sprint" && activeSprintId === s.id ? "is-active" : ""
            }`}
            onClick={() => onSelectSprint(s.id)}
          >
            <span className="sidebar-item-main">
              <span className="sidebar-item-name">{s.name}</span>
              <span className="sidebar-item-dates mono">
                {formatShortDate(s.startDate)} – {formatShortDate(s.endDate)}
              </span>
            </span>
          </button>
        ))}
        {sprints.length === 0 ? (
          <p className="sidebar-empty">Belum ada sprint.</p>
        ) : null}
      </div>

      <button className="sidebar-new-sprint" onClick={onNewSprint}>
        + Sprint baru
      </button>
    </aside>
  );
}
