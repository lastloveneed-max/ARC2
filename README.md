# ARC2 - Advanced Smart Contracts Suite 🚀

Welcome to the **ARC2** repository! This project contains a collection of 4 production-grade, highly optimized, and unique smart contracts designed for the ARC Chain. Each contract implements modern Solidity patterns, strict access controls, custom gas-efficient errors, and security best practices.

---

## 🌐 Deployed Contract Addresses (Live on ARC Testnet)

All contracts have been successfully deployed and verified on the Arc Network Testnet:

* 💸 **CryptoStreamer:** `0x37C5C84A8085454de70eaeE36328120aa491f97b`
* 🤝 **FreelancerEscrow:** `0x8a0cE00De9EB5577a52a8d827aec3E816765f3B3`
* 🗳 **GaslessVoting:** `0xCF58270Ab39aD4eCc97455F01c32A343DF641B8d`
* 🎟 **NFTGatedLottery:** `0x3ca70E29a6c85634C2bA6eDf00D30f4A9b53cfe1`

---

## 🛠 Projects Overview

### 1. 💸 CryptoStreamer
A time-based salary and token streaming protocol. It allows employers to stream funds to employees continuously over time, based on block timestamps, ensuring smooth and automated payrolls without manual monthly interventions.
* **Key Features:** Real-time balance calculations, automated stream cancellation, and optimized math.
* **Tech Used:** Solidity `0.8.20`, Block Timestamps.

### 2. 🤝 Freelancer Escrow & Arbitration
A secure, trustless decentralized escrow protocol for global freelancing. Funds are safely locked in the contract by the buyer and only released upon successful project completion. Includes a built-in third-party Arbitrator system to resolve disputes fairly.
* **Key Features:** State Machine Architecture (`Initialized`, `Completed`, `Released`, `Disputed`), Custom Arbitrator Logic, ERC20 Compatible (USDC/USDT).
* **Tech Used:** OpenZeppelin `IERC20`, State Enums.

### 3. 🗳 Gasless Voting System (Meta-Transactions)
An advanced governance/voting contract that allows users to cast votes **without paying any gas fees**. Voters sign a cryptographic message off-chain via MetaMask, and a relayer submits the signature to the blockchain, covering the gas costs.
* **Key Features:** Cryptographic Signature Verification, Replay Attack Protection, Fully Decentralized.
* **Tech Used:** OpenZeppelin `ECDSA`, `MessageHashUtils` (EIP-712 Concepts).

### 4. 🎟 NFT-Gated Raffle / Lottery
A fair, automated lottery system restricted exclusively to specific NFT holders. Only users holding at least one token from the required ERC721 collection can buy a ticket. The winner selection utilizes a safe, multi-source pseudo-randomness mechanism.
* **Key Features:** ERC721 Token Gating, Multi-source Randomness (`gasleft()`, `timestamp`), Automatic Next-Round Extensions.
* **Tech Used:** OpenZeppelin `IERC721`, Pseudo-Random Generator.

---

## ⚡ Key Architecture & Optimization Highlights

* **Gas Optimization:** Replaced traditional `require` string reverts with Solidity **Custom Errors** (`error CustomError()`), reducing gas costs significantly during execution failures.
* **Security:** Strict access control modifiers (`onlyOwner`, `onlyBuyer`, `onlyFreelancer`), safe low-level `.call` methods for transferring native currencies, and precise balance validation checks.
* **EVM Compatibility:** Configured specifically for deployment on EVM-compatible chains like the **ARC Chain**.

---

## 🚀 Deployment & Testing Guide

All contracts have been successfully compiled and deployed using **Remix IDE** via **MetaMask** on the ARC Network.

### Prerequisites
* [Node.js](https://nodejs.org/) & [MetaMask](https://metamask.io/) installed.
* ARC Testnet configured in MetaMask with faucet funds.

### Steps to Run on Remix:
1. Clone this repository or copy the `.sol` files.
2. Open [Remix IDE](https://remix.ethereum.org/).
3. In the **Solidity Compiler** tab, set the Compiler version to `0.8.20` and select **EVM Version** as `paris` or `london`.
4. In the **Deploy & Run Transactions** tab, change the Environment to **Injected Provider - MetaMask**.
5. Select your desired contract and click **Deploy**.

---

## 📄 License

This repository is licensed under the **MIT License**. Feel free to use, modify, and distribute these contracts.
