// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.13;

import "./Board.sol";

contract TickTackToe {
    enum Turn {
        player1,
        player2
    }
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
    }
    struct Round {
        Turn turn;
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

    function _initGame() internal {
        Game memory game;
        games[gameIDs++] = game;
        emit GameCreated(gameIDs);
    }

    event PlayerJoined(address indexed player);

    function joinGame() external payable {
        ///game to join will be accessed buy the curent game's Id
        Game memory game = games[gameIDs];
        ///@TODO reqiure status.open
        (game.player1.player == address(0))
            ? game.player1 = Player(msg.sender, 0)
            : game.player2 = Player(msg.sender, 0);

        emit PlayerJoined(msg.sender);
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
        address[3][3] rounds
    );

    function _startMatch(Game memory game) internal {
        Round memory round;
        round.board = new Board();
        game.rounds[game.round] = round;
        game.round++;
        games[gameIDs] = game;
        // emit StartMatch
        //     gameIDs,
        //     game.player1.player,
        //     game.player2.player,
        //     game.rounds
        // );
    }

    function _getBoard(Game memory game)
        internal
        view
        returns (address[3][3] memory)
    {
        return game.rounds[game.round - 1].board.getState();
        //return board.getState();
    }

    //front ends gets event

    //playGame- passin gameID
    //function playGame(uint256 _gameID) external {}
    //get acces to game by looking at -1 game rounds

    ///match started- players play round
    //fron end recieves match started-

    //if both addresses are taken, close game
    //assign msg.sendr to player

    //playRound

    //-decrementRound

    //declareRoundWin

    //decalreGameWin

    //switchPlayer
}
