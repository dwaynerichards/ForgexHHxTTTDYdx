// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.13;

contract Board {
    //state of storage
    //is ownable
    address[3][3] public matrix;
    uint256 public moves;

    constructor() {}

    function getState() external view returns (address[3][3] memory) {
        return matrix;
    }

    function canPlacePiece(uint256 row, uint256 col)
        external
        view
        returns (bool)
    {
        address location = matrix[row][col];
        if (location == address(0)) return true;
        return false;
    }

    function placePiece(
        uint256 row,
        uint256 col,
        address player
    ) external {
        matrix[row][col] = player;
    }

    function checkWinCondition(address player) external returns (bool) {
        if (
            _checkDiagnol(player) ||
            _checkhorizontal(player) ||
            _checkVertical(player)
        ) return true;
        return false;
    }

    //cna place pice
    //place pice
    //checkwin conditions
    function _checkhorizontal(address player) internal view returns (bool) {
        for (uint256 row = 0; row < matrix.length; row++) {
            if (
                matrix[row][0] == player &&
                matrix[row][1] == player &&
                matrix[row][2] == player
            ) {
                return true;
            }
        }
        return false;
    }

    function _checkDiagnol(address player) internal view returns (bool) {
        for (uint256 col = 0; col < matrix[col].length; col++) {
            if (
                matrix[0][col] == player &&
                matrix[1][col] == player &&
                matrix[2][col] == player
            ) {
                return true;
            }
            return false;
        }
    }

    function _checkVertical(address player) internal returns (bool) {}
}
