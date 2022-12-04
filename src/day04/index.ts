import run from "aocrunner";

function fullyContained(aMin: number, aMax: number, bMin: number, bMax: number) {
  return aMin >= bMin && aMax <= bMax;
}

function anyOverlap(aMin: number, aMax: number, bMin: number, bMax: number) {
  return aMin <= bMax && aMax >= bMin;
}


const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n").map((line) => line.split(",").map(a => a.split("-").map(Number)));
  return lines;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let count = 0;
  for (const [a, b] of input) {
    if (fullyContained(a[0], a[1], b[0], b[1]) || fullyContained(b[0], b[1], a[0], a[1])) {
      count++;
    }
  };

  return count;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let count = 0;
  for (const [a, b] of input) {
    if (anyOverlap(a[0], a[1], b[0], b[1]) || anyOverlap(b[0], b[1], a[0], a[1])) {
      count++;
    }
  };

  return count;
};

run({
  part1: {
    tests: [
      {
        input: `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8
`,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8
`,
        expected: 4,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
