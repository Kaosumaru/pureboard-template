import TicTacToeSquare, { createFieldToken } from './TicTacToeSquare';
import './styles.css';
import { ChatProvider } from 'pureboard/client';
import TicTacToeOptions from './TicTacToeOptions';
import GameTabs, { ETabs } from '../Components/GameTabs';
import { TicTacToeProvider, useTicTacToe } from './TicTacToeContext';
import { PlayersRow } from './TicTacToePlayersRow';

function TicTacToeGame() {
  const { store, action } = useTicTacToe();
  const board = store(state => state.board);
  const winner = store(state => state.victoriousPlayer);
  const isDraw = store(state => state.isDraw);
  const lastMoveColumn = store(state => state.lastMoveColumn);
  const lastMoveRow = store(state => state.lastMoveRow);

  const fullBoard = board.map((row, rowIdx) => {
    return row.map((_, colIdx) => {
      const isLastMove = lastMoveColumn === colIdx && lastMoveRow === rowIdx;
      return (
        <TicTacToeSquare
          key={`${colIdx}_${rowIdx}`}
          colIdx={colIdx}
          rowIdx={rowIdx}
          field={board[rowIdx][colIdx]}
          isLastMove={isLastMove}
          onClick={(rowIdx, colIdx) => {
            void action({ type: 'move', row: rowIdx, column: colIdx });
          }}
        />
      );
    });
  });

  const hasWinner = winner !== -1;
  const topRowComponent = hasWinner ? (
    <div className="current-player-container">
      <h1>Winner</h1>
      {createFieldToken(winner + 1)}
    </div>
  ) : isDraw ? (
    <div className="current-player-container">
      <h1>Draw</h1>
    </div>
  ) : (
    <PlayersRow />
  );

  return (
    <div className="main-Page-Container">
      {topRowComponent}
      <div className={'tt-Container'}>{fullBoard}</div>
    </div>
  );
}

export default function TicTacToe() {
  const createComponent = (tab: ETabs) => {
    switch (tab) {
      case ETabs.Game:
        return <TicTacToeGame />;
      case ETabs.Settings:
        return <TicTacToeOptions />;
    }
    return <></>;
  };

  return (
    <TicTacToeProvider>
      <ChatProvider>
        <GameTabs createComponent={createComponent} />
      </ChatProvider>
    </TicTacToeProvider>
  );
}
