import { Button, Stack } from '@mui/material';
import { useLoginContext } from '@client/pages/LoginPage/LoginContext.js';
import { useTicTacToe } from './TicTacToeContext.js';
import { useSeatingContext } from 'pureboard/client';

export default function TicTacToeOptions() {
  const seating = useSeatingContext();
  const { store, action } = useTicTacToe();

  const winner = store(state => state.victoriousPlayer);
  const context = useLoginContext();

  return (
    <Stack spacing={2}>
      {winner === -1 && (
        <Button
          variant="outlined"
          onClick={() => {
            void action({ type: 'surrender', player: seating.seatOf() ?? 0 });
          }}
        >
          Surrender
        </Button>
      )}
      {winner !== -1 && (
        <Button
          variant="outlined"
          onClick={() => {
            void action({ type: 'newGame' });
          }}
        >
          New Game
        </Button>
      )}
      {
        <Button
          variant="outlined"
          onClick={() => {
            context.logout();
          }}
        >
          Logout
        </Button>
      }
    </Stack>
  );
}
