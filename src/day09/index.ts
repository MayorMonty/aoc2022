import run from "aocrunner";

const parseInput = (rawInput: string, n: number) => {
  const instructions = rawInput.split("\n").map(line => {
    const [command, value] = line.split(" ");
    return { command: command as "L" | "R" | "U" | "D", value: Number(value) };
  });


  const rope = new Array(n).fill(0).map(() => ({ x: 0, y: 0 }));

  function sectionValid(i: number, j: number) {
    const a = rope[i];
    const b = rope[j];

    const diffX = a.x - b.x;
    const diffY = a.y - b.y;

    return Math.abs(diffX) <= 1 && Math.abs(diffY) <= 1;
  };

  function moveHead(dx: number, dy: number) {
    rope[0] = { x: rope[0].x + dx, y: rope[0].y + dy };

    // Make the rest of the rope follow the rope[0]
    for (let i = 1; i < rope.length; i++) {

      // If the section is not valid, move it to the previous section
      if (!sectionValid(i - 1, i)) {

        if (rope[i].y == rope[i - 1].y) {
          if (rope[i - 1].x > rope[i].x) {
            rope[i].x++;
          } else {
            rope[i].x--;
          }
        } else if (rope[i].x == rope[i - 1].x) {
          if (rope[i - 1].y > rope[i].y) {
            rope[i].y++;
          } else {
            rope[i].y--;
          }
        } else {
          if (rope[i - 1].x > rope[i].x) {
            rope[i].x++;
          } else {
            rope[i].x--;
          }
          if (rope[i - 1].y > rope[i].y) {
            rope[i].y++;
          } else {
            rope[i].y--;
          }
        }

      }
    };

    return rope[rope.length - 1];
  };

  return { instructions, moveHead };

};

const part1 = (rawInput: string) => {
  const { instructions, moveHead } = parseInput(rawInput, 2);

  const tailPositions = new Set<string>();

  for (const { command, value } of instructions) {
    if (instructions.length < 20) console.log(`== ${command} ${value} ==`)
    switch (command) {
      case "U":
        for (let i = 0; i < value; i++) {
          const tail = moveHead(0, 1);
          tailPositions.add(`${tail.x},${tail.y}`);
        }
        break;
      case "D":
        for (let i = 0; i < value; i++) {
          const tail = moveHead(0, -1);
          tailPositions.add(`${tail.x},${tail.y}`);
        }
        break;
      case "L":
        for (let i = 0; i < value; i++) {
          const tail = moveHead(-1, 0);
          tailPositions.add(`${tail.x},${tail.y}`);
        }
        break;
      case "R":
        for (let i = 0; i < value; i++) {
          const tail = moveHead(1, 0);
          tailPositions.add(`${tail.x},${tail.y}`);
        }
        break;
    }
  };


  return tailPositions.size;
};

const part2 = (rawInput: string) => {

  const { instructions, moveHead } = parseInput(rawInput, 10);

  const tailPositions = new Set<string>();

  for (const { command, value } of instructions) {
    switch (command) {
      case "U":
        for (let i = 0; i < value; i++) {
          const tail = moveHead(0, 1);
          tailPositions.add(`${tail.x},${tail.y}`);
        }
        break;
      case "D":
        for (let i = 0; i < value; i++) {
          const tail = moveHead(0, -1);
          tailPositions.add(`${tail.x},${tail.y}`);
        }
        break;
      case "L":
        for (let i = 0; i < value; i++) {
          const tail = moveHead(-1, 0);
          tailPositions.add(`${tail.x},${tail.y}`);
        }
        break;
      case "R":
        for (let i = 0; i < value; i++) {
          const tail = moveHead(1, 0);
          tailPositions.add(`${tail.x},${tail.y}`);
        }
        break;
    }
  };

  return tailPositions.size;
};

run({
  part1: {
    tests: [
      {
        input: `R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2`,
        expected: 13,
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
