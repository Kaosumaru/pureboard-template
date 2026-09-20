import { Action, StoreData, createGameStateStore } from '@shared/stores/tictactoeStore.js';
import { CreateComponentContext } from 'pureboard/client';

export const [TicTacToeProvider, useTicTacToe] = CreateComponentContext<'tictactoe', StoreData, Action>(
  'tictactoe',
  () => createGameStateStore()
);
