import { useState } from "react";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function addDaysISO(iso, days) {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function SprintModal({ sprint, onSave, onDelete, onClose }) {
  const isEdit = Boolean(sprint?.id);
  const [name, setName] = useState(sprint?.name || "");
  const [goal, setGoal] = useState(sprint?.goal || "");
  const [startDate, setStartDate] = useState(sprint?.startDate || todayISO());
  const [endDate, setEndDate] = useState(
    sprint?.endDate || addDaysISO(todayISO(), 13)
  );

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !startDate || !endDate) return;
    onSave({ ...sprint, name: name.trim(), goal: goal.trim(), startDate, endDate });
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
            {isEdit ? sprint.id : "SPRINT BARU"}
          </span>
          <h2>{isEdit ? "Ubah sprint" : "Buat sprint"}</h2>
        </div>

        <label className="field">
          <span>Nama sprint</span>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Misal: Sprint 14 — Modul Import"
            required
          />
        </label>

        <label className="field">
          <span>Tujuan sprint (opsional)</span>
          <input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Apa yang mau dicapai di sprint ini?"
          />
        </label>

        <div className="field-row">
          <label className="field">
            <span>Mulai</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </label>
          <label className="field">
            <span>Selesai</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="modal-actions">
          {isEdit ? (
            <button
              type="button"
              className="btn-danger"
              onClick={() => onDelete(sprint.id)}
            >
              Hapus sprint
            </button>
          ) : (
            <span />
          )}
          <div className="modal-actions-right">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn-primary">
              {isEdit ? "Simpan perubahan" : "Buat sprint"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
