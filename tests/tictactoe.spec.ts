import { Action, FieldType, StoreData, createGameStateStore } from '@shared/stores/tictactoeStore.js';
import { UTHelper } from 'pureboard/shared';
import { expect, test } from 'vitest';

class TestHelper extends UTHelper<StoreData, Action> {
  constructor() {
    super(createGameStateStore());
  }

  newGame(startingPlayer = 0) {
    this.setRandomValue(startingPlayer);

    this.action({
      type: 'newGame',
    });
  }

  makeMove(row: number, column: number) {
    this.action({
      type: 'move',
      row,
      column,
    });
  }
}

test('should be able to create a new game', () => {
  const h = new TestHelper();

  h.newGame();
  expect(h.state().currentPlayer).toEqual(0);
  expect(h.state().board).toEqual([
    [FieldType.Empty, FieldType.Empty, FieldType.Empty],
    [FieldType.Empty, FieldType.Empty, FieldType.Empty],
    [FieldType.Empty, FieldType.Empty, FieldType.Empty],
  ]);
});

test('should be able to make a move', () => {
  const h = new TestHelper();

  h.newGame();
  h.makeMove(0, 0);
  expect(h.state().board[0]?.[0]).toEqual(FieldType.X);
});

test('should switch players after a move', () => {
  const h = new TestHelper();

  h.newGame();
  expect(h.state().currentPlayer).toEqual(0);
  h.makeMove(0, 0);
  expect(h.state().currentPlayer).toEqual(1);
});

test('should not allow a move on an occupied cell', () => {
  const h = new TestHelper();

  h.newGame();
  h.makeMove(0, 0);
  expect(() => h.makeMove(0, 0)).toThrow();
});

test('should detect a win', () => {
  const h = new TestHelper();

  h.newGame();
  h.makeMove(0, 0); // X
  h.makeMove(1, 0); // O
  h.makeMove(0, 1); // X
  h.makeMove(1, 1); // O
  h.makeMove(0, 2); // X wins
  expect(h.state().victoriousPlayer).toEqual(0);
});

test('should detect a draw', () => {
  const h = new TestHelper();

  h.newGame();
  h.makeMove(0, 0); // X
  h.makeMove(0, 1); // O
  h.makeMove(0, 2); // X
  h.makeMove(1, 1); // O
  h.makeMove(1, 0); // X
  h.makeMove(1, 2); // O
  h.makeMove(2, 1); // X
  h.makeMove(2, 0); // O
  h.makeMove(2, 2); // X
  expect(h.state().victoriousPlayer).toEqual(-1);
  expect(h.state().isDraw).toEqual(true);
});
