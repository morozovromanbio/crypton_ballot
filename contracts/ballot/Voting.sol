// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";
//import "./CandidateFactory.sol";
//import "./VotingFactory.sol";

pragma solidity ^0.8.11;

contract Voting is Ownable {
    
    constructor() {
        owner = msg.sender;
    }

    uint256 public price = 10 gwei;
    //uint256 public price = 1 ether;
    uint expirationTime = 3 days;
    
    event NewVoting(uint votingId, string name, uint dna);

    uint dnaDigits = 16;
    uint dnaModulus = 10 ** dnaDigits;

    struct Candidate {
        address id;
        uint256 balance;
    }

    struct Voting {
      string name;
      uint dna;
      uint32 balance;
      uint32 endTime;
      address[] candidates;
      mapping (address => bool) voter;
    }

    Voting[] public votings;

    // mapping (uint => address) public votingToOwner;
    // mapping (address => uint) ownerVotingCount;

    //функция создания голосования, создать может только owner
    function createRandomVoting(string _name) public onlyOwner {
        require(ownerVotingCount[msg.sender] == 0);
        uint randDna = _generateRandomDna(_name);
        randDna = randDna - randDna % 100;
        _createVoting(_name, randDna);
    }

    function _createVoting(string _name, uint _dna) internal {
        uint id = votings.push(Voting(_name, _dna, 0, uint32(now))) - 1;
        NewVoting(id, _name, _dna);
    }

    function _generateRandomDna(string _str) private view returns (uint) {
        uint rand = uint(keccak256(_str));
        return rand % dnaModulus;
    }

    //добавить голос
    function addVote() external payable {
        require(msg.value == price, "Rejected");
        require(votes[msg.sender] == price, "Rejected");
        
        balance += msg.value;
        
        voter[msg.sender] = true;
    }

    function result() public {
        parentNFT.safeTransferFrom(address(this), msg.sender, stakes[msg.sender].tokenId, stakes[msg.sender].amount, "0x00");
        stakingTime[msg.sender] += (block.timestamp - stakes[msg.sender].timestamp);
        delete stakes[msg.sender];
    }  
    
    // function getBalance() public view returns(uint) {
    //     return ballotAddress.balance;
    // }
    
    // //функция вывод комиссий
    // function withdrawAll() public onlyOwner{

    //     address payable receiver = payable(msg.sender);
        
    //     receiver.transfer(ballotAddress.balance);
    // }

    //  event voteComplete(uint _price, address _ballotAddress);

    // //функция участия в голосовании
    // receive() external payable {
    //     require(msg.value = price, "Rejected");
        
    //     if(ballotAddress.balance == price) {
            
    //         voters[msg.sender] = true;
            
    //         emit voteComplete(price, ballotAddress);
    //     }
    // }


    // //получить информацию 
    // function getVote(address _addr) public view returns(bool) {
    //     require(owner == msg.sender, "You are not an owner!");
        
    //     return votes[_addr];
    // }
}

