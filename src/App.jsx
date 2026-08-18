import { useCallback, useEffect, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import BacklogView from "./components/BacklogView.jsx";
import SprintBoard from "./components/SprintBoard.jsx";
import TaskModal from "./components/TaskModal.jsx";
import GlossaryView from "./components/GlossaryView.jsx";
import SprintModal from "./components/SprintModal.jsx";
import BulkTaskModal from "./components/BulkTaskModal.jsx";
import BulkAddToast from "./components/BulkAddToast.jsx";
import {
  getSprints,
  getTasks,
  saveSprint,
  deleteSprint,
  saveTask,
  saveTasks,
  deleteTask,
  deleteTasks,
  updateTaskPosition,
  createSprintContinuation,
  releaseSpecificBacklogTask,
} from "./lib/storage.js";
import { getSprintChain } from "./lib/sprintChain.js";
import "./app.css";

export default function App() {
  const [sprints, setSprints] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState("backlog"); // "backlog" | "sprint"
  const [activeSprintId, setActiveSprintId] = useState(null);

  const [taskModal, setTaskModal] = useState(null); // { task } | { forSprintId } | null
  const [sprintModal, setSprintModal] = useState(null); // { sprint } | {} | null
  const [bulkTaskModal, setBulkTaskModal] = useState(false);
  const [bulkToast, setBulkToast] = useState(null); // { taskIds, count } | null

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

  function handleBulkSave(titles) {
    const savedTasks = saveTasks(
      titles.map((title) => ({
        title,
        description: "",
        priority: "med",
        sprintId: activeSprint.id,
        status: "todo",
      }))
    );

    refresh();
    setBulkTaskModal(false);
    setBulkToast({
      taskIds: savedTasks.map((task) => task.id),
      count: savedTasks.length,
    });
  }

  function handleUndoBulkAdd() {
    if (!bulkToast) return;
    deleteTasks(bulkToast.taskIds);
    refresh();
    setBulkToast(null);
  }

  const handleCloseBulkToast = useCallback(() => {
    setBulkToast(null);
  }, []);

  function handleSaveSprint(sprint) {
    const saved = saveSprint(sprint);
    refresh();
    setSprintModal(null);
    setActiveSprintId(saved.id);
    setView("sprint");
  }

  function handleCreateContinuation() {
    if (!activeSprint) return;
    const saved = createSprintContinuation(activeSprint.id);
    if (!saved) return;
    refresh();
    setActiveSprintId(saved.id);
    setView("sprint");
  }

  function handleAddSpecificBacklogTask({ title, priority }) {
    if (!activeSprint) return;
    saveTask({
      title,
      description: "",
      priority,
      sprintId: null,
      status: "backlog",
      specificBacklogSprintId: activeSprint.id,
    });
    refresh();
  }

  function handleReleaseSpecificBacklogTask(taskId, sprintId) {
    releaseSpecificBacklogTask(taskId, sprintId);
    refresh();
  }

  function handleDeleteSpecificBacklogTask(taskId) {
    deleteTask(taskId);
    refresh();
  }

  function handleDeleteSprint(sprintId) {
    deleteSprint(sprintId);
    refresh();
    setSprintModal(null);
    setView("backlog");
    setActiveSprintId(null);
  }

  function handleDropTask(taskId, status, targetTaskId = null, placement = "after") {
    updateTaskPosition(taskId, status, targetTaskId, placement);
    refresh();
  }

  const backlogTasks = tasks.filter((t) => !t.sprintId && !t.specificBacklogSprintId);
  const sprintTasks = activeSprint
    ? tasks.filter((t) => t.sprintId === activeSprint.id)
    : [];
  const linkedSprints = activeSprint ? getSprintChain(sprints, activeSprint.id) : [];
  const specificBacklogTasks = activeSprint
    ? tasks.filter((task) => task.specificBacklogSprintId === activeSprint.id)
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
            onBulkAddTask={() => setBulkTaskModal(true)}
            onEditSprint={(sprint) => setSprintModal({ sprint })}
            onDropTask={handleDropTask}
            linkedSprints={linkedSprints}
            specificBacklogTasks={specificBacklogTasks}
            onCreateContinuation={handleCreateContinuation}
            onSelectSprint={handleSelectSprint}
            onAddSpecificBacklogTask={handleAddSpecificBacklogTask}
            onReleaseSpecificBacklogTask={handleReleaseSpecificBacklogTask}
            onDeleteSpecificBacklogTask={handleDeleteSpecificBacklogTask}
          />
          
        ) : (
          <BacklogView
            tasks={backlogTasks}
            onTaskClick={(task) => setTaskModal({ task })}
            onAddTask={() => setTaskModal({ forSprintId: null })}
            onDropTask={handleDropTask}
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

      {bulkTaskModal && activeSprint ? (
        <BulkTaskModal
          sprintName={activeSprint.name}
          onSave={handleBulkSave}
          onClose={() => setBulkTaskModal(false)}
        />
      ) : null}

      {bulkToast ? (
        <BulkAddToast
          key={bulkToast.taskIds.join(",")}
          count={bulkToast.count}
          onUndo={handleUndoBulkAdd}
          onClose={handleCloseBulkToast}
        />
      ) : null}
    </div>
  );
}
