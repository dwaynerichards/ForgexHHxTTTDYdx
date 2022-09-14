import React from "react";
import ReactDom from "react-dom/client";
import "./index.css";

class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  //js classes always call super when definings the structure of subclass
  //all react compnenets with constructor should start with super(props)call
  constructor(props) {
    super(props);
    this.state = {
      status: "O",
      squares: Array(9).fill(null),
    };
  }
  renderSquare(i) {
    //in React, its convention to use on[Event] names for props which
    //repreesent events, and handle[Event] for methods which handle events
    const handleClick = (i) => {
      const squares = this.state.squares.slice();
      squares[i] = this.state.status;
      const status = this.state.status === "O" ? "X" : "O";
      this.setState({ status, squares });
    };
    return (
      <Square value={this.state.squares[i]} onClick={() => handleClick(i)} />
    );
  }
  render() {
    const status = `Next player: ${this.state.status}`;
    return (
      <div>
        <div className="status"> {status} </div>
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

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board></Board>
        </div>
        <div className="game-info">
          <div>{/** status */} </div>
          <ol>{/**@todo */} </ol>
        </div>
      </div>
    );
  }
}

const root = ReactDom.createRoot(document.getElementById("root"));
root.render(<Game />);