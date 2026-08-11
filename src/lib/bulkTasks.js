const SEPARATORS = {
  newline: /\r?\n/,
  comma: ",",
  tab: "\t",
  space: /\s+/,
};

export function parseTaskTitles(value, separator) {
  return value
    .split(SEPARATORS[separator] || SEPARATORS.newline)
    .map((title) => title.trim())
    .filter(Boolean);
}
