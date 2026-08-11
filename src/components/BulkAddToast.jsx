import { useEffect, useState } from "react";

const TOAST_DURATION_SECONDS = 7;

export default function BulkAddToast({ count, onUndo, onClose }) {
  const [secondsLeft, setSecondsLeft] = useState(TOAST_DURATION_SECONDS);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSecondsLeft((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    const timeoutId = window.setTimeout(onClose, TOAST_DURATION_SECONDS * 1000);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, [onClose]);

  return (
    <div className="bulk-toast" role="status" aria-live="polite">
      <div className="bulk-toast-icon" aria-hidden="true">✓</div>
      <div className="bulk-toast-copy">
        <strong>{count} tugas ditambahkan</strong>
        <span>Semua tugas masuk ke kolom To Do.</span>
      </div>
      <span className="bulk-toast-timer mono">{secondsLeft} dtk</span>
      <button type="button" className="bulk-toast-undo" onClick={onUndo}>
        Batalkan
      </button>
      <button
        type="button"
        className="bulk-toast-close"
        aria-label="Tutup notifikasi"
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
}
