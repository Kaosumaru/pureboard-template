import { FieldType } from '@shared/stores/tictactoeStore.js';
import { createFieldToken } from './FieldToken.js';

export interface TicTacToeSquareProps {
  rowIdx: number;
  colIdx: number;
  field: FieldType;
  isLastMove?: boolean;
  onClick: (rowIdx: number, colIdx: number) => void;
}

export default function TicTacToeSquare(props: TicTacToeSquareProps) {
  return (
    <div className="tt-item" onClick={() => props.onClick(props.rowIdx, props.colIdx)}>
      {createFieldToken(props.field)}
    </div>
  );
}
