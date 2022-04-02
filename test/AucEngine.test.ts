import { BlockTag } from "@ethersproject/abstract-provider";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { expect } from "chai"
import { ContractTransaction, utils } from "ethers";
import { ethers } from "hardhat"
import { AucEngine } from "../typechain";

describe("AucEngine", async function () {
  let owner : SignerWithAddress;
  let candidat : SignerWithAddress;
  let participant : SignerWithAddress;
  let other : SignerWithAddress[];
  let voting : AucEngine;
  let isDone : boolean = true;

  beforeEach(async function () {
    [owner, candidat, participant, ...other] = await ethers.getSigners();
    const AucEngine = await ethers.getContractFactory("AucEngine", owner);
    voting = await AucEngine.deploy();
    await voting.deployed();
  });

  // async function getTimestamp(bn: BlockTag | Promise<BlockTag>) {
  //   return (await ethers.provider.getBlock(bn)).timestamp
  // }
  
  const VOTING_FEE = utils.parseEther("0.01");

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
    it("added voting", async () => {
      const tx = await voting.addVoting("VotingOne");
      
      const cVoting = await voting.votings(0);
      expect(cVoting.title).to.eq("VotingOne");
      
      await expect(tx).to.emit(voting, 'VotingCreated').withArgs("VotingOne");
    });
  });

 
 

  describe("function startVoting", () => {
    it("started voting", async () => {
      await voting.addVoting("VotingOne");

      const tx = await voting.startVoting(0);
      await expect(tx.wait()).to.be.ok;
      
      
      const cVoting = await voting.votings(0);

      const blockNumBefore = await ethers.provider.getBlockNumber();
      const blockBefore = await ethers.provider.getBlock(blockNumBefore);
      const timestampBefore = blockBefore.timestamp;
      
      expect(cVoting.started).to.be.true;
    
      expect(cVoting.endsAt).to.be.eq(timestampBefore + 3 * 24 * 60 * 60);
      
      
    });
  });
  
 

});
