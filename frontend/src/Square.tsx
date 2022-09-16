import React from "react";
export type Mark = "O" | "X" | null;

interface SquareProps {
  value: Mark;
  onClick: () => void;
}
const Square = (props: SquareProps): JSX.Element => {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
};

export default Square;
