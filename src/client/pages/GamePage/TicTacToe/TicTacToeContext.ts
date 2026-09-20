import { Action, StoreData, createGameStateStore } from '@shared/stores/tictactoeStore';
import { CreateComponentContext } from 'pureboard/client';

export const [TicTacToeProvider, useTicTacToe] = CreateComponentContext<'tictactoe', StoreData, Action>(
  'tictactoe',
  () => createGameStateStore()
);
