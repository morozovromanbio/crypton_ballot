// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";

contract CandidateFactory is Ownable {

    event NewCandidate(uint candidateId, string name, uint dna);

    uint dnaDigits = 16;
    uint dnaModulus = 10 ** dnaDigits;


    struct Candidate {
      string name;
      uint dna;
      uint32 level;
    }

    Candidate[] public candidates;

    mapping (uint => address) public candidateToOwner;
    mapping (address => uint) ownerCandidateCount;

    //Функция создания кандидата. Один пользователь может создавать одного кандидата
    function createRandomCandidate(string _name) public {
        require(ownerCandidateCount[msg.sender] == 0);
        uint randDna = _generateRandomDna(_name);
        randDna = randDna - randDna % 100;
        _createCandidate(_name, randDna);
    }
    
    function _createCandidate(string _name, uint _dna) internal {
        uint id = candidates.push(Candidate(_name, _dna, 0)) - 1;
        candidateToOwner[id] = msg.sender;
        ownerCandidateCount[msg.sender]++;
        NewCandidate(id, _name, _dna);
    }

    function _generateRandomDna(string _str) private view returns (uint) {
        uint rand = uint(keccak256(_str));
        return rand % dnaModulus;
    }

    

}
