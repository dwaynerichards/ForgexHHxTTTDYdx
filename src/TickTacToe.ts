class Player {
    mark: 'X' | 'O' | null = null;
    wins: number = 0;
    ties: number = 0;
    constructor(public name: string) {}
    get symbol() {
        return this.mark;
    }
    set symbol(_mark: 'X' | 'O' | null) {
        this.mark = _mark;
    }
}
class TTT {
    public player1: Player;
    public player2: Player;
    public board: TTTBoard;
    public turn: Player;
    constructor(public rounds: number, _player1: string, _player2: string) {
        //YOUR WORK HERE
        this.player1 = new Player(_player1);
        this.player2 = new Player(_player2);
        this.player1.symbol = 'O';
        this.player2.symbol = 'X';
        this.board = new TTTBoard();
        this.turn = this.player1;
    }

    runGame() {
        if (this.rounds === 0) {
            const { player1, player2, declareWinner, declareTie } = this;
            player1.wins === player2.wins
                ? declareTie()
                : player1.wins > player2.wins
                ? declareWinner(player1)
                : declareWinner(player1);
        } else {
            this._decrementRounds();
            this.printCurrentBoard();
            this._printCurrentPlayersTurn();
        }
    }

    playRound(row: number, col: number) {
        //invoke playPeice on board
        //
        ////chech if valid move- place move- print move- switch player turns
        this.board.canPlacePiece(row, col)
            ? this._playRound(row, col)
            : this.printInvalidMove();
    }

    _playRound(row: number, col: number) {
        this.board.placePiece(row, col, this.turn);
        this.printCurrentBoard();
        this.board.moves > 2 && this.board.checkWinCondtion(this.turn)
            ? this.declareWinner(this.turn)
            : this.switchPlayer();
    }

    _printCurrentPlayersTurn() {
        process.stdout.write(`It's ${this.turn.name}'s turn`);
        //YOUR WORK HERE
    }

    _decrementRounds() {
        this.rounds--;
    }

    declareWinner(player: Player) {
        //@TODO print winner
        process.stdout.write(`${player.name} has won the game`);
        player.wins++;
        //YOUR WORK HERE
        this.runGame();
    }

    declareTie() {
        process.stdout.write(`No Player is victorious, there has been a tie`);
    }

    printInvalidMove() {
        process.stdout.write(`Invalid move- That spot is taken`);
    }

    printCurrentBoard() {
        this.board.printBoard();
    }

    switchPlayer() {
        const { _switchPlayer, _printCurrentPlayersTurn } = this;
        _switchPlayer();
        _printCurrentPlayersTurn();
    }
    _switchPlayer() {
        const { player1, player2, turn } = this;
        turn === player1 ? (this.turn = player2) : (this.turn = player1);
    }
}

class TTTBoard {
    public storage = [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
    ];
    public moves: number = 0;
    constructor() {}

    printBoard() {
        process.stdout.write('  0 1 2\n');
        process.stdout.write('  _ _ _\n');
        this.storage.forEach((line, row) => {
            process.stdout.write(`${row}`);
            line.forEach((square) => {
                process.stdout.write(`|${square}`);
            });
            process.stdout.write('|');
            process.stdout.write('\n');
            process.stdout.write('  - - -\n');
        });
        process.stdout.write('\n');
    }

    canPlacePiece(row: number, col: number): boolean {
        const location = this.storage[row][col];
        if (location === '') return true;
        return false;
    }

    placePiece(row: number, col: number, player: Player) {
        this.storage[row][col] = player.symbol as string;
        this.moves++;
        //mark place on board
    }

    checkWinCondtion(player: Player): boolean {
        if (
            this.checkColumns(player) ||
            this.checkDiagonals(player) ||
            this.checkRows(player)
        )
            return true;
        return false;
    }

    checkDiagonals(player: Player): boolean {
        //YOUR WORK HERE
        const { storage } = this;
        const middle = storage[1][1];
        if (middle === player.symbol) {
            if (storage[0][0] === middle && storage[2][2] === middle)
                return true;
            if (storage[0][2] === middle && storage[2][0] === middle)
                return true;
        }
        return false;
    }

    checkRows(player: Player): boolean {
        //YOUR WORK HERE
        for (const arr of this.storage) {
            const set = new Set(arr);
            if (set.has(player.symbol as string) && set.size === 1) return true;
        }
        return false;
    }

    checkColumns(player: Player): boolean {
        //assemble comumns as indices of each arr
        //copy storage/ deconstruct
        const { storage } = this;
        let prev = storage[0].length;
        let count = 0;
        ///step though matrix until all items are removed/checked or we have counted 3 consecutive player symbols
        while (storage[2].length > 0 && count < 3) {
            ///if one column has been removed, reset count, change
            storage.forEach((row) => {
                if (row.length < prev) {
                    count = 0;
                    prev = row.length;
                }
                const current = row.pop();
                if (current === player.symbol) count++;
            });
            if (count === 3) return true;
        }
        return false;
    }
}

let game = new TTT(9, 'dwayne', 'naima');
game.runGame();
