pragma solidity ^0.4.17;
contract Inbox {
    string public message; // type modifier name.

    constructor (string initialMessage) public {
        message = initialMessage;
    }

    function SetMessage(string newMessage) public {
        message = newMessage;
    }
}
