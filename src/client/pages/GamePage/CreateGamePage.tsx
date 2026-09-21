import './GamePage.css';
import { JSX } from 'react';
import { ConnectionHelpers } from './ConnectionHelpers.js';
import { useLoginContext } from '../LoginPage/LoginContext.js';
import { CreateGameRoomClient, GameRoom } from 'pureboard/client';
import { Main } from '@client/utils/Main.js';
import TicTacToe from './TicTacToe/TicTacToe.js';

export function CreateGamePage(): JSX.Element {
  const context = useLoginContext();

  return (
    <CreateGameRoomClient
      token={context.userId}
      gameId="tictactoe"
      options={{ players: 2 }}
      onCreated={(id, password) => {
        const url = password ? `/joinGame/${id}/${password}` : `/game/${id}`;
        window.history.replaceState(null, 'Game', url);
        return Promise.resolve();
      }}
      onFailed={() => {
        context.logout();
        return Promise.resolve();
      }}
    >
      <Main>
        <ConnectionHelpers />
        <GameRoom.Connected>
          <TicTacToe />
        </GameRoom.Connected>
      </Main>
    </CreateGameRoomClient>
  );
}
