import TaskCard from "./TaskCard.jsx";
import SprintBacklog from "./SprintBacklog.jsx";

const COLUMNS = [
  { key: "todo", label: "To Do" },
  { key: "doing", label: "Doing" },
  { key: "done", label: "Done" },
];

function daysBetween(a, b) {
  const ms = new Date(b) - new Date(a);
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function formatRange(start, end) {
  const opts = { day: "numeric", month: "short" };
  const s = new Date(start).toLocaleDateString("id-ID", opts);
  const e = new Date(end).toLocaleDateString("id-ID", opts);
  return `${s} — ${e}`;
}

export default function SprintBoard({
  sprint,
  tasks,
  onTaskClick,
  onAddTask,
  onBulkAddTask,
  onEditSprint,
  onDropTask,
  linkedSprints,
  specificBacklogTasks,
  onCreateContinuation,
  onSelectSprint,
  onAddSpecificBacklogTask,
  onReleaseSpecificBacklogTask,
  onDeleteSpecificBacklogTask,
}) {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const today = new Date().toISOString().slice(0, 10);
  const daysLeft = daysBetween(today, sprint.endDate);
  const isOver = daysLeft < 0;
  const sprintIndex = linkedSprints.findIndex((item) => item.id === sprint.id);
  const previousSprint = linkedSprints[sprintIndex - 1] || null;
  const nextSprint = linkedSprints[sprintIndex + 1] || null;

  return (
    <div className="board">
      <div className="board-header">
        <div>
          <span className="board-eyebrow mono">{sprint.id}</span>
          <h1 onClick={() => onEditSprint(sprint)} className="board-title">
            {sprint.name}
          </h1>
          {sprint.goal ? <p className="board-goal">{sprint.goal}</p> : null}
          {linkedSprints.length > 1 ? (
            <div className="sprint-chain-nav">
              {previousSprint ? (
                <button className="text-link" onClick={() => onSelectSprint(previousSprint.id)}>
                  ← {previousSprint.name}
                </button>
              ) : null}
              <span className="mono">{sprintIndex + 1}/{linkedSprints.length}</span>
              {nextSprint ? (
                <button className="text-link" onClick={() => onSelectSprint(nextSprint.id)}>
                  {nextSprint.name} →
                </button>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="board-meta">
          <div className="board-dates mono">{formatRange(sprint.startDate, sprint.endDate)}</div>
          <div
            className="board-countdown"
            style={{ color: isOver ? "var(--slate)" : "var(--ink-mid)" }}
          >
            {isOver ? "Sprint selesai" : `${daysLeft} hari lagi`}
          </div>
          <button className="btn-ghost board-continuation" onClick={onCreateContinuation}>
            Buat Lanjutan
          </button>
        </div>
      </div>

      <div className="board-progress">
        <div className="board-progress-track">
          <div className="board-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="board-progress-label mono">
          {done}/{total} selesai · {pct}%
        </span>
      </div>

      <SprintBacklog
        sprint={sprint}
        linkedSprints={linkedSprints}
        tasks={specificBacklogTasks}
        onAdd={onAddSpecificBacklogTask}
        onRelease={onReleaseSpecificBacklogTask}
        onDelete={onDeleteSpecificBacklogTask}
      />

      <div className="board-columns">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);
          return (
            <div
              key={col.key}
              className="board-column"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const taskId = e.dataTransfer.getData("text/task-id");
                if (taskId) onDropTask(taskId, col.key);
              }}
            >
              <div className="board-column-head">
                <span>{col.label}</span>
                <span className="board-column-count mono">{colTasks.length}</span>
              </div>

              <div className="board-column-body">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) =>
                      e.dataTransfer.setData("text/task-id", task.id)
                    }
                  >
                    <TaskCard task={task} onClick={onTaskClick} />
                  </div>
                ))}
                {colTasks.length === 0 ? (
                  <p className="board-column-empty">Belum ada tugas</p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="board-actions">
        <button className="btn-primary" onClick={onAddTask}>
          + Tambah tugas ke sprint ini
        </button>
        <button className="btn-ghost" onClick={onBulkAddTask}>
          + Tambah tugas massal
        </button>
      </div>
    </div>
  );
}
