import { getSprintGroups } from "../lib/sprintChain.js";

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
  const sprintGroups = getSprintGroups(sprints);

  function sprintButton(sprint, isNested = false) {
    return (
      <button
        key={sprint.id}
        className={`sidebar-item ${isNested ? "is-nested" : ""} ${
          activeView === "sprint" && activeSprintId === sprint.id ? "is-active" : ""
        }`}
        onClick={() => onSelectSprint(sprint.id)}
      >
        <span className="sidebar-item-main">
          <span className="sidebar-item-name">{sprint.name}</span>
          <span className="sidebar-item-dates mono">
            {formatShortDate(sprint.startDate)} – {formatShortDate(sprint.endDate)}
          </span>
        </span>
      </button>
    );
  }

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
        <span>Glossary</span>
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
        {sprintGroups.map((group) =>
          group.type === "folder" ? (
            <div className="sidebar-sprint-folder" key={group.id}>
              <div className="sidebar-folder-label">
                <span aria-hidden="true">▾</span>
                <span>{group.label}</span>
                <span className="mono">{group.sprints.length}</span>
              </div>
              {group.sprints.map((sprint) => sprintButton(sprint, true))}
            </div>
          ) : (
            sprintButton(group.sprints[0])
          )
        )}
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
