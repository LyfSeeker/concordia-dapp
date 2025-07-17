// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Concordia {
    string public message = "Welcome to Concordia";

    function updateMessage(string memory _newMessage) public {
        message = _newMessage;
    }
}
