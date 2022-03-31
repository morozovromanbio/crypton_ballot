const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("AucEngine", function () {
  let owner
  let candidat
  let participant
  let voting

  beforeEach(async function () {
    [owner, candidat, participant] = await ethers.getSigners()

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
    return (
      //ether подключаюсь к блокчейну. полочаю информацию-именно время
      await ethers.provider.getBlock(bn)
    ).timestamp
  }

  describe("addVoting", function () {
    it("add voting correctly", async function() {
      const tx = await voting.addVoting("VotingOne")
      
      const cAuction = await voting.votings(0) 
      expect(cAuction.title).to.eq("VotingOne")  
      //console.log(tx)

      await expect(tx)
        .to.emit(voting, 'VotingCreated')
        .withArgs("VotingOne")
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

      const addrCandidate = voting.votings(0).
      

      // await expect(
      //   voting.connect(candidate).addCandidate(index)
      // ).to.be.revertedWith('start')
      
    })
  })
})
  // describe("addCandidate", function () {
  //   it("add candidate correctly", async function() {
      
  //     await voting.addVoting(
  //       "VotingOne"
  //     )
      
  //     const cAuction = await voting.votings(0) // Promise
  //     expect(cAuction.title).to.eq("VotingOne")
      
  //     this.timeout(5000) // 5s
  //     await delay(1000)

  //     const index = 0;
  //     const candidateTx = await voting.connect(candidate).addCandidate(
  //       index
  //     )

  //    console.log(candidateTx)

  //     await expect(
  //       voting.connect(candidate).addCandidate(index)
  //     ).to.be.revertedWith('start')
      
  //   })
  // })






//   describe("buy", function () {
//     it("allows to buy", async function() {
//       await voting.connect(candidate).createAuction(
//         ethers.utils.parseEther("0.0001"),
//         3,
//         "fake item",
//         60
//       )

//       this.timeout(5000) // 5s
//       await delay(1000)

//       const buyTx = await voting.connect(participant).
//         buy(0, {value: ethers.utils.parseEther("0.0001")})

//       const cAuction = await voting.votingions(0)
//       const finalPrice = cAuction.finalPrice
//       await expect(() => buyTx).
//         to.changeEtherBalance(
//           candidate, finalPrice - Math.floor((finalPrice * 10) / 100)
//         )

//       await expect(buyTx)
//         .to.emit(voting, 'AuctionEnded')
//         .withArgs(0, finalPrice, participant.address)

//       await expect(
//         voting.connect(participant).
//           buy(0, {value: ethers.utils.parseEther("0.0001")})
//       ).to.be.revertedWith('stopped!')
//     })
//   })
// })
