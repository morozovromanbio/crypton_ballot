// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";

pragma solidity ^0.8.11;


contract CondidateFactory is Ownable {

    event NewCondidate(uint votingId, string name, uint dna);

    uint dnaDigits = 16;
    uint dnaModulus = 10 ** dnaDigits;

    voting

    struct Voting {
      string name;
      uint dna;
      uint32 level;
      uint32 readyTime;
    }

    Voting[] public votings;

    mapping (uint => address) public votingToOwner;
    mapping (address => uint) ownerCondidateCount;

    function _createCondidate(string _name, uint _dna) internal {
        uint id = votings.push(Voting(_name, _dna, 1, uint32(now + cooldownTime))) - 1;
        votingToOwner[id] = msg.sender;
        ownerCondidateCount[msg.sender]++;
        NewCondidate(id, _name, _dna);
    }

    function _generateRandomDna(string _str) private view returns (uint) {
        uint rand = uint(keccak256(_str));
        return rand % dnaModulus;
    }

    function createRandomCondidate(string _name) public {
        require(ownerCondidateCount[msg.sender] == 0);
        uint randDna = _generateRandomDna(_name);
        randDna = randDna - randDna % 100;
        _createCondidate(_name, randDna);
    }

}
