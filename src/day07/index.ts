import run from "aocrunner";

type Entry = {
  name: string,
  type: "file"
  size: number
} | {
  name: string,
  type: "directory"
};

type Command = {
  type: "cd",
  cwd: string[]
} | {
  type: "ls",
  cwd: string[],
  entries: Entry[]
};

const parseInput = (rawInput: string) => {

  const lines = rawInput.split("\n");

  const commands: Command[] = [];
  let cwd: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // If line starts with $, it's a command 
    if (line.startsWith("$")) {
      const command = line.split(" ")[1];

      if (command === "cd") {
        const directory = line.split(" ")[2];
        if (directory === "..") {
          cwd.pop();
          commands.push({
            type: "cd",
            cwd: [...cwd]
          });
        } else if (directory === "/") {
          cwd = [];
          commands.push({
            type: "cd",
            cwd: [...cwd],
          });
        } else {
          cwd.push(directory);
          commands.push({
            type: "cd",
            cwd: [...cwd],
          });
        };
      } else if (command === "ls") {
        const entries: Entry[] = [];

        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j].startsWith("$")) {
            break;
          }

          const [first, second] = lines[j].split(" ");
          if (first === "dir") {
            entries.push({
              name: second,
              type: "directory",
            });
          } else {
            entries.push({
              name: second,
              type: "file",
              size: parseInt(first),
            });
          }
        };
        commands.push({
          type: "ls",
          cwd,
          entries,
        });
      };
    }
  };

  const dirs = new Set<string>([...commands.filter(command => command.type === "cd").map(command => command.cwd.join("/") || "/")]);

  let fs: any = {};
  for (const command of commands) {
    if (command.type === "cd") {
      cwd = command.cwd;
    } else if (command.type === "ls") {
      // create objects from the cwd
      let current = fs;
      for (const dir of cwd) {
        if (!current[dir]) {
          current[dir] = {};
        }
        current = current[dir];
      }

      for (const entry of command.entries) {
        if (entry.type === "directory") {
          current[entry.name] = {};
        } else {
          current[entry.name] = entry.size;
        }
      }

    }
  };

  return { commands, fs, dirs }
};

function size(fs: any) {
  let total = 0;
  for (const key in fs) {
    if (typeof fs[key] === "number") {
      total += fs[key];
    } else {
      total += size(fs[key]);
    }
  }
  return total;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let sum = 0;
  for (const dir of input.dirs) {
    let current = input.fs;
    for (const part of dir.split("/")) {
      if (part) {
        current = current[part];
      }
    }
    let s = size(current);
    if (s < 100000) {
      sum += s
    }
  };

  return sum;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const total = size(input.fs);
  const max = 70000000;
  const unused = max - total;
  const needed = 30000000 - unused;

  const sizes = [...input.dirs].map(dir => {
    let current = input.fs;
    for (const part of dir.split("/")) {
      if (part) {
        current = current[part];
      }
    }
    return [dir, size(current)] as [string, number];
  }).filter(([dir, size]) => size >= needed).sort((a, b) => a[1] - b[1]);

  return sizes[0][1];
};

run({
  part1: {
    tests: [
      {
        input: `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`,
        expected: 95437,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`,
        expected: 24933642,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
