import run from "aocrunner";


type Packet = (Packet[] | number)[] | number;

function compare(left: Packet, right: Packet): boolean | null {

  if (typeof left === "number" && typeof right === "number") {
    if (left === right) return null;
    return left < right;
  };

  if (Array.isArray(left) && Array.isArray(right)) {

    for (let i = 0; i < left.length && i < right.length; i++) {
      const ret = compare(left[i], right[i]);

      if (ret !== null) return ret;
    }

    if (left.length === right.length) return null;
    return left.length < right.length;
  };

  if (Array.isArray(left) && typeof right === "number") {
    return compare(left, [right]);
  } else if (typeof left === "number" && Array.isArray(right)) {
    return compare([left], right);
  }

};

const parseInput = (rawInput: string) => {
  const pairs = rawInput.split("\n\n").map((pair) => pair.split("\n").map((line) => JSON.parse(line) as Packet[]));

  return { pairs };
};

const part1 = (rawInput: string) => {
  const { pairs } = parseInput(rawInput);

  let index = 1;
  let sum = 0;
  for (const [a, b] of pairs) {
    const result = compare(a, b);

    if (result) {
      sum += index;
    }

    index += 1;
  };

  return sum;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const dividerA = [[2]];
  const dividerB = [[6]];

  const packets: Packet[] = [
    dividerA,
    dividerB,
  ];

  for (const [a, b] of input.pairs) {
    packets.push(a);
    packets.push(b);
  }

  const sorted = packets.sort((a, b) => compare(a, b) ? -1 : 1);

  let index = 1;
  let multiple = 1;
  for (const packet of sorted) {

    if (JSON.stringify(packet) === JSON.stringify(dividerA)) {
      multiple *= index;
    }

    if (JSON.stringify(packet) === JSON.stringify(dividerB)) {
      multiple *= index;
    }

    index++;
  };

  return multiple;
};

run({
  part1: {
    tests: [
      {
        input: `[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]`,
        expected: 140,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
