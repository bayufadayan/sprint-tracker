import { useState } from "react";

const PRIORITY_LABELS = {
  low: "Rendah",
  med: "Sedang",
  high: "Tinggi",
};

export default function SprintBacklog({
  sprint,
  linkedSprints,
  tasks,
  onAdd,
  onRelease,
  onDelete,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("med");
  const [targets, setTargets] = useState({});

  function handleSubmit(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    onAdd({ title: cleanTitle, priority });
    setTitle("");
    setPriority("med");
  }

  return (
    <section className="sprint-backlog">
      <button
        type="button"
        className="text-link sprint-backlog-trigger"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        Buat task spesific backlog
        {tasks.length > 0 ? <span className="mono">({tasks.length})</span> : null}
      </button>

      {isOpen ? (
        <div className="sprint-backlog-panel">
          <div className="sprint-backlog-heading">
            <h2>Backlog khusus {sprint.name}</h2>
            <p>Simpan dulu, lalu keluarkan ke sprint ini atau sprint yang terhubung.</p>
          </div>

          <form className="sprint-backlog-form" onSubmit={handleSubmit}>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Judul task"
              aria-label="Judul task backlog khusus"
              required
            />
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              aria-label="Prioritas task"
            >
              <option value="low">Rendah</option>
              <option value="med">Sedang</option>
              <option value="high">Tinggi</option>
            </select>
            <button className="btn-primary" type="submit">+ Simpan</button>
          </form>

          <div className="sprint-backlog-list">
            {tasks.map((task) => {
              const targetId = targets[task.id] || sprint.id;
              return (
                <div className="sprint-backlog-item" key={task.id}>
                  <div className="sprint-backlog-task">
                    <span>{task.title}</span>
                    <span className="mono">
                      {task.id} · {PRIORITY_LABELS[task.priority] || "Sedang"}
                    </span>
                  </div>
                  <select
                    value={targetId}
                    onChange={(event) =>
                      setTargets((current) => ({
                        ...current,
                        [task.id]: event.target.value,
                      }))
                    }
                    aria-label={`Pilih sprint tujuan untuk ${task.title}`}
                  >
                    {linkedSprints.map((item) => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn-ghost sprint-backlog-release"
                    onClick={() => onRelease(task.id, targetId)}
                  >
                    Keluarkan
                  </button>
                  <button
                    type="button"
                    className="btn-icon-danger"
                    aria-label={`Hapus ${task.title}`}
                    onClick={() => onDelete(task.id)}
                  >
                    ×
                  </button>
                </div>
              );
            })}
            {tasks.length === 0 ? (
              <p className="sprint-backlog-empty">Belum ada task di backlog khusus ini.</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
