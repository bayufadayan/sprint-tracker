import { useState } from "react";
import TaskCard from "./TaskCard.jsx";

export default function BacklogView({ tasks, onTaskClick, onAddTask, onDropTask }) {
  const [dropTarget, setDropTarget] = useState(null);

  return (
    <div className="board">
      <div className="board-header">
        <div>
          <span className="board-eyebrow mono">BACKLOG</span>
          <h1 className="board-title">Backlog</h1>
          <p className="board-goal">
            Tugas yang belum masuk sprint mana pun. Tarik ke sprint kapan pun siap.
          </p>
        </div>
        <button className="btn-primary backlog-add" onClick={onAddTask}>
          + Tambah ke backlog
        </button>
      </div>

      <div
        className="backlog-list"
        onDragOver={(event) => {
          event.preventDefault();
          if (event.target === event.currentTarget) setDropTarget(null);
        }}
        onDrop={(event) => {
          const taskId = event.dataTransfer.getData("text/task-id");
          if (taskId) onDropTask(taskId, "backlog");
          setDropTarget(null);
        }}
      >
        {tasks.map((task) => (
          <div
            key={task.id}
            draggable
            className={`task-card-drag-wrapper ${
              dropTarget?.taskId === task.id ? `is-drop-${dropTarget.placement}` : ""
            }`}
            onDragStart={(event) => {
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/task-id", task.id);
            }}
            onDragEnd={() => setDropTarget(null)}
            onDragOver={(event) => {
              event.preventDefault();
              event.stopPropagation();
              const rect = event.currentTarget.getBoundingClientRect();
              const placement = event.clientY < rect.top + rect.height / 2
                ? "before"
                : "after";
              setDropTarget({ taskId: task.id, placement });
            }}
            onDrop={(event) => {
              event.preventDefault();
              event.stopPropagation();
              const draggedTaskId = event.dataTransfer.getData("text/task-id");
              if (draggedTaskId && draggedTaskId !== task.id) {
                const rect = event.currentTarget.getBoundingClientRect();
                const placement = event.clientY < rect.top + rect.height / 2
                  ? "before"
                  : "after";
                onDropTask(draggedTaskId, "backlog", task.id, placement);
              }
              setDropTarget(null);
            }}
          >
            <TaskCard task={task} onClick={onTaskClick} />
          </div>
        ))}
        {tasks.length === 0 ? (
          <div className="empty-state">
            <p>Backlog masih kosong.</p>
            <p className="empty-state-sub">
              Catat dulu semua ide/tugas di sini, urus sprint-nya belakangan.
            </p>
          </div>
        ) : null}
      </div>

    </div>
  );
}
