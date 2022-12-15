import run from "aocrunner";

type Point = { x: number, y: number }
enum BeaconStatus {
  Unknown,
  Beacon,
  Sensor,
  NoBeacon,
};

type Reading = { sensor: Point, beacon: Point, distance: number, };

function manhattanDistance({ x, y }: Point, { x: x2, y: y2 }: Point) {
  return Math.abs(x - x2) + Math.abs(y - y2);
}

const parseInput = (rawInput: string) => {


  const beaconStatus = new Map<string, BeaconStatus>();
  const noBeaconsY = new Map<number, Point[]>();

  function getBeaconStatus({ x, y }: Point) {
    return beaconStatus.get(`${x},${y}`) || BeaconStatus.Unknown; // true if there could be a beacon
  }

  function setBeaconStatus({ x, y }: Point, value: BeaconStatus) {
    beaconStatus.set(`${x},${y}`, value);
  }

  const readings = rawInput.split("\n").map(
    line => {
      const [sensorText, beaconText] = line.split(": ");
      const [x, y] = sensorText.split(" at x=")[1].split(", y=").map(Number);
      const sensor = { x, y };
      const [x2, y2] = beaconText.split(" at x=")[1].split(", y=").map(Number);
      const beacon = { x: x2, y: y2 };

      const distance = manhattanDistance(sensor, beacon);

      setBeaconStatus(sensor, BeaconStatus.Sensor);
      setBeaconStatus(beacon, BeaconStatus.Beacon);

      return { sensor, beacon, distance, };
    }
  );


  return { readings, getBeaconStatus, setBeaconStatus, beaconStatus, noBeaconsY };

};

const part1 = (rawInput: string) => {
  const { readings, beaconStatus, noBeaconsY } = parseInput(rawInput);

  const y = readings.length < 20 ? 10 : 2000000;

  const minX = Math.min(...readings.map(r => r.sensor.x - r.distance));
  const maxX = Math.max(...readings.map(r => r.sensor.x + r.distance));

  function isNoBeacon({ x, y }: Point) {

    if (beaconStatus.get(`${x},${y}`) === BeaconStatus.Beacon) {
      return false;
    }

    for (const reading of readings) {
      const distance = manhattanDistance({ x, y }, reading.sensor);
      if (distance <= reading.distance) {
        return true;
      }
    }

    return false
  };


  let count = 0;
  for (let x = minX; x <= maxX; x++) {
    if (isNoBeacon({ x, y })) {
      count++;
    }
  };

  return count;
};

const part2 = (rawInput: string) => {
  const { readings } = parseInput(rawInput);

  const maxDimension = readings.length < 20 ? 20 : 4_000_000;

  for (let y = 0; y < maxDimension; y++) {
    const intervals = readings.map(({ sensor, distance }) => {

      // distance in y from the sensor
      const dy = Math.abs(y - sensor.y);

      // Reduce our distance in x by the distance in y
      const dx = Math.max(0, distance - dy);

      const min = sensor.x - dx;
      const max = sensor.x + dx;

      return { min, max };
    }).filter(({ min, max }) => min < max);

    // Repeatedly combine intervals if they overlap or are adjacent until there are no more overlaps
    let changed = true;
    while (changed) {
      changed = false;
      for (let i = 0; i < intervals.length; i++) {
        for (let j = i + 1; j < intervals.length; j++) {
          const a = intervals[i];
          const b = intervals[j];

          if (a.min <= b.max + 1 && b.min <= a.max + 1) {
            a.min = Math.min(a.min, b.min);
            a.max = Math.max(a.max, b.max);
            intervals.splice(j, 1);
            changed = true;
            break;
          }
        }
        if (changed) {
          break;
        }
      }
    }

    if (intervals.length < 2) continue;

    const [a] = intervals.sort((a, b) => a.min - b.min);
    const x = a.max + 1;
    return x * 4000000 + y;
  }

};

run({
  part1: {
    tests: [
      {
        input: `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`,
        expected: 26,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3`,
        expected: 56000011,
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
