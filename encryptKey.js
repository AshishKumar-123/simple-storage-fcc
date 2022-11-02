const fs = require("fs-extra")
const ethers = require("ethers")
require("dotenv").config()

async function main() {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY)
  const encryptedJsonKey = await wallet.encrypt(
    process.env.PRIVATE_KEY_PASSWORD,
    process.env.PRIVATE_KEY
  )
  console.log(encryptedJsonKey)
  fs.writeFileSync("./.encryptedKey2.json", encryptedJsonKey)
}

main()
  .then(() => process.exit(0))
  .catch((error) => console.log(error))
