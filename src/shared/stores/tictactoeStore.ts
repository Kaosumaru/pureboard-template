import { Context, StoreContainer, UserPermissions } from 'pureboard/shared';
import { createComponentStore } from 'pureboard/shared';

export enum FieldType {
  Empty,
  X,
  O,
}

export interface NewGameAction {
  type: 'newGame';
}

export interface MoveAction {
  type: 'move';
  row: number;
  column: number;
}

export interface SurrenderAction {
  type: 'surrender';
  player: number;
}

export type Action = MoveAction | SurrenderAction | NewGameAction;

export interface StoreData {
  currentPlayer: number;
  victoriousPlayer: number;
  isDraw: boolean;
  board: FieldType[][];
  lastMoveRow: number;
  lastMoveColumn: number;
}

const BOARD_SIZE = 3;

function create2DArray<T>(rows: number, cols: number, value: T): T[][] {
  return Array.from({ length: rows }, () => Array<T>(cols).fill(value));
}

function isGameOver(data: StoreData): boolean {
  return data.victoriousPlayer !== -1 || data.isDraw;
}

function isPositionInBounds(board: FieldType[][], row: number, column: number): boolean {
  return row >= 0 && row < board.length && column >= 0 && column < board[0].length;
}

function otherPlayer(player: number): number {
  return player === 0 ? 1 : 0;
}

function isMoveVictorious(board: FieldType[][], row: number, column: number): boolean {
  const size = board.length;
  const currentField = board[row][column];

  const isRowComplete = board[row].every(field => field === currentField);
  const isColumnComplete = board.every(rowFields => rowFields[column] === currentField);
  const isOnMainDiagonal = row === column;
  const isOnAntiDiagonal = row + column === size - 1;
  const isMainDiagonalComplete = isOnMainDiagonal && board.every((rowFields, i) => rowFields[i] === currentField);
  const isAntiDiagonalComplete =
    isOnAntiDiagonal && board.every((rowFields, i) => rowFields[size - 1 - i] === currentField);

  return isRowComplete || isColumnComplete || isMainDiagonalComplete || isAntiDiagonalComplete;
}

function isBoardFull(board: FieldType[][]): boolean {
  return board.every(rowFields => rowFields.every(field => field !== FieldType.Empty));
}

function onMove(userPermissions: UserPermissions, data: StoreData, row: number, column: number): StoreData {
  const { board, currentPlayer, victoriousPlayer, isDraw } = data;
  if (isGameOver(data)) throw new Error('Game is already over');
  if (!isPositionInBounds(board, row, column)) throw new Error('Invalid position');
  if (board[row][column] !== FieldType.Empty) throw new Error('Field is already taken');
  if (!userPermissions.canMoveAsPlayer(currentPlayer)) throw new Error('Not your turn');

  const tempBoard = board.map(rowFields => [...rowFields]);
  tempBoard[row][column] = currentPlayer === 0 ? FieldType.X : FieldType.O;

  const newData: StoreData = {
    board: tempBoard,
    currentPlayer: otherPlayer(currentPlayer),
    victoriousPlayer,
    isDraw,
    lastMoveRow: row,
    lastMoveColumn: column,
  };

  if (isMoveVictorious(tempBoard, row, column)) newData.victoriousPlayer = currentPlayer;
  else if (isBoardFull(tempBoard)) newData.isDraw = true;

  return newData;
}

function onSurrender(userPermissions: UserPermissions, data: StoreData, player: number): StoreData {
  if (!userPermissions.canMoveAsPlayer(player)) throw new Error('Not your player');
  return {
    ...data,
    victoriousPlayer: otherPlayer(player),
  };
}

function onNewGame(userPermissions: UserPermissions, store: StoreData): StoreData {
  const gameOver = isGameOver(store);
  if (!gameOver && !userPermissions.isServerOriginating()) throw new Error('Game not over, cannot start a new game');
  return {
    ...store,
    board: create2DArray<FieldType>(BOARD_SIZE, BOARD_SIZE, FieldType.Empty),
    currentPlayer: 0,
    lastMoveRow: -1,
    lastMoveColumn: -1,
    victoriousPlayer: -1,
    isDraw: false,
  };
}

export function createGameStateStore(): StoreContainer<StoreData, Action> {
  return createComponentStore(
    {
      board: [],
      currentPlayer: 0,
      lastMoveRow: -1,
      lastMoveColumn: -1,
      victoriousPlayer: -1,
      isDraw: false,
    },
    makeAction
  );
}

function makeAction(ctx: Context, store: StoreData, action: Action): StoreData | Partial<StoreData> {
  switch (action.type) {
    case 'move':
      return onMove(ctx.userPermissions, store, action.row, action.column);
    case 'surrender':
      return onSurrender(ctx.userPermissions, store, action.player);
    case 'newGame': {
      return onNewGame(ctx.userPermissions, store);
    }
  }
}
