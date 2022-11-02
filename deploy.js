const ethers = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)
  const encryptedJsonKey = fs.readFileSync("./.encryptedKey.json", "utf8")
  let wallet = new ethers.Wallet.fromEncryptedJsonSync(
    encryptedJsonKey,
    process.env.PRIVATE_KEY_PASSWORD
  )
  wallet = await wallet.connect(provider) // defining provider to wallet

  // Reading Files
  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
  const binary = fs.readFileSync(
    "./SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  )
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet)

  // Deploying Contract
  console.log("Deploying, please wait... \n")
  const contract = await contractFactory.deploy()
  await contract.deployTransaction.wait(1)
  console.log(`Contract Address: ${contract.address} \n`)

  // Get Number
  const currentFavouriteNumber = await contract.retrive()
  console.log(`Current Favourite Number: ${currentFavouriteNumber.toString()}`)

  // Store Number
  const transactionResponse = await contract.store("69")
  await transactionResponse.wait(1)

  // Get Updated Number
  const updatedFavouriteNumber = await contract.retrive()
  console.log(`Updated Favourite Number: ${updatedFavouriteNumber.toString()}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => console.log(error))
