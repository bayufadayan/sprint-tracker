import { getContinuationDates, getSprintChain, nextSprintName } from "./sprintChain.js";

// Semua data disimpan di localStorage browser. Tidak ada server, tidak ada akun.
// Format kunci: "sprintline:sprints" dan "sprintline:tasks"

const KEYS = {
  sprints: "sprintline:sprints",
  tasks: "sprintline:tasks",
};

function read(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error(`Gagal membaca ${key} dari localStorage`, err);
    return [];
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Gagal menyimpan ${key} ke localStorage`, err);
  }
}

function makeId(prefix) {
  const rand = Math.random().toString(36).slice(2, 6);
  return `${prefix}-${Date.now().toString(36)}${rand}`.toUpperCase();
}

// ---------- Sprints ----------

export function getSprints() {
  return read(KEYS.sprints).sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
}

export function saveSprint(sprint) {
  const sprints = read(KEYS.sprints);
  if (sprint.id) {
    const idx = sprints.findIndex((s) => s.id === sprint.id);
    if (idx !== -1) sprints[idx] = sprint;
  } else {
    sprint.id = makeId("SPR");
    sprints.push(sprint);
  }
  write(KEYS.sprints, sprints);
  return sprint;
}

export function createSprintContinuation(sprintId) {
  const sprints = read(KEYS.sprints);
  const chain = getSprintChain(sprints, sprintId);
  const source = chain.at(-1);
  if (!source) return null;

  const continuation = {
    id: makeId("SPR"),
    name: nextSprintName(source.name),
    goal: "",
    ...getContinuationDates(source.startDate, source.endDate),
    previousSprintId: source.id,
    nextSprintId: null,
  };

  const sourceIndex = sprints.findIndex((sprint) => sprint.id === source.id);
  sprints[sourceIndex] = { ...source, nextSprintId: continuation.id };
  sprints.push(continuation);
  write(KEYS.sprints, sprints);
  return continuation;
}

export function deleteSprint(sprintId) {
  const existingSprints = read(KEYS.sprints);
  const deletedSprint = existingSprints.find((s) => s.id === sprintId);
  const replacementId = deletedSprint?.previousSprintId || deletedSprint?.nextSprintId || null;
  const sprints = existingSprints
    .filter((s) => s.id !== sprintId)
    .map((sprint) => {
      if (sprint.id === deletedSprint?.previousSprintId) {
        return { ...sprint, nextSprintId: deletedSprint.nextSprintId || null };
      }
      if (sprint.id === deletedSprint?.nextSprintId) {
        return { ...sprint, previousSprintId: deletedSprint.previousSprintId || null };
      }
      return sprint;
    });
  write(KEYS.sprints, sprints);
  // Task yang ada di sprint ini dikembalikan ke backlog, bukan ikut terhapus.
  const tasks = read(KEYS.tasks).map((task) => {
    if (task.sprintId === sprintId) {
      return { ...task, sprintId: null, status: "backlog" };
    }
    if (task.specificBacklogSprintId === sprintId) {
      const nextTask = { ...task };
      if (replacementId) nextTask.specificBacklogSprintId = replacementId;
      else delete nextTask.specificBacklogSprintId;
      return nextTask;
    }
    return task;
  });
  write(KEYS.tasks, tasks);
}

// ---------- Tasks ----------

export function getTasks() {
  return read(KEYS.tasks);
}

export function saveTask(task) {
  const normalizedTask = { ...task };
  if (normalizedTask.sprintId) delete normalizedTask.specificBacklogSprintId;
  const tasks = read(KEYS.tasks);
  if (normalizedTask.id) {
    const idx = tasks.findIndex((t) => t.id === normalizedTask.id);
    if (idx !== -1) tasks[idx] = normalizedTask;
  } else {
    normalizedTask.id = makeId("TSK");
    normalizedTask.createdAt = new Date().toISOString();
    tasks.push(normalizedTask);
  }
  write(KEYS.tasks, tasks);
  return normalizedTask;
}

export function releaseSpecificBacklogTask(taskId, sprintId) {
  const tasks = read(KEYS.tasks);
  const index = tasks.findIndex((task) => task.id === taskId);
  if (index === -1) return null;

  const releasedTask = { ...tasks[index], sprintId, status: "todo" };
  delete releasedTask.specificBacklogSprintId;
  tasks[index] = releasedTask;
  write(KEYS.tasks, tasks);
  return releasedTask;
}

export function saveTasks(newTasks) {
  const tasks = read(KEYS.tasks);
  const createdAt = new Date().toISOString();
  const savedTasks = newTasks.map((task) => ({
    ...task,
    id: makeId("TSK"),
    createdAt,
  }));

  write(KEYS.tasks, [...tasks, ...savedTasks]);
  return savedTasks;
}

export function deleteTask(taskId) {
  const tasks = read(KEYS.tasks).filter((t) => t.id !== taskId);
  write(KEYS.tasks, tasks);
}

export function deleteTasks(taskIds) {
  const ids = new Set(taskIds);
  const tasks = read(KEYS.tasks).filter((task) => !ids.has(task.id));
  write(KEYS.tasks, tasks);
}

export function updateTaskStatus(taskId, status) {
  const tasks = read(KEYS.tasks);
  const idx = tasks.findIndex((t) => t.id === taskId);
  if (idx !== -1) {
    tasks[idx].status = status;
    write(KEYS.tasks, tasks);
  }
}

export function moveTaskToSprint(taskId, sprintId) {
  const tasks = read(KEYS.tasks);
  const idx = tasks.findIndex((t) => t.id === taskId);
  if (idx !== -1) {
    tasks[idx].sprintId = sprintId;
    tasks[idx].status = sprintId ? "todo" : "backlog";
    write(KEYS.tasks, tasks);
  }
}
