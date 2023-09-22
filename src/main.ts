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

export type InputData = {
  drawnNumbers: number[];
  boards: number[][][];
};

class BingoSquare {
  constructor(
    public row: number,
    public col: number,
    public number: number,
  ) {}
}
export class BingoBoard {
  numbers: { [key: number]: BingoSquare } = {};
  lines: BingoSquare[][] = [];

  constructor(rawBoard: number[][]) {
    rawBoard.forEach((row, rowIndex) =>
      row.forEach(
        (n, colIndex) =>
          (this.numbers[n] = new BingoSquare(rowIndex, colIndex, n)),
      ),
    );

    const squares = Object.values(this.numbers);
    for (let i = 0; i < 5; i++) {
      this.lines.push(squares.filter((square) => square.col == i));
      this.lines.push(squares.filter((square) => square.row == i));
    }
  }

  getLinesContainingNumber(x: number): BingoSquare[][] {
    const squareWithNumber = this.numbers[x];
    if (!squareWithNumber) {
      return [];
    } else {
      return this.lines.filter((line) => line.includes(squareWithNumber));
    }
  }
}

export class BingoGameManager {
  markedNumbers: number[] = [];
  boards: BingoBoard[] = [];

  constructor(boardsData: number[][][]) {
    boardsData.forEach((boardData) =>
      this.boards.push(new BingoBoard(boardData)),
    );
  }

  markNumber(x: number): void {
    this.markedNumbers.push(x);
  }

  isNumberMarked(x: number): boolean {
    return this.markedNumbers.includes(x);
  }

  isLineWinning(line: BingoSquare[]): boolean {
    return line.every((square) => this.isNumberMarked(square.number));
  }
  isBoardWinning(board: BingoBoard): boolean {
    return board.lines.some((line) => this.isLineWinning(line));
  }

  getLastWinner(drawnNumbers: number[]): {
    board: BingoBoard;
    lastMarkedNumber: number;
  } {
    drawnNumbers.forEach((number) => {
      this.markNumber(number);
    });

    while (this.markedNumbers.length > 0) {
      const lastMarkedNumber = this.markedNumbers.pop();
      for (const board of this.boards) {
        if (!this.isBoardWinning(board)) {
          this.markedNumbers.push(lastMarkedNumber);
          return { board, lastMarkedNumber };
        }
      }
    }
    return null;
  }

  getUnmarkedSum(board: BingoBoard): number {
    return Object.values(board.numbers)
      .filter((square) => !this.isNumberMarked(square.number))
      .reduce((result, current) => result + current.number, 0);
  }

  scoreBoard(board: BingoBoard, lastMarkedNumber: number): number {
    const unmarkedSum = this.getUnmarkedSum(board);
    return unmarkedSum * lastMarkedNumber;
  }
}
