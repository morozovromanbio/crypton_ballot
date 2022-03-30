// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";
//import "./CandidateFactory.sol";
//import "./VotingFactory.sol";

pragma solidity ^0.8.11;

contract Ballot is Ownable {

    uint256 public price = 10000000 gwei;
    uint256 constant expirationTime = 3 days;
    uint256 constant FEE = 10;
    
    event NewVoting(uint votingId, string name);
    event NewVote(uint votingId);

    uint votingIdNew = 0;

    //структура голосования
    struct Voting {
      string name;
      uint256 endTime;
      uint256 balance;
      bool stopped;
      address[] candidates; 
      //mapping(address => uint) candidates;
    }  

    //айди голосовние=>структура голосования
    mapping(uint256 => Voting) private _votings;

    //айди голосование=>адрес кандидата=>число голосов
    mapping(uint256 => mapping(address => uint256)) private _candidate;

    //аддрес пользователь => айди голосование => участвовал ли
    mapping(address => mapping (uint256 => bool)) private _votes;

    //функция создания голосования, создать может только owner
    function createVoting(string memory name, address[] memory candidat) public onlyOwner {            
        // Voting memory newVoting = Voting({
        //     name: name,
        //     endTime: block.timestamp + expirationTime,
        //     balance: 0,
        //     stopped: false,
        //     candidates: candidat
        // });
        //votings.push(newVoting);     
        
        Voting storage voting = _votings[votingIdNew];
        voting.name = name;
        voting.endTime = block.timestamp + expirationTime;
        voting.candidates = candidat;
        for (uint i = 0; i < candidat.length; i++) {
            voting.candidates.push(candidat[i]);
        }
            
        emit NewVoting(votingIdNew, name);
        votingIdNew++;
    }

    //функция добавить голос
    function addVote(uint256 votingId, address candidate) external payable {
        require( msg.value == price, "Price no eqaul 0.01 ETH" );
        require( _votes[msg.sender][votingId] == false, "User already voted" );
        require( block.timestamp <= _votings[votingId].endTime, "Time expired" );

        //Добавляем голос кандидату
        _candidate[votingId][candidate]++ ;
        //Добавляем баланс голосованиюe
        _votings[votingId].balance += msg.value; 
        //Добавляем что пользователь учавствовал в данном голосовании   
        _votes[msg.sender][votingId] = true;

        emit NewVote(votingId);   
    }

    //функция завершить голосование и выбрать победителя
    function winning(uint256 votingId) external
            returns (address win)
    {   
        //require(  time >= block.timestamp, "Rejected" );
        uint winningVoteCount = 0;
        
        for (uint i = 0; i < _votings[votingId].candidates.length; i++) {
            if (_candidate[votingId][_votings[votingId].candidates[i]] > winningVoteCount) {              
                winningVoteCount = _candidate[votingId][_votings[votingId].candidates[i]];
                
                win = _votings[votingId].candidates[i];
            }
        }

        if ( _votings[votingId].stopped == false) {
            withdrawWin(win, _votings[votingId].balance);
            _votings[votingId].balance = 0;
            _votings[votingId].stopped = true;
            
        }

    }

    function withdrawWin(address win, uint256 balance) private {

        address payable receiver = payable(win);

        uint256 balanceWin = balance / 100 * 90;
        
        receiver.transfer(balanceWin);
    }

    // //функция вывод комиссий c платформы
    function withdrawAll() public onlyOwner{

        address payable receiver = payable(msg.sender);
        
        receiver.transfer(address(this).balance);
    }

    //Функция просмотра о голосовании
    //айди голосовние=>структура голосования
    //mapping(uint256 => Voting) private _votings;
    function getVotingName(uint256 votingId) public view 
    returns (string memory) {
        return _votings[votingId].name;
    }

    function getTime(uint256 index) public view 
    returns(uint256){
        Voting memory cVoting = _votings[index];
        return cVoting.endTime;
    }
}

