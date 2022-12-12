import run from "aocrunner";

function getElevation(a: string) {

  if (a === "S") return 0;
  if (a === "E") return 25;

  return "abcdefghijklmnopqrstuvwxyz".indexOf(a);
};

const parseInput = (rawInput: string) => {

  const grid = rawInput.split("\n").map((line) => line.split(""));

  const start = [-1, -1];
  const end = [-1, -1];

  const graph: Map<string, [number, number][]> = new Map();

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {

      if (grid[row][col] === "S") {
        start[0] = row;
        start[1] = col;
      }

      if (grid[row][col] === "E") {
        end[0] = row;
        end[1] = col;
      }

      // Each neighbor with at most 1 increased elevation is a valid neighbor
      const neighbors = ([
        [row - 1, col],
        [row + 1, col],
        [row, col - 1],
        [row, col + 1],
      ] as [number, number][]).filter(([r, c]) => {
        if (r < 0 || r >= grid.length) return false;
        if (c < 0 || c >= grid[r].length) return false;
        return getElevation(grid[r][c]) <= getElevation(grid[row][col]) + 1;
      });

      graph.set(`${row},${col}`, neighbors);

    };
  };

  return { start, end, graph, grid };

};

const part1 = (rawInput: string) => {
  const { start, end, graph } = parseInput(rawInput);

  const pred: Map<string, string> = new Map();
  const dist: Map<string, number> = new Map();

  const queue: [string, number][] = [[`${start[0]},${start[1]}`, 0]];

  while (queue.length > 0) {
    const [node, distance] = queue.shift()!;
    if (dist.has(node)) continue;
    dist.set(node, distance);
    for (const neighbor of graph.get(node)!) {
      if (!dist.has(`${neighbor[0]},${neighbor[1]}`)) {
        pred.set(`${neighbor[0]},${neighbor[1]}`, node);
        queue.push([`${neighbor[0]},${neighbor[1]}`, distance + 1]);
      }
    }
  }

  let node = `${end[0]},${end[1]}`;
  let path = [node];
  while (pred.has(node)) {
    node = pred.get(node)!;
    path.push(node);
  }


  return path.length - 1;
};

const part2 = (rawInput: string) => {
  const { end, graph, grid } = parseInput(rawInput);

  let minLength = Infinity;

  // find every point in the graph that is at elevation a
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {

      if (getElevation(grid[row][col]) > 0) continue;

      const start = [row, col];
      const pred: Map<string, string> = new Map();
      const dist: Map<string, number> = new Map();

      const queue: [string, number][] = [[`${start[0]},${start[1]}`, 0]];

      while (queue.length > 0) {
        const [node, distance] = queue.shift()!;
        if (dist.has(node)) continue;
        dist.set(node, distance);
        for (const neighbor of graph.get(node)!) {
          if (!dist.has(`${neighbor[0]},${neighbor[1]}`)) {
            pred.set(`${neighbor[0]},${neighbor[1]}`, node);
            queue.push([`${neighbor[0]},${neighbor[1]}`, distance + 1]);
          }
        }
      }

      let node = `${end[0]},${end[1]}`;
      let path = [node];
      while (pred.has(node)) {
        node = pred.get(node)!;
        path.push(node);
      }

      if (path.length - 1 === 0) continue;

      minLength = Math.min(minLength, path.length - 1);

    }
  }


  return minLength;
};

run({
  part1: {
    tests: [
      {
        input: `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`,
        expected: 31,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`,
        expected: 29,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
