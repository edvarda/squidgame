import {
  InputData,
  readInput,
  parseInput,
  BingoBoard,
  BingoGameManager,
} from '../src/main.js';

describe('squid game tests', () => {
  let testInput;

  beforeAll(() => {
    testInput = readInput('test.in');
  });

  describe('input and parsing', () => {
    it('has access to the correct test input', () => {
      expect(typeof testInput).toBe('string');
    });

    it('parses the input correctly', () => {
      const inputData = parseInput(testInput);
      expect(inputData.drawnNumbers.length).toBeGreaterThan(0);
      expect(inputData.boards.length).toBeGreaterThan(0);
      expect(inputData.boards[0].length).toEqual(5);
      expect(inputData.boards[0][0].length).toEqual(5);
    });

    it('should parse the first board correctly into its data structure', () => {
      const inputData = parseInput(testInput);
      const firstBoard = new BingoBoard(inputData.boards[0]);
      const gameManager = new BingoGameManager(inputData.boards);
      expect(Object.values(firstBoard.numbers).length).toEqual(25);
      expect(Object.values(firstBoard.lines).length).toEqual(10);
      expect(Object.values(gameManager.boards).length).toBeGreaterThan(2);
    });
  });

  describe('game functionality', () => {
    let inputData: InputData;
    let gameManager: BingoGameManager;
    beforeAll(() => {
      inputData = parseInput(testInput);
    });
    beforeEach(() => {
      gameManager = new BingoGameManager(inputData.boards);
    });
    it('should be able to check and mark a number in the map of numbers', () => {
      expect(gameManager.isNumberMarked(1)).toBeFalsy();
      gameManager.markNumber(1);
      expect(gameManager.isNumberMarked(1)).toBeTruthy();
    });

    it('should be able to return lines that contain a certain number from a board', () => {
      const firstBoard = gameManager.boards[0];
      expect(firstBoard.getLinesContainingNumber(0).length).toEqual(2);
      expect(firstBoard.getLinesContainingNumber(30).length).toEqual(0);
    });

    it('should be able to tell whether a board is in a winning state', () => {
      // First line 22 13 17 11 0
      // First column 22 8 21 6 1
      const firstBoard = gameManager.boards[0];
      expect(gameManager.isBoardWinning(firstBoard)).toBeFalsy();
      gameManager.markNumber(22);
      gameManager.markNumber(13);
      gameManager.markNumber(17);
      gameManager.markNumber(11);
      gameManager.markNumber(11);
      expect(gameManager.isBoardWinning(firstBoard)).toBeFalsy();
      gameManager.markNumber(0);
      expect(gameManager.isBoardWinning(firstBoard)).toBeTruthy();
    });

    it('should be able give the correct last winning board', () => {
      const squareWithNumber3 = gameManager.getLastWinner(
        inputData.drawnNumbers,
      ).board.numbers[3]; // Should be second board: top left square
      expect(squareWithNumber3.col).toBe(0);
      expect(squareWithNumber3.row).toBe(0);
    });

    it('should be able to calculate the sum of the unmarked numbers correctly', () => {
      const { board, lastMarkedNumber } = gameManager.getLastWinner(
        inputData.drawnNumbers,
      );
      expect(gameManager.getUnmarkedSum(board)).toEqual(148);
      expect(lastMarkedNumber).toEqual(13);
    });

    it('should be able to calculate the score of a winning board, given the last number', () => {
      const { board, lastMarkedNumber } = gameManager.getLastWinner(
        inputData.drawnNumbers,
      );
      expect(lastMarkedNumber).toEqual(13);
      expect(gameManager.scoreBoard(board, lastMarkedNumber)).toEqual(1924);
    });
  });

  describe('the real deal', () => {
    it('gives me the answer', () => {
      const realInput = readInput('real.in');
      const { drawnNumbers, boards } = parseInput(realInput);
      const gameManager = new BingoGameManager(boards);
      const { board, lastMarkedNumber } =
        gameManager.getLastWinner(drawnNumbers);
      const answer = gameManager.scoreBoard(board, lastMarkedNumber);

      console.log(`Answer: ${answer}`);
      expect(answer).toBeTruthy();
    });
  });
});
