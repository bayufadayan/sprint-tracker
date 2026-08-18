import test from "node:test";
import assert from "node:assert/strict";
import {
  createSprintContinuation,
  deleteSprint,
  getSprints,
  getTasks,
  releaseSpecificBacklogTask,
  saveSprint,
  saveTask,
  updateTaskPosition,
} from "./storage.js";

function resetLocalStorage() {
  const values = new Map();
  globalThis.localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
}

test("membuat lanjutan di ujung rantai dan menyambungkan dua arah", () => {
  resetLocalStorage();
  const first = saveSprint({
    name: "Task",
    goal: "",
    startDate: "2026-08-01",
    endDate: "2026-08-14",
  });
  const second = createSprintContinuation(first.id);
  const third = createSprintContinuation(first.id);
  const sprints = getSprints();
  const storedFirst = sprints.find((sprint) => sprint.id === first.id);
  const storedSecond = sprints.find((sprint) => sprint.id === second.id);

  assert.equal(second.name, "Task 2");
  assert.equal(third.name, "Task 3");
  assert.equal(storedFirst.nextSprintId, second.id);
  assert.equal(storedSecond.previousSprintId, first.id);
  assert.equal(storedSecond.nextSprintId, third.id);
});

test("menghubungkan ulang tetangga saat sprint tengah dihapus", () => {
  resetLocalStorage();
  const first = saveSprint({
    name: "Task 1",
    goal: "",
    startDate: "2026-08-01",
    endDate: "2026-08-14",
  });
  const second = createSprintContinuation(first.id);
  const third = createSprintContinuation(first.id);

  deleteSprint(second.id);
  const sprints = getSprints();
  assert.equal(sprints.find((sprint) => sprint.id === first.id).nextSprintId, third.id);
  assert.equal(sprints.find((sprint) => sprint.id === third.id).previousSprintId, first.id);
});

test("mengeluarkan task backlog khusus ke To Do sprint tujuan", () => {
  resetLocalStorage();
  const task = saveTask({
    title: "Siapkan laporan",
    priority: "med",
    sprintId: null,
    status: "backlog",
    specificBacklogSprintId: "SPR-1",
  });

  releaseSpecificBacklogTask(task.id, "SPR-2");
  const released = getTasks()[0];
  assert.equal(released.sprintId, "SPR-2");
  assert.equal(released.status, "todo");
  assert.equal(released.specificBacklogSprintId, undefined);
});

test("menyimpan urutan task saat dipindah ke atas dan ke bawah", () => {
  resetLocalStorage();
  const first = saveTask({ title: "Pertama", sprintId: "SPR-1", status: "todo" });
  const second = saveTask({ title: "Kedua", sprintId: "SPR-1", status: "todo" });
  const third = saveTask({ title: "Ketiga", sprintId: "SPR-1", status: "todo" });

  updateTaskPosition(third.id, "todo", first.id, "before");
  assert.deepEqual(getTasks().map((task) => task.id), [third.id, first.id, second.id]);

  updateTaskPosition(third.id, "todo", second.id, "after");
  assert.deepEqual(getTasks().map((task) => task.id), [first.id, second.id, third.id]);
});

test("menaruh task di posisi yang dipilih saat pindah kolom", () => {
  resetLocalStorage();
  const doing = saveTask({ title: "Doing", sprintId: "SPR-1", status: "doing" });
  const first = saveTask({ title: "Pertama", sprintId: "SPR-1", status: "todo" });
  const second = saveTask({ title: "Kedua", sprintId: "SPR-1", status: "todo" });

  updateTaskPosition(doing.id, "todo", second.id, "before");
  const todoTasks = getTasks().filter((task) => task.status === "todo");
  assert.deepEqual(todoTasks.map((task) => task.id), [first.id, doing.id, second.id]);
});
