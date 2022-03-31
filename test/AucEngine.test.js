const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("AucEngine", function () {
  let owner
  let candidat
  let participant
  let voting

  beforeEach(async function () {
    [owner, candidat, candidat2, participant] = await ethers.getSigners()

    const AucEngine = await ethers.getContractFactory("AucEngine", owner)
    voting = await AucEngine.deploy()
    await voting.deployed()
  })

  it("sets owner", async function() {
    const currentOwner = await voting.owner()
    console.log(currentOwner)
    expect(currentOwner).to.eq(owner.address)
  })

  //для конкретного блока
  async function getTimestamp(bn) {
    return (await ethers.provider.getBlock(bn)).timestamp
  }

  describe("addVoting", function () {
    it("add voting correctly", async function() {
      const tx = await voting.addVoting("VotingOne")
      
      const cAuction = await voting.votings(0) 
      expect(cAuction.title).to.eq("VotingOne")  
      
      await expect(tx).to.emit(voting, 'VotingCreated').withArgs("VotingOne")
    })
  })

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  describe("addCandidate", function () {
    it("add candidate correctly", async function() {
      
      await voting.addVoting("VotingOne")
      
      const cAuction = await voting.votings(0)
      expect(cAuction.title).to.eq("VotingOne")
      
      this.timeout(5000) // 5s
      await delay(1000)

      const candidateTx = await voting.connect(candidat).addCandidate(0)

      const addrCandidate = voting.votings(0)
      
      
    })
  })

  describe("startVoting", function () {
    it("start voting", async function() {

      await voting.addVoting("VotingOne")
      
      const startTx = await voting.startVoting(0)

      const cAuction = await voting.votings(0) 
      expect(cAuction.started).to.eq(true)  
      
    })
  })

 
  describe("vote", function () {
    it("give vote", async function() {

      await voting.addVoting("VotingOne")
      await voting.connect(candidat).addCandidate(0)
      await voting.connect(candidat2).addCandidate(0)
      await voting.startVoting(0)

      this.timeout(5000)
      await delay(1000)

      const voteTx = await voting.connect(participant).vote(
        0,
        candidat.address,
        {value: ethers.utils.parseEther("0.01")}
      )

      const cAuction = await voting.votings(0)
      expect(cAuction.totalAmount).to.eq(ethers.utils.parseEther("0.01"))  

      
    })
  })


})
