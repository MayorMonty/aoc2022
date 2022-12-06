import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  for (let i = 3; i < input.length; i++) {

    const a = input[i - 3];
    const b = input[i - 2];
    const c = input[i - 1];
    const d = input[i];

    const set = new Set([a, b, c, d]);

    if (set.size === 4) {
      return i;
    }

  };

  return;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  for (let i = 14; i < input.length; i++) {

    const a = input[i - 14];
    const b = input[i - 13];
    const c = input[i - 12];
    const d = input[i - 11];
    const e = input[i - 10];
    const f = input[i - 9];
    const g = input[i - 8];
    const h = input[i - 7];
    const j = input[i - 6];
    const k = input[i - 5];
    const l = input[i - 4];
    const m = input[i - 3];
    const n = input[i - 2];
    const o = input[i - 1];
    const p = input[i];

    const set = new Set([a, b, c, d, e, f, g, h, j, k, l, m, n, o, p]);
    if (set.size === 15) {
      return i;
    }

  };

  return;
};

run({
  part1: {
    tests: [
      {
        input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`,
        expected: 7,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`,
        expected: 19,
      },
      {
        input: `bvwbjplbgvbhsrlpgdmjqwftvncz`,
        expected: 23,
      },
      {
        input: `nppdvjthqldpwncqszvftbrmjlhg`,
        expected: 23,
      },
      {
        input: `nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`,
        expected: 29,
      },
      {
        input: `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`,
        expected: 26,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
