import * as fs from 'fs';
import * as path from 'path';

export function readInput(filename: string): string {
  let inputString;
  try {
    inputString = fs.readFileSync(
      path.resolve(__dirname, `./inputData/${filename}`),
      'utf-8',
    );
  } catch (err) {
    console.error(err);
  }
  return inputString;
}

export function parseInput(inputString: string): InputData {
  const [drawnInput, ...boardsInput] = inputString.split('\n\n');
  const drawnNumbers = drawnInput.split(',').map((x) => parseInt(x, 10));
  const boards: number[][][] = boardsInput.map((board) =>
    board.split(/\n/).map((line) =>
      line
        .trim()
        .split(/\s+/g)
        .map((x) => parseInt(x, 10)),
    ),
  );
  return { drawnNumbers, boards };
}

type InputData = {
  drawnNumbers: number[];
  boards: number[][][];
};

// type Board = {
//   squares: Square[];
// };

// type Square = {
//   row: number;
//   col: number;
// };
