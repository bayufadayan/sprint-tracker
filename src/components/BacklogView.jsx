import TaskCard from "./TaskCard.jsx";

export default function BacklogView({ tasks, onTaskClick, onAddTask }) {
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

      <div className="backlog-list">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={onTaskClick} />
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
