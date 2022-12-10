import run from "aocrunner";

type State = { x: number, cycle: number };
type Instructions = ({
  command: "addx";
  value: number;
} | {
  command: "noop";
})

const parseInput = (rawInput: string) => {

  const instructions: Instructions[] = rawInput.split("\n").map(line => {
    if (line.startsWith("addx")) {
      return { command: "addx", value: Number(line.split(" ")[1]) };
    } else {
      return { "command": "noop" }
    }
  });

  function execute(x: State, command: Instructions): State {
    if (command.command == "addx") {
      return { x: x.x + command.value, cycle: x.cycle + 2 };
    } else {
      return { x: x.x, cycle: x.cycle + 1 };
    }
  };

  return { instructions, execute };
};

const part1 = (rawInput: string) => {
  const { instructions, execute } = parseInput(rawInput);

  let sum = 0;
  let state = { x: 1, cycle: 1 };
  const cycles = [20, 60, 100, 140, 180, 220];

  let index = 0;
  while (state.cycle <= 220) {
    const instruction = instructions[index++];

    if (!instruction) {
      break;
    }

    // If we have executed a noop and have reached a cycle of interest
    if (instruction.command === "noop" && cycles.includes(state.cycle)) {
      const str = (state.x * state.cycle);
      sum += str;
    };

    if (instruction.command === "addx" && cycles.includes(state.cycle)) {
      const str = (state.x * state.cycle);
      sum += str;
    };

    // If we will cross a cycle of interest in the next cycle
    if (instruction.command === "addx" && cycles.includes(state.cycle + 1)) {
      const str = (state.x * (state.cycle + 1));
      sum += str;
    };

    state = execute(state, instruction);


  };


  return sum;
};

const part2 = (rawInput: string) => {
  const { instructions, execute } = parseInput(rawInput);

  let state = { x: 1, cycle: 1 };

  const values = new Map<number, number>();
  while (instructions.length > 0) {
    const instruction = instructions.shift();

    if (!instruction) {
      break;
    }

    if (instruction.command === "noop") {
      values.set(state.cycle, state.x);
    };

    if (instruction.command === "addx") {
      values.set(state.cycle, state.x);
      values.set(state.cycle + 1, state.x);
    };

    state = execute(state, instruction);
  };

  let buffer = "";

  for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 40; x++) {

      const cycle = (y * 40) + x + 1;
      const value = values.get(cycle)!;

      if (Math.abs(x - value) <= 1) {
        buffer += "#";
      } else {
        buffer += ".";
      }

    };
    buffer += "\n";
  };

  return buffer;
};

run({
  part1: {
    tests: [
      {
        input: `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`,
        expected: 13140,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop`,
        expected: `##..##..##..##..##..##..##..##..##..##..
###...###...###...###...###...###...###.
####....####....####....####....####....
#####.....#####.....#####.....#####.....
######......######......######......####
#######.......#######.......#######.....`,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
