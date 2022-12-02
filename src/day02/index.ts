import run from "aocrunner";

const LOSE = 1;
const DRAW = 2;
const WIN = 3;

const ROCK = 1;
const PAPER = 2;
const SCISSORS = 3;

const parseInput = (rawInput: string) => {
  return rawInput.split("\n").map((line) => {
    const [them, you] = line.split(" ");

    const lookup = {
      "A": 1,
      "X": 1,
      "B": 2,
      "Y": 2,
      "C": 3,
      "Z": 3,
    } as Record<string, number>;

    return {
      you: lookup[you],
      them: lookup[them],
    };

  });
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let score = 0;
  for (const { you, them } of input) {
    score += you;

    if (you === them) {
      score += 3;
    }

    // you pick rock, they pick scissors
    if (you === 1 && them === 3) {
      score += 6;
    }

    // you pick scissors, they pick paper
    if (you === 3 && them === 2) {
      score += 6;
    }

    // you pick paper, they pick rock
    if (you === 2 && them === 1) {
      score += 6;
    }

  };

  return score;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let score = 0;
  for (const { you: direction, them } of input) {

    let you: number = 0;
    if (direction === DRAW) {
      you = them;
    };

    // If we need to lose
    if (direction === LOSE) {

      if (them === ROCK) {
        you = SCISSORS;
      } else if (them === PAPER) {
        you = ROCK;
      } else {
        you = PAPER;
      }

    }

    // IF we need to win
    if (direction === WIN) {
      if (them === ROCK) {
        you = PAPER;
      } else if (them === PAPER) {
        you = SCISSORS;
      } else {
        you = ROCK;
      }
    };

    score += you;

    if (you === them) {
      score += 3;
    }

    // you pick rock, they pick scissors
    if (you === 1 && them === 3) {
      score += 6;
    }

    // you pick scissors, they pick paper
    if (you === 3 && them === 2) {
      score += 6;
    }

    // you pick paper, they pick rock
    if (you === 2 && them === 1) {
      score += 6;
    }

  };

  return score;
};

run({
  part1: {
    tests: [
      {
        input: `A Y
B X
C Z`,
        expected: 15,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `A Y
B X
C Z`,
        expected: 12,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
