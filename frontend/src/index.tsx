import React from "react";
import ReactDom from "react-dom/client";
import { JsxElement } from "typescript";
import "./index.css";
import Square, { Mark } from "./Square";
import calculateWinner from "./CalculateWinner";
//Alwasy define interface above classBasedComponenet
interface BoardProps {
  squares: Array<Mark>;
  onClick: (i: number) => void;
}

class Board extends React.Component<BoardProps> {
  renderSquare(i: number) {
    //convention to use on[Event] names for props which repreesent events
    //and handle[Event] for methods which handle events
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

interface GameState {
  player: Mark;
  history: Array<Square>;
}
interface Square {
  squares: Array<Mark>;
}
class Game extends React.Component {
  state: GameState = {
    player: "O",
    history: [
      {
        squares: Array(9).fill(null),
      },
    ],
  };
  constructor(props: BoardProps) {
    super(props);
  }

  handleClick(i: number): void {
    const { history } = this.state;
    const current = history[history.length - 1];
    //get curent square
    const { squares } = current;
    //place mark
    if (squares[i] || calculateWinner(squares)) return;
    squares[i] = this.state.player;
    const player = this.state.player === "O" ? "X" : "O";
    const newHistory = history.concat([{ squares }]);
    this.setState({ player, squares, history: newHistory });
  }

  render(): React.ReactNode {
    const { history } = this.state;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);
    let status: string;
    if (winner) {
      status = `Winner: ${winner}`;
    } else {
      status = `Next player: ${this.state.player}`;
    }

    return (
      //convention to use on[Event] names for props which repreesent events
      //and handle[Event] for methods which handle events
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          ></Board>
        </div>
        <div className="game-info">
          <div className="status"> {status} </div>
          <div>{/** status */} </div>
          <ol>{/**@todo */} </ol>
        </div>
      </div>
    );
  }
}

const root = ReactDom.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<Game />);
