import { useState } from "react";

export default function TaskModal({ task, sprints, onSave, onDelete, onClose }) {
  const isEdit = Boolean(task?.id);
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState(task?.priority || "med");
  const [sprintId, setSprintId] = useState(task?.sprintId || "");
  const [status, setStatus] = useState(task?.status || "backlog");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    const nextSprintId = sprintId || null;
    onSave({
      ...task,
      title: title.trim(),
      description: description.trim(),
      priority,
      sprintId: nextSprintId,
      status: nextSprintId ? (task?.sprintId ? status : "todo") : "backlog",
    });
  }

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <form
        className="modal-card"
        onMouseDown={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="modal-header">
          <span className="modal-eyebrow mono">
            {isEdit ? task.id : "TUGAS BARU"}
          </span>
          <h2>{isEdit ? "Ubah tugas" : "Tambah tugas"}</h2>
        </div>

        <label className="field">
          <span>Judul</span>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Misal: Perbaiki validasi upload Excel"
            required
          />
        </label>

        <label className="field">
          <span>Deskripsi (opsional)</span>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detail tambahan, catatan teknis, dsb."
          />
        </label>

        <div className="field-row">
          <label className="field">
            <span>Prioritas</span>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="low">Rendah</option>
              <option value="med">Sedang</option>
              <option value="high">Tinggi</option>
            </select>
          </label>

          <label className="field">
            <span>Sprint</span>
            <select value={sprintId} onChange={(e) => setSprintId(e.target.value)}>
              <option value="">Backlog (belum masuk sprint)</option>
              {sprints.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {isEdit && sprintId ? (
          <label className="field">
            <span>Status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="todo">To Do</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
          </label>
        ) : null}

        <div className="modal-actions">
          {isEdit ? (
            <button
              type="button"
              className="btn-danger"
              onClick={() => onDelete(task.id)}
            >
              Hapus
            </button>
          ) : (
            <span />
          )}
          <div className="modal-actions-right">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn-primary">
              {isEdit ? "Simpan perubahan" : "Tambah tugas"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
