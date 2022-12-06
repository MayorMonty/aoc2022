import run from "aocrunner";

const parseInput = (rawInput: string) => {

  let [cratesText, instructionText] = rawInput.split("\n\n");

  cratesText = cratesText.replaceAll("    ", " [.]");

  console.log(cratesText);

  // Parse crate stacks, which are of the form
  const rows = cratesText.split("\n").slice(0, -1);
  const numCols = (rows[rows.length - 1].length + 1) / 4;
  const crates: string[][] = [...new Array(numCols)].map(() => []);


  for (const row of rows) {
    for (let i = 0; i < numCols; i++) {
      const box = row.slice(i * 4 + 1, i * 4 + 2);
      if (box != " " && box != "" && box != ".") {
        crates[i] = [box, ...crates[i]];
      }
    }
  };

  if (crates.length === 3) console.log(crates);

  // Parse instructions (of the form move 3 from 1 to 2)
  const instructions: { count: number, from: number, to: number }[] = [];
  for (const line of instructionText.split("\n")) {
    const [_, count, from, to] = line.match(
      /move (\d+) from (\d+) to (\d+)/
    )!.map(Number);

    instructions.push({ count, from: from - 1, to: to - 1 });
  };

  return { crates, instructions };

};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  if (input.crates.length === 3) console.log(input.crates);

  for (const { count, from, to } of input.instructions) {
    if (input.crates.length === 3) console.log(`move ${count} from ${from} to ${to}`);
    for (let i = 0; i < count; i++) {
      const crate = input.crates[from].pop()!;
      input.crates[to].push(crate);
    };
    if (input.crates.length === 3) console.log(input.crates);
  };

  if (input.crates.length === 3) console.log(input.crates);

  const result = input.crates.map(stack => stack[stack.length - 1]).join("");

  return result;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  for (const { count, from, to } of input.instructions) {
    const last = input.crates[from].slice(-count);
    for (let i = 0; i < count; i++) {
      input.crates[from].pop();
    }
    input.crates[to] = [...input.crates[to], ...last];
  };

  console.log(input.crates);

  const result = input.crates.map(stack => stack[stack.length - 1]).join("");

  return result;
};

run({
  part1: {
    tests: [
      {
        input: `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
`,
        expected: "CMZ",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
