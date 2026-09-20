import { FieldType } from '@shared/stores/tictactoeStore';
import { ReactNode } from 'react';
import { motion } from 'motion/react';

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

export function createFieldToken(field: FieldType): ReactNode {
  switch (field) {
    case FieldType.X:
      return createMotionDiv('tt-token-X', 'X');
    case FieldType.O:
      return createMotionDiv('tt-token-O', 'O');
    default:
      return <div></div>;
  }
}

function createMotionDiv(className: string, label: string): ReactNode {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 0.4,
        scale: { type: 'spring', visualDuration: 0.4, bounce: 0.5 },
      }}
      className={`tt-token ${className}`}
    >
      {label}
    </motion.div>
  );
}
