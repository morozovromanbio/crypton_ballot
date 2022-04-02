// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";

pragma solidity ^0.8.11;

contract AucEngine is Ownable {

    uint256 public constant REQUIRED_SUM = 10000000 gwei;
    uint256 public constant DURATIONTIME = 3 days;
    uint256 public constant FEE = 10;
    
    event VotingCreated(string title);

    struct Voting {
      address winner;
      string title;
      uint256 maximumVotes;
      uint256 endsAt;
      uint256 totalAmount;
      bool started;
      bool ended;
      address[] allCandidates;
      address[] allParticipants;
      mapping(address => uint ) candidates;  
      mapping(address => address) participants; 
    }  
    
    Voting[] public votings;

    function candidates(uint index) external view returns(address[] memory, uint[] memory) {
        Voting storage cVoting = votings[index];
        uint count = cVoting.allCandidates.length;
        uint[] memory votes = new uint[](count);
        address[] memory candidatesList = new address[](count);
        for(uint i = 0; i < count; i++) {
            candidatesList[i] = cVoting.allCandidates[i];
            votes[i] = cVoting.candidates[candidatesList[i]];
        }
        return (candidatesList, votes);
    }

    function addVoting(string memory _title) external onlyOwner {
        Voting storage newVoting = votings.push();
        newVoting.title = _title;

        emit VotingCreated(_title);
    }

    function addCandidate(uint index) external {
        Voting storage cVoting = votings[index];
        require(!cVoting.started, "start");
        cVoting.allCandidates.push(msg.sender);
    }

    function startVoting(uint index) external onlyOwner {
        Voting storage cVoting = votings[index];
        require(!cVoting.started, "started");
        cVoting.started = true;
        cVoting.endsAt = block.timestamp + DURATIONTIME;
    }

    function addrExists(address _addr, address[] memory _addresses) private pure returns(bool) {
        for(uint i = 0; i < _addresses.length; i++) {
            if (_addresses[i] == _addr) {
                return true;
            }
        }

        return false;
    }
      
    function vote(uint index, address _for) external payable {
        require(msg.value == REQUIRED_SUM, "sum don't equal price");
        Voting storage cVoting = votings[index];
        require(cVoting.started, "not started!");
        require(
            !cVoting.ended || block.timestamp < cVoting.endsAt,
            "has ended"
        );
        require(
            !addrExists(msg.sender, cVoting.allParticipants),
            "already vote"
        );
        cVoting.totalAmount += msg.value;
        cVoting.candidates[_for]++;
        cVoting.allParticipants.push(msg.sender);
        cVoting.participants[msg.sender] = _for;
        if(cVoting.candidates[_for] >= cVoting.maximumVotes){
            cVoting.winner = _for;
            cVoting.maximumVotes = cVoting.candidates[_for];
        }
    }

    function stopVoting(uint index) external {
        Voting storage cVoting = votings[index];
        require(cVoting.started, "don't started");
        require(!cVoting.ended, "don't ended");
        require(
            block.timestamp >= cVoting.endsAt,
            "can't stop"
        );
        cVoting.ended = true;
        address payable _to = payable(cVoting.winner);
        _to.transfer(
            cVoting.totalAmount - ((cVoting.totalAmount * FEE) / 100)
        );
    }


    function withdrawWin(address win, uint256 balance) private {

        address payable receiver = payable(win);

        uint256 balanceWin = balance - (balance * 10 / 100);
        
        receiver.transfer(balanceWin);
    }

    

 


}

