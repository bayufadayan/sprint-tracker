const PRIORITY_STYLES = {
  low: { label: "Rendah", color: "var(--slate)", bg: "var(--line)" },
  med: { label: "Sedang", color: "var(--ink-mid)", bg: "var(--pale)" },
  high: { label: "Tinggi", color: "#a34a1f", bg: "var(--amber-bg)" },
};

export default function TaskCard({ task, onClick, dragHandleProps }) {
  const priority = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.med;

  return (
    <button
      className="task-card"
      onClick={() => onClick(task)}
      {...dragHandleProps}
    >
      <div className="task-card-top">
        <span className="task-card-id mono">{task.id}</span>
        <span
          className="task-card-priority"
          style={{ color: priority.color, background: priority.bg }}
        >
          {priority.label}
        </span>
      </div>
      <p className="task-card-title">{task.title}</p>
      {task.description ? (
        <p className="task-card-desc">{task.description}</p>
      ) : null}

      <style>{`
        .task-card {
          display: block;
          width: 100%;
          text-align: left;
          background: #fff;
          border: 1px solid var(--line);
          border-left: 3px solid var(--ink);
          border-radius: var(--radius-sm);
          padding: 10px 12px 12px;
          cursor: pointer;
          box-shadow: var(--shadow-card);
          transition: transform 0.12s ease, box-shadow 0.12s ease;
          font-family: var(--font-body);
        }
        .task-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(8, 30, 74, 0.12);
        }
        .task-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }
        .task-card-id {
          font-size: 11px;
          letter-spacing: 0.03em;
          color: var(--slate);
        }
        .task-card-priority {
          font-size: 10.5px;
          font-weight: 600;
          padding: 2px 7px;
          border-radius: 999px;
        }
        .task-card-title {
          margin: 0 0 4px;
          font-size: 14px;
          font-weight: 600;
          color: var(--charcoal);
          line-height: 1.35;
        }
        .task-card-desc {
          margin: 0;
          font-size: 12.5px;
          color: var(--slate);
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </button>
  );
}
