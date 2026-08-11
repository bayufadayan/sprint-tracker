import test from "node:test";
import assert from "node:assert/strict";
import { parseTaskTitles } from "./bulkTasks.js";

const CASES = [
  ["newline", "Satu\r\nDua\n\n Tiga ", ["Satu", "Dua", "Tiga"]],
  ["comma", "Satu, Dua,,Tiga", ["Satu", "Dua", "Tiga"]],
  ["tab", "Satu\tDua\t Tiga", ["Satu", "Dua", "Tiga"]],
  ["space", "Satu   Dua\tTiga", ["Satu", "Dua", "Tiga"]],
];

test("memisahkan dan membersihkan judul tugas massal", () => {
  for (const [separator, input, expected] of CASES) {
    assert.deepEqual(parseTaskTitles(input, separator), expected);
  }
});

test("menggunakan baris baru sebagai separator fallback", () => {
  assert.deepEqual(parseTaskTitles("Satu\nDua", "unknown"), ["Satu", "Dua"]);
});
