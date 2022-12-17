import run from "aocrunner";

type Valve = {
  name: string;
  flow: number;
  leadsTo: string[];
}


const parseInput = (rawInput: string) => {

  const lines = rawInput.split("\n");

  const valves = new Map<string, Valve>();
  const nonZeroFlow: (Valve & { hash: number })[] = [];

  let hash = 1;
  for (const line of lines) {
    let [name, rest] = line.split(" has flow rate=");
    name = name.replace("Valve ", "");
    const flow = Number(rest.split(";")[0]);
    const leadsTo = rest.split(/tunnels? leads? to valves? /g)[1].split(", ");
    valves.set(name, { name, flow, leadsTo });

    if (flow > 0) {
      nonZeroFlow.push({ name, flow, leadsTo, hash });
      hash *= 2;
    }
  }

  return { valves, nonZeroFlow };

};

// Gets the cost to move from A to B
function getCost(a: string, b: string, valves: Map<string, Valve>) {

  let queue = [a];
  let visited = new Set<string>();
  let pred = new Map<string, string>();

  while (queue.length > 0) {

    let current = queue.shift()!;

    if (visited.has(current)) continue;
    visited.add(current);

    if (current == b) break;

    for (const next of valves.get(current)!.leadsTo) {
      if (visited.has(next)) continue;
      queue.push(next);
      pred.set(next, current);
    }
  }

  if (!visited.has(b)) return Infinity;

  let length = 0;
  let current = b;
  while (current != a) {
    length++;
    let result = pred.get(current);
    if (!result) return Infinity;
    current = result;
  }

  return length;
};

type Node = {
  location: string;
  time: number;
  opened: number; // bitmask of index
  released: number;
};


const part1 = (rawInput: string) => {
  const { valves, nonZeroFlow } = parseInput(rawInput);

  // Precomputed cost to move from A to B
  const cost = new Map<string, Map<string, number>>();
  for (const [name] of valves) {
    cost.set(name, new Map<string, number>());
    for (const [name2] of valves) {
      if (name === name2) continue;
      cost.get(name)!.set(name2, getCost(name, name2, valves));
    }
  }

  const start: Node = { location: "AA", time: 30, opened: 0, released: 0 };
  const queue = [start];

  let best: Node | null = null;

  while (queue.length > 0) {
    const { location, time, opened, released } = queue.shift()!;

    if (!best || released > best.released) {
      best = { location, time, opened, released };
      console.log(best); ` `
    };

    for (const valve of nonZeroFlow) {

      // If we have already opened this valve, skip
      if (opened & valve.hash) continue;

      const distance = cost.get(location)!.get(valve.name)!;
      const nextTime = time - distance - 1;

      if (nextTime > 0) {
        queue.push({
          location: valve.name,
          time: nextTime,
          opened: opened | valve.hash,
          released: released + (valve.flow * nextTime),
        });
      }
    };
  };

  return best?.released;
};


const part2 = (rawInput: string) => {
  const { valves, nonZeroFlow } = parseInput(rawInput);

  // Precomputed cost to move from A to B
  const cost = new Map<string, Map<string, number>>();
  for (const [name] of valves) {
    cost.set(name, new Map<string, number>());
    for (const [name2] of valves) {
      if (name === name2) continue;
      cost.get(name)!.set(name2, getCost(name, name2, valves));
    }
  }

  const start: Node = { location: "AA", time: 26, opened: 0, released: 0 };
  const queue = [start];

  let scores: [opened: number, released: number][] = [];

  while (queue.length > 0) {
    const { location, time, opened, released } = queue.shift()!;
    scores.push([opened, released]);
    for (const valve of nonZeroFlow) {

      // If we have already opened this valve, skip
      if (opened & valve.hash) continue;

      const distance = cost.get(location)!.get(valve.name)!;
      const nextTime = time - distance - 1;

      if (nextTime > 0) {
        queue.push({
          location: valve.name,
          time: nextTime,
          opened: opened | valve.hash,
          released: released + (valve.flow * nextTime),
        });
      }
    };
  };

  scores = scores.sort((a, b) => b[1] - a[1]);

  let max = 0
  for (let j = 1; j < scores.length; j++) {
    for (let i = 0; i < j; i++) {
      if (scores[i][1] * 2 < max) break
      const hashA = scores[i][0]
      const hashB = scores[j][0]
      if (hashA + hashB !== (hashA | hashB)) continue
      const total = scores[i][1] + scores[j][1]
      if (total > max) max = total
    }
  }
  return max
};

run({
  part1: {
    tests: [
      {
        input: `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`,
        expected: 1651,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II`,
        expected: 1707,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
