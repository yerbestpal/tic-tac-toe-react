import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// Function component
// Use where class would only contain a render method
// and don't contain their own state.
function Square(props) {
	return (
		<button className="square" onClick={props.onClick}>
			{props.value}
		</button>
	);
}

// Board is parent component of square and manages the state of its children.
class Board extends React.Component {
	// Renders Square() function component using JSX and passes value and onClick
	// method to determine whether clicked square should have an 'O' or 'X'' state.
	renderSquare(i) {
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

// Parent class of Board().
// Manages state for Board() and its children.
class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [
				{
					// Initial array/state.
					squares: Array(9).fill(null),
				},
			],
			stepNumber: 0,
			xIsNext: true,
		};
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? "X" : "O";
		this.setState({
			history: history.concat([
				{
					squares: squares,
				},
			]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		});
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			// xIsNext is true on the first play, i.e. at position 0, so true will
			// always land on an even index number.
			xIsNext: step % 2 === 0,
		});
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);

		const moves = history.map((step, move) => {
			const desc = move ? "Go to move #" + move : "Go to game start";
			// This will create a list with elements that are not assigned a key
			// This is not usually recommended, but since we are never reordering,
			// deleting or inserting in the middle, a new list item, it is safe
			// to do. React with use the index position of each item since no key
			// is specified, which is perfect for keeping track of the history of
			// the game board.
			return (
				// assigning move to key will silence React warnings but does not
				// actually change functionality.
				<li key={move}>
					<button onClick={() => this.jumpTo(move)}>{desc}</button>
				</li>
			);
		});

		let status;
		if (winner) {
			status = "Winner: " + winner;
			console.log(history);
		} else {
			status = "Next player: " + (this.state.xIsNext ? "X" : "O");
		}

		return (
			<div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

// Calculates if there is a completed row of 'O' or 'X'.
function calculateWinner(squares) {
	const lines = [
		// Each array represents a potential completed line.
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	// If any array is identical to the selected squares, return true.
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
			return squares[a];
	}
	return null;
}
