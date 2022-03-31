// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";

pragma solidity ^0.8.11;


contract VotingFactory is Ownable {

    event NewVoting(uint votingId, string name, uint dna);

    uint dnaDigits = 16;
    uint dnaModulus = 10 ** dnaDigits;

    struct Candidate {
        address id;
        uint256 balance;
    }

    // struct Voting {
    //   string name;
    //   uint dna;
    //   uint32 level;
    //   uint32 readyTime;
    //   address[] candidates;
    // }

    // Voting[] public votings;

    // mapping (uint => address) public votingToOwner;
    // mapping (address => uint) ownerVotingCount;

    // function createRandomVoting(string _name) public {
    //     require(ownerVotingCount[msg.sender] == 0);
    //     uint randDna = _generateRandomDna(_name);
    //     randDna = randDna - randDna % 100;
    //     _createVoting(_name, randDna);
    // }
    
    // function _createVoting(string _name, uint _dna) internal {
    //     uint id = votings.push(Voting(_name, _dna, 0, uint32(now + cooldownTime))) - 1;
    //     votingToOwner[id] = msg.sender;
    //     ownerVotingCount[msg.sender]++;
    //     NewVoting(id, _name, _dna);
    // }

    // function _generateRandomDna(string _str) private view returns (uint) {
    //     uint rand = uint(keccak256(_str));
    //     return rand % dnaModulus;
    // }

    

}
