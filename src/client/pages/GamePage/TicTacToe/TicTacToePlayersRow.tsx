import { Button } from '@mui/material';
import { motion } from 'motion/react';
import { createFieldToken } from './TicTacToeSquare';
import { useTicTacToe } from './TicTacToeContext';
import { SeatingInterface, useSeatingContext } from 'pureboard/client';
import { UserInfo } from 'pureboard/shared';
import { FieldType } from '@shared/stores/tictactoeStore';

function createPlayer(seat: UserInfo | null, index: number, seats: SeatingInterface) {
  if (seat) return <h2>{seat.name}</h2>;
  return (
    <h2>
      {'<empty>'}
      <Button
        variant="outlined"
        onClick={() => {
          void seats.takeSeat(index);
        }}
      >
        Take seat
      </Button>
    </h2>
  );
}

export function PlayersRow() {
  const { store } = useTicTacToe();
  const currentPlayer = store(state => state.currentPlayer);
  const seat = useSeatingContext();
  const seats = seat.store(state => state.seats);

  return (
    <div className="current-player-container">
      <motion.span style={{ display: 'inline' }} initial={false} animate={{ opacity: currentPlayer == 0 ? 1 : 0.3 }}>
        {createPlayer(seats[0], 0, seat)}
        &nbsp;&nbsp;&nbsp;
        {createFieldToken(FieldType.X)}
      </motion.span>
      <h1>VS</h1>
      <motion.span style={{ display: 'inline' }} initial={false} animate={{ opacity: currentPlayer == 1 ? 1 : 0.3 }}>
        {createFieldToken(FieldType.O)}
        &nbsp;&nbsp;&nbsp;
        {createPlayer(seats[1], 1, seat)}
      </motion.span>
    </div>
  );
}
