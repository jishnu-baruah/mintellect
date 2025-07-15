# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```

## Deploying MintellectNFT to Educhain Testnet

1. Create a `.env` file in this directory with:

```
PRIVATE_KEY=your_educhain_testnet_private_key
```

2. Compile the contract:

```
npx hardhat compile
```

3. Deploy to Educhain testnet:

```
npx hardhat run --network educhain scripts/deploy.js
```

4. View your contract on the block explorer:

https://edu-chain-testnet.blockscout.com

---
