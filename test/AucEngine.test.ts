import { BlockTag } from "@ethersproject/abstract-provider";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { } from "@nomiclabs/hardhat-waffle";

import { expect, use } from "chai"
import { BigNumber, ContractTransaction, utils } from "ethers";

import { ethers } from "hardhat"
import { AucEngine } from "../typechain";
import { MockProvider, solidity } from "ethereum-waffle";
import { getAddress } from "ethers/lib/utils";

use(solidity);

describe("AucEngine", async function () {
  let owner : SignerWithAddress;
  let candidat : SignerWithAddress;
  let participant : SignerWithAddress;
  let other : SignerWithAddress[];
  let voting : AucEngine;
  let isDone : boolean = true;
  let index : number = 0;
  const [wallet, walletTo] = new MockProvider().getWallets();

  beforeEach(async function () {
    [owner, candidat, participant, ...other] = await ethers.getSigners();
    const AucEngine = await ethers.getContractFactory("AucEngine", owner);
    voting = await AucEngine.deploy();
    await voting.deployed();
    
  });
  
  const VOTING_SUM = utils.parseEther("0.01");

  const VOTING_SUM_WIN = utils.parseEther("0.009");

  const DURATION = 3 * 24 * 60 * 60;

  const wait = (tx: ContractTransaction) => tx.wait();

  const passTime = async () => {
        await ethers.provider.send("evm_increaseTime", [3 * 24 * 60 * 60]);
      };

  const addCandidate = (
    candidate: SignerWithAddress,
    by: SignerWithAddress = owner
    ) => {
     return voting.connect(by).addCandidate(candidate.address).then(wait);
  };

  describe("function addVoting", () => {
    it("should set the right owner", async function () {
      expect(await voting.owner()).to.equal(owner.address);
    });

    it("added voting", async () => {
      const tx = await voting.addVoting("VotingOne");
      
      const cVoting = await voting.votings(0);
      expect(cVoting.title).to.eq("VotingOne");
      
      await expect(tx).to.emit(voting, 'VotingCreated').withArgs(cVoting.title);
    });
  });
  
  beforeEach(async function () {
    await voting.addVoting("VotingOne");   
  });

  describe("function startVoting", () => {

    it("started voting", async () => {
      
      const tx = await voting.startVoting(0);
      await expect(tx.wait()).to.be.ok;
         
      const cVoting = await voting.votings(0);

      expect(cVoting.started).to.be.true;

      const blockNumBefore = await ethers.provider.getBlockNumber();
      const blockBefore = await ethers.provider.getBlock(blockNumBefore);
      const endTime = blockBefore.timestamp + DURATION;       
      expect(cVoting.endsAt).to.be.eq(endTime);
          
    });
  });
  
  describe("exists address in list", () => {
    it('exists address', async () => {

    });
  });
  
  describe("addCandidate", function () {
    it("add candidate correctly", async function() {
      
      const candidateTx = await voting.connect(candidat).addCandidate(0);

      const viewTx = await voting.candidates(0);

      console.log(viewTx);    
      
      expect(viewTx).to.be.an('array');
      
    });
  });

  beforeEach(async function () {
    await voting.connect(candidat).addCandidate(0);   
  });

  describe("function vote", () => {  
    it("vote for a candidate", async () => {
      const ind = 0;
      await voting.connect(owner).addCandidate(0);
      await voting.startVoting(0);

      await expect(voting.connect(participant).vote(
        0,
        candidat.address,
        { value: utils.parseEther("0.02") }
      ))
      .to.be.revertedWith("sum don't equal price");

      const tx = await voting.connect(participant).vote(
        0,
        candidat.address,
        { value: utils.parseEther("0.01") }
      );
      
      console.log(await voting.candidates(0));

      await expect(() => tx)
        .to.changeEtherBalance(
          voting, 
          utils.parseEther("0.01")
      );

      const cVoting = await voting.votings(0);
      expect(cVoting.totalAmount).to.be.eq(VOTING_SUM);
          
    });
  });

  describe("stop voting", () => {
    it('exists address', async () => {
      
      await expect(voting.stopVoting(0))
      .to.be.revertedWith("don't started");  

      await voting.startVoting(0);
      await expect(voting.stopVoting(0))
      .to.be.revertedWith("can't stop");

      await voting.connect(participant).vote(
        0,
        candidat.address,
        { value: utils.parseEther("0.01") }
      );

      await ethers.provider.send("evm_increaseTime", [3 * 24 * 60 * 60 + 1]);     
      const tt = await voting.stopVoting(0);
    
      const cVoting = await voting.votings(0);
      expect(cVoting.ended).to.be.true;
    
      await expect(() => tt)
        .to.changeEtherBalance(voting, -( VOTING_SUM_WIN));


    });
  });
  

  
 

});


