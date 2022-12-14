import run from "aocrunner";

type Point = { x: number, y: number };
type StepResult = Point | "rest" | "void";

const parseInput = (rawInput: string) => {

  const lines = rawInput.split("\n").map(line => line.split(" -> ").map(s => {
    const [x, y] = s.split(",").map(Number);
    return { x, y }
  }));

  const source = { x: 500, y: 0 };

  let minX = Math.min(source.x, ...lines.map(line => Math.min(...line.map(p => p.x))));
  let minY = Math.min(source.y, ...lines.map(line => Math.min(...line.map(p => p.y))));
  let maxX = Math.max(source.x, ...lines.map(line => Math.max(...line.map(p => p.x))));
  let maxY = Math.max(source.y, ...lines.map(line => Math.max(...line.map(p => p.y))));

  const floor = maxY + 2;

  const grid = new Map<string, string>();

  function getGrid({ x, y }: Point) {

    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);

    return grid.get(`${x},${y}`) || ".";
  };

  function setGrid({ x, y }: Point, value: string) {

    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);

    grid.set(`${x},${y}`, value);
  }

  function printGrid() {
    for (let y = minY; y <= maxY; y++) {
      let line = "";
      for (let x = minX; x <= maxX; x++) {
        line += getGrid({ x, y });
      }
      console.log(line);
    }
  }

  function step({ x, y }: Point) {

    if (y == maxY) return "void";
    if (x < minX || x > maxX) return "void";

    const below = { x, y: y + 1 };
    const leftDiag = { x: x - 1, y: y + 1 };
    const rightDiag = { x: x + 1, y: y + 1 };

    if (leftDiag.x < minX || rightDiag.x > maxX) {
      return "void";
    }

    if (getGrid(below) === ".") {
      return below;
    }

    if (getGrid(leftDiag) === ".") {
      return leftDiag;
    }

    if (getGrid(rightDiag) === ".") {
      return rightDiag;
    }

    return "rest";

  };

  setGrid(source, "+");

  for (const points of lines) {
    for (let i = 1; i < points.length; i++) {

      const p1 = points[i - 1];
      const p2 = points[i];

      // mark every point from p1 to p2 with #
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;

      if (dx === 0) {

        const start = p1.y < p2.y ? p1 : p2;
        const end = p1.y < p2.y ? p2 : p1;

        for (let y = start.y; y <= end.y; y++) {
          setGrid({ x: start.x, y }, "#");
        }

      } else if (dy === 0) {

        const start = p1.x < p2.x ? p1 : p2;
        const end = p1.x < p2.x ? p2 : p1;

        for (let x = start.x; x <= end.x; x++) {
          setGrid({ x, y: start.y }, "#");
        }
      };
    };
  };

  return { grid, getGrid, setGrid, printGrid, source, step, minX, minY, maxX, maxY, floor }
};

const part1 = (rawInput: string) => {
  const { grid, getGrid, setGrid, printGrid, source, step } = parseInput(rawInput);


  function placeSand(): boolean {
    let sand: StepResult = source;
    while (sand !== "rest" && sand !== "void") {
      if (step(sand) === "rest") {
        setGrid(sand, "o");
        return true;
      }
      sand = step(sand);
    }

    return false;
  };

  let placed = 0;
  while (placeSand()) {
    placed++;
  };

  return placed;
};

const part2 = (rawInput: string) => {
  const { getGrid, setGrid, printGrid, source, floor } = parseInput(rawInput);


  function step({ x, y }: Point): Point | "rest" {

    const down = { x, y: y + 1 };
    const left = { x: x - 1, y: y + 1 };
    const right = { x: x + 1, y: y + 1 };

    if (down.y === floor) return "rest";

    if (getGrid(down) === ".") {
      return down;
    }

    if (getGrid(left) === ".") {
      return left;
    }

    if (getGrid(right) === ".") {
      return right;
    }

    return "rest";
  };

  function placeSand(): boolean {
    let sand: StepResult = source;

    if (step(sand) === "rest") return false;

    while (sand !== "rest") {
      if (step(sand) === "rest") {
        setGrid(sand, "o");
        return true;
      }
      sand = step(sand);
    }

    return false;
  };

  let placed = 0;
  while (placeSand()) {
    placed++;
  }

  return placed + 1;

};


run({
  part1: {
    tests: [
      {
        input: `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`,
        expected: 24,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`,
        expected: 93,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
