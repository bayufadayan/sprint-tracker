function parseISODate(iso) {
  return new Date(`${iso}T00:00:00Z`);
}

function toISODate(date) {
  return date.toISOString().slice(0, 10);
}

export function nextSprintName(name) {
  const cleanName = name.trim();
  const numberedName = cleanName.match(/^(.*?)(\d+)$/);

  if (!numberedName) return `${cleanName} 2`;

  const prefix = numberedName[1].trimEnd();
  const nextNumber = Number(numberedName[2]) + 1;
  return prefix ? `${prefix} ${nextNumber}` : String(nextNumber);
}

export function getContinuationDates(startDate, endDate) {
  const start = parseISODate(startDate);
  const end = parseISODate(endDate);
  const duration = Math.max(0, end.getTime() - start.getTime());
  const nextStart = new Date(end);
  nextStart.setUTCDate(nextStart.getUTCDate() + 1);
  const nextEnd = new Date(nextStart.getTime() + duration);

  return {
    startDate: toISODate(nextStart),
    endDate: toISODate(nextEnd),
  };
}

export function getSprintChain(sprints, sprintId) {
  const byId = new Map(sprints.map((sprint) => [sprint.id, sprint]));
  let head = byId.get(sprintId);
  const previousVisited = new Set();

  while (
    head?.previousSprintId &&
    byId.has(head.previousSprintId) &&
    !previousVisited.has(head.previousSprintId)
  ) {
    previousVisited.add(head.id);
    head = byId.get(head.previousSprintId);
  }

  const chain = [];
  const nextVisited = new Set();
  let current = head;

  while (current && !nextVisited.has(current.id)) {
    chain.push(current);
    nextVisited.add(current.id);
    current = current.nextSprintId ? byId.get(current.nextSprintId) : null;
  }

  return chain;
}

export function getSprintGroups(sprints) {
  const visited = new Set();
  const groups = [];

  for (const sprint of sprints) {
    if (visited.has(sprint.id)) continue;

    const chain = getSprintChain(sprints, sprint.id);
    chain.forEach((item) => visited.add(item.id));
    groups.push({
      id: chain.length > 1 ? `folder-${chain[0].id}` : chain[0].id,
      type: chain.length > 1 ? "folder" : "sprint",
      label: chain[0].name.replace(/\s+\d+$/, "") || chain[0].name,
      sprints: chain,
    });
  }

  return groups;
}
