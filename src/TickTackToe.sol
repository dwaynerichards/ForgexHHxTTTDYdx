// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.13;

import "./Board.sol";

contract TickTackToe {
    struct Player {
        address player;
        uint256 wins;
    }
    struct Game {
        uint256 round;
        Player player1;
        Player player2;
        address winner;
        Round[3] rounds;
        bool over;
    }
    struct Round {
        address turn;
        Board board;
        address winner;
    }
    mapping(uint256 => Game) games;
    uint256 gameIDs; //start 0

    constructor() {
        //init game- default rounds 3
        //seprate function join game
        //if if
        _initGame();
    }

    ///@dev init's game and adds game to mapping to be accessed later by players
    ///when new palyers join game, then can access it at the game's ID
    event GameCreated(uint256 indexed gameID);
    event PlayerJoined(address indexed player, uint256 indexed gameIDs);
    event RoundWon(address winner, uint256 gameID, uint256 round);
    event GameWon(address winner, uint256 gameID);
    event RoundPlayed(
        address player,
        uint256 gameID,
        uint256 row,
        uint256 col,
        address[3][3] round
    );

    function _initGame() internal {
        Game memory game;
        games[gameIDs++] = game;
        emit GameCreated(gameIDs);
    }

    function joinGame() external payable {
        ///game to join will be accessed buy the curent game's Id
        Game memory game = games[gameIDs];
        ///@TODO reqiure status.open
        (game.player1.player == address(0))
            ? game.player1 = Player(msg.sender, 0)
            : game.player2 = Player(msg.sender, 0);

        emit PlayerJoined(msg.sender, gameIDs);
        if (_gameFilled(game)) {
            _startMatch(game);
            _initGame();
            //@TODO make game payable- accept ether/usdc
        }
    }

    function _gameFilled(Game memory game) internal pure returns (bool) {
        if (
            game.player1.player != address(0) &&
            game.player2.player != address(0)
        ) return true;
        return false;
    }

    event StartMatch(
        uint256 indexed gameIDs,
        address indexed p1,
        address indexed p2,
        address[3][3] rounds,
        uint256 round
    );

    function _startMatch(Game memory game) internal {
        Round memory round;
        round.board = new Board();
        game.rounds[game.round] = round;
        if (game.round < 3) game.round++;
        games[gameIDs] = game;
        emit StartMatch(
            gameIDs,
            game.player1.player,
            game.player2.player,
            _getBoard(game),
            game.round - 1
        );
    }

    function _getBoard(Game memory game)
        internal
        view
        returns (address[3][3] memory)
    {
        return game.rounds[game.round - 1].board.getState();
    }

    //notgameEmitted
    ///@dev copies game into mem, checks access, mutates mem, stores in storage
    function playRound(
        uint256 gameID,
        uint256 col,
        uint256 row
    ) external {
        Game memory game = games[gameID];
        require(!game.over, "gameOver");
        require(_isTurn(game), "notTurn");
        //get round, get board,  check position, place position
        _playRound(game, col, row, gameID);
        //check win conditions
        //if winnconditions  meet- update winner, launch new game
        //otherwise change turn
        _accessRoundWinner(game, gameID);
        if (!_accessGameWinner(game, gameID)) _startMatch(game);
        games[gameID] = game;
    }

    ///@dev placesPiece, changes turn
    function _playRound(
        Game memory game,
        uint256 col,
        uint256 row,
        uint256 gameID
    ) internal {
        if (_getRound(game).board.canPlacePiece(row, col)) {
            _getRound(game).board.placePiece(row, col, msg.sender);
            emit RoundPlayed(msg.sender, gameID, row, col, _getBoard(game));
            _changeTurn(game);
        }
    }

    function _accessRoundWinner(Game memory game, uint256 gameID) internal {
        if (_getRound(game).board.checkWinCondition(msg.sender)) {
            _getRound(game).winner = msg.sender;
            (msg.sender == game.player1.player)
                ? game.player1.wins++
                : game.player2.wins++;
            emit RoundWon(msg.sender, gameID, game.round - 1);
            ///check is any player in game has 2 wins, if so change player in game to winner
            //change over to true
        }
    }

    function _accessGameWinner(Game memory game, uint256 gameID)
        internal
        returns (bool)
    {
        if (game.player1.wins == 2 || game.player2.wins == 2) {
            game.over = true;
            game.winner = (game.player1.wins == 2)
                ? game.player1.player
                : game.player2.player;
            emit GameWon(game.winner, gameID);
        }
        return game.over;
    }

    function _changeTurn(Game memory game) internal pure {
        (_getRound(game).turn == game.player1.player)
            ? _getRound(game).turn = game.player2.player
            : _getRound(game).turn = game.player1.player;
    }

    function _isTurn(Game memory game) internal view returns (bool) {
        if (_getRound(game).turn == msg.sender) return true;
        return false;
    }

    function _getRound(Game memory game) internal pure returns (Round memory) {
        return game.rounds[game.round - 1];
    }

    //playRound

    //-decrementRound

    //declareRoundWin

    //decalreGameWin

    //switchPlayer
}
