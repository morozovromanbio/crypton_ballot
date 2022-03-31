
import { ethers, run } from "hardhat";
import { AucEngine__factory } from "../typechain";

async function main() {

  const [signer] = await ethers.getSigners()

  const aucEngine = await new AucEngine__factory(signer).deploy()

  await aucEngine.deployed()

  console.log("AucEngine deployed to:", aucEngine.address)

  await run('verify:verify', {
    address: aucEngine.address,
    contract: 'contracts/AucEngine.sol:AucEngine'
  })

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
