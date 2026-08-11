import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import BacklogView from "./components/BacklogView.jsx";
import SprintBoard from "./components/SprintBoard.jsx";
import TaskModal from "./components/TaskModal.jsx";
import GlossaryView from "./components/GlossaryView.jsx";
import SprintModal from "./components/SprintModal.jsx";
import {
  getSprints,
  getTasks,
  saveSprint,
  deleteSprint,
  saveTask,
  deleteTask,
  updateTaskStatus,
} from "./lib/storage.js";
import "./app.css";

export default function App() {
  const [sprints, setSprints] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState("backlog"); // "backlog" | "sprint"
  const [activeSprintId, setActiveSprintId] = useState(null);

  const [taskModal, setTaskModal] = useState(null); // { task } | { forSprintId } | null
  const [sprintModal, setSprintModal] = useState(null); // { sprint } | {} | null

  useEffect(() => {
    setSprints(getSprints());
    setTasks(getTasks());
  }, []);

  function refresh() {
    setSprints(getSprints());
    setTasks(getTasks());
  }

  const activeSprint = sprints.find((s) => s.id === activeSprintId) || null;

  function handleSelectSprint(id) {
    setActiveSprintId(id);
    setView("sprint");
  }

  function handleSelectBacklog() {
    setView("backlog");
  }

  function handleSelectGlossary() {
    setView("glossary");
  }

  function handleSaveTask(task) {
    saveTask(task);
    refresh();
    setTaskModal(null);
  }

  function handleDeleteTask(taskId) {
    deleteTask(taskId);
    refresh();
    setTaskModal(null);
  }

  function handleSaveSprint(sprint) {
    const saved = saveSprint(sprint);
    refresh();
    setSprintModal(null);
    setActiveSprintId(saved.id);
    setView("sprint");
  }

  function handleDeleteSprint(sprintId) {
    deleteSprint(sprintId);
    refresh();
    setSprintModal(null);
    setView("backlog");
    setActiveSprintId(null);
  }

  function handleDropTask(taskId, status) {
    updateTaskStatus(taskId, status);
    refresh();
  }

  const backlogTasks = tasks.filter((t) => !t.sprintId);
  const sprintTasks = activeSprint
    ? tasks.filter((t) => t.sprintId === activeSprint.id)
    : [];

  return (
    <div className="app-shell">
      <Sidebar
        sprints={sprints}
        activeView={view}
        activeSprintId={activeSprintId}
        backlogCount={backlogTasks.length}
        onSelectBacklog={handleSelectBacklog}
        onSelectSprint={handleSelectSprint}
        onNewSprint={() => setSprintModal({})}
	onSelectGlossary={handleSelectGlossary}
      />

      <main className="app-main">
       {view === "glossary" ? (
	    <GlossaryView />
  	) : view === "sprint" && activeSprint ? (
<SprintBoard
            sprint={activeSprint}
            tasks={sprintTasks}
            onTaskClick={(task) => setTaskModal({ task })}
            onAddTask={() => setTaskModal({ forSprintId: activeSprint.id })}
            onEditSprint={(sprint) => setSprintModal({ sprint })}
            onDropTask={handleDropTask}
          />
          
        ) : (
          <BacklogView
            tasks={backlogTasks}
            onTaskClick={(task) => setTaskModal({ task })}
            onAddTask={() => setTaskModal({ forSprintId: null })}
          />
        )}
      </main>

      {taskModal ? (
        <TaskModal
          task={
            taskModal.task ||
            (taskModal.forSprintId
              ? { sprintId: taskModal.forSprintId, status: "todo", priority: "med" }
              : { sprintId: null, status: "backlog", priority: "med" })
          }
          sprints={sprints}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          onClose={() => setTaskModal(null)}
        />
      ) : null}

      {sprintModal ? (
        <SprintModal
          sprint={sprintModal.sprint}
          onSave={handleSaveSprint}
          onDelete={handleDeleteSprint}
          onClose={() => setSprintModal(null)}
        />
      ) : null}
    </div>
  );
}
