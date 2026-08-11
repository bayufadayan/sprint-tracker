import { useMemo, useState } from "react";
import { parseTaskTitles } from "../lib/bulkTasks.js";

export default function BulkTaskModal({ sprintName, onSave, onClose }) {
  const [separator, setSeparator] = useState("newline");
  const [value, setValue] = useState("");
  const titles = useMemo(() => parseTaskTitles(value, separator), [value, separator]);

  function handleSubmit(event) {
    event.preventDefault();
    if (titles.length === 0) return;
    onSave(titles);
  }

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <form
        className="modal-card bulk-task-modal"
        onMouseDown={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="modal-header">
          <span className="modal-eyebrow mono">TUGAS MASSAL</span>
          <h2>Tambah banyak tugas</h2>
          <p className="modal-description">
            Masukkan daftar tugas untuk <strong>{sprintName}</strong>.
          </p>
        </div>

        <label className="field bulk-separator-field">
          <span>Pisahkan setiap tugas dengan</span>
          <select value={separator} onChange={(event) => setSeparator(event.target.value)}>
            <option value="newline">Baris baru (Enter)</option>
            <option value="comma">Koma (,)</option>
            <option value="tab">Tab</option>
            <option value="space">Spasi</option>
          </select>
        </label>

        <label className="field">
          <span>Daftar tugas</span>
          <textarea
            autoFocus
            rows="9"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={
              separator === "newline"
                ? "Riset kebutuhan pengguna\nBuat wireframe\nUji alur utama"
                : "Ketik atau tempel daftar tugas di sini"
            }
          />
        </label>

        <div className="bulk-task-summary" aria-live="polite">
          {titles.length > 0
            ? `${titles.length} tugas siap ditambahkan`
            : "Belum ada tugas yang bisa ditambahkan"}
        </div>

        <div className="modal-actions bulk-task-actions">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Batal
          </button>
          <button type="submit" className="btn-primary" disabled={titles.length === 0}>
            Tambahkan {titles.length > 0 ? titles.length : ""} tugas
          </button>
        </div>
      </form>
    </div>
  );
}
