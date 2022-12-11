import run from "aocrunner";

type Monkey = {
  i: number;
  items: number[];
  operation: (old: number) => number;
  divisible: number;
  if_true: number;
  if_false: number;
}

const parseInput = (rawInput: string) => {

  const monkeyRaws = rawInput.split("\n\n");
  const monkeys: Monkey[] = [];

  for (const monkey of monkeyRaws) {
    const lines = monkey.split("\n");

    const i = parseInt(lines[0].split(" ")[1].slice(0, -1));
    const items = lines[1].split(":")[1].split(", ").map((item) => parseInt(item));
    const operation = (old: number) => eval(`let old = ${old}; ${lines[2].split("=")[1]}`) as number;
    const divisible = parseInt(lines[3].split("divisible by ")[1]);

    const if_true = parseInt(lines[4].split("throw to monkey ")[1]);
    const if_false = parseInt(lines[5].split("throw to monkey ")[1]);

    monkeys.push({
      i,
      items,
      operation,
      divisible,
      if_true,
      if_false,
    });

  };

  return { monkeys };
};

const part1 = (rawInput: string) => {
  const { monkeys } = parseInput(rawInput);

  const times = monkeys.map(() => 0);

  for (let i = 0; i < 20; i++) {
    for (const monkey of monkeys) {

      times[monkey.i] += monkey.items.length;

      while (monkey.items.length > 0) {
        let item = monkey.items.shift()!;

        item = monkey.operation(item);
        item = Math.floor(item / 3);

        if (item % monkey.divisible === 0) {
          monkeys[monkey.if_true].items.push(item);
        } else {
          monkeys[monkey.if_false].items.push(item);
        }
      }
    }
  }

  const active = times.sort((a, b) => b - a).slice(0, 2);

  return active[0] * active[1];
};

const part2 = (rawInput: string) => {
  const { monkeys } = parseInput(rawInput);

  const times = monkeys.map(() => 0);
  const mod = monkeys.reduce((a, b) => a * b.divisible, 1);

  for (let i = 0; i < 10000; i++) {
    for (const monkey of monkeys) {

      times[monkey.i] += monkey.items.length;

      while (monkey.items.length > 0) {
        let item = monkey.items.shift()!;

        item = monkey.operation(item);
        item %= mod;

        if (item % monkey.divisible === 0) {
          monkeys[monkey.if_true].items.push(item);
        } else {
          monkeys[monkey.if_false].items.push(item);
        }
      }
    }
  }

  const active = times.sort((a, b) => b - a).slice(0, 2);
  return active[0] * active[1];
};

run({
  part1: {
    tests: [
      {
        input: `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`,
        expected: 10605,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [{
      input: `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`,
      expected: 2713310158,
    }
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
