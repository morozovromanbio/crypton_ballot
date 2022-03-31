import { expect } from "chai"
import { ethers } from "hardhat"

describe("AucEngine", function () {
  let owner
  let candidate
  let participant
  let voting

  beforeEach(async function () {
    [owner, candidate, participant] = await ethers.getSigners()

    const AucEngine = await ethers.getContractFactory("AucEngine", owner)
    voting = await AucEngine.deploy()
    await voting.deployed()
  })

  it("sets owner", async function() {
    const currentOwner = await voting.owner()
    expect(currentOwner).to.eq(owner.address)
  })
})

//   async function getTimestamp(bn) {
//     return (
//       await ethers.provider.getBlock(bn)
//     ).timestamp
//   }

//   describe("createAuction", function () {
//     it("creates votingion correctly", async function() {
//       const duration = 60
//       const tx = await voting.createAuction(
//         ethers.utils.parseEther("0.0001"),
//         3,
//         "fake item",
//         duration
//       )

//       const cAuction = await voting.votingions(0) // Promise
//       expect(cAuction.item).to.eq("fake item")
//       const ts = await getTimestamp(tx.blockNumber)
//       expect(cAuction.endsAt).to.eq(ts + duration)
//     })
//   })

//   function delay(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms))
//   }

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