import test from "node:test";
import assert from "node:assert/strict";
import {
  getContinuationDates,
  getSprintChain,
  getSprintGroups,
  nextSprintName,
} from "./sprintChain.js";

test("melanjutkan nomor pada nama sprint", () => {
  assert.equal(nextSprintName("Task"), "Task 2");
  assert.equal(nextSprintName("Task 1"), "Task 2");
  assert.equal(nextSprintName("Task 09"), "Task 10");
});

test("membuat rentang tanggal lanjutan dengan durasi yang sama", () => {
  assert.deepEqual(getContinuationDates("2026-08-01", "2026-08-14"), {
    startDate: "2026-08-15",
    endDate: "2026-08-28",
  });
});

test("menelusuri rantai dari sprint mana pun dan membuat folder", () => {
  const sprints = [
    { id: "2", name: "Task 2", previousSprintId: "1", nextSprintId: "3" },
    { id: "1", name: "Task", previousSprintId: null, nextSprintId: "2" },
    { id: "3", name: "Task 3", previousSprintId: "2", nextSprintId: null },
    { id: "x", name: "Lain", previousSprintId: null, nextSprintId: null },
  ];

  assert.deepEqual(getSprintChain(sprints, "2").map((sprint) => sprint.id), ["1", "2", "3"]);
  const groups = getSprintGroups(sprints);
  assert.equal(groups[0].type, "folder");
  assert.equal(groups[0].label, "Task");
  assert.equal(groups[1].type, "sprint");
});
