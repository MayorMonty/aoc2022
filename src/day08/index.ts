import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const grid = rawInput.split("\n").map((line) => line.split("").map(Number));

  const sightlines: { top: number[], left: number[], right: number[], bottom: number[] }[][] = [];

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {

      if (sightlines[row] === undefined) {
        sightlines[row] = [];
      };

      sightlines[row][col] = { top: [], left: [], right: [], bottom: [] };

      // go up
      for (let i = row - 1; i >= 0; i--) {
        sightlines[row][col].top.push(grid[i][col]);
      }

      // go down
      for (let i = row + 1; i < grid.length; i++) {
        sightlines[row][col].bottom.push(grid[i][col]);
      }

      // go left
      for (let i = col - 1; i >= 0; i--) {
        sightlines[row][col].left.push(grid[row][i]);
      }

      // go right
      for (let i = col + 1; i < grid[row].length; i++) {
        sightlines[row][col].right.push(grid[row][i]);
      }

    };
  };

  const rows = grid.length;
  const cols = grid[0].length;

  return { grid, sightlines, rows, cols };
};

const part1 = (rawInput: string) => {
  const { grid, sightlines, rows, cols } = parseInput(rawInput);

  let count = (2 * rows) + (2 * cols) - 4;
  for (let row = 1; row < grid.length - 1; row++) {
    for (let col = 1; col < grid[row].length - 1; col++) {
      const value = grid[row][col];
      const candidates = sightlines[row][col];

      const top = candidates.top.every(c => c < value);
      const bottom = candidates.bottom.every(c => c < value);
      const left = candidates.left.every(c => c < value);
      const right = candidates.right.every(c => c < value);

      if (top || bottom || left || right) count++;
    }
  }

  return count;
};

const part2 = (rawInput: string) => {
  const { grid, sightlines, rows, cols } = parseInput(rawInput);

  let max = 0;
  for (let row = 1; row < grid.length - 1; row++) {
    for (let col = 1; col < grid[row].length - 1; col++) {
      const value = grid[row][col];
      const candidates = sightlines[row][col];

      let top = candidates.top.findIndex(c => c >= value) + 1;
      if (top == 0) top = candidates.top.length;

      let bottom = candidates.bottom.findIndex(c => c >= value) + 1;
      if (bottom == 0) bottom = candidates.bottom.length;

      let left = candidates.left.findIndex(c => c >= value) + 1;
      if (left == 0) left = candidates.left.length;

      let right = candidates.right.findIndex(c => c >= value) + 1;
      if (right == 0) right = candidates.right.length;

      const score = top * bottom * left * right;
      if (score > max) {
        max = score;
      }
    }
  }

  return max;
};

run({
  part1: {
    tests: [
      {
        input: `30373
25512
65332
33549
35390`,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `30373   
25512
65332
33549
35390`,
        expected: 8,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
