// Global variables for Web3 connectivity
let provider;
let signer;

// 1. Paste your deployed contract addresses here from Remix IDE
const cryptoStreamerAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Example Address
const escrowAddress = "0x0000000000000000000000000000000000000000";         // Put Escrow Address here
const votingAddress = "0x0000000000000000000000000000000000000000";         // Put Voting Address here
const lotteryAddress = "0x0000000000000000000000000000000000000000";        // Put Lottery Address here

// 2. ABIs (Solidity Compiler tab theke copy kore ekhane paste korun)
const cryptoStreamerABI = [
    {
        "inputs": [{ "internalType": "address", "name": "_recipient", "type": "address" }],
        "name": "startStream",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
];

// REMIX theke dynamic array copy kore nicher faka brackets [...] e bhashaben
const escrowABI = [
    {
        "inputs": [],
        "name": "releaseFunds",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]; 

const votingABI = [
    {
        "inputs": [{ "internalType": "uint256", "name": "proposalId", "type": "uint256" }],
        "name": "castVote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]; 

const lotteryABI = [
    {
        "inputs": [],
        "name": "buyTicket",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
];

// Wallet Connection Logic
async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            
            const address = await signer.getAddress();
            document.getElementById('connectWallet').innerText = "Wallet Connected";
            console.log("Connected Wallet Address:", address);
        } catch (error) {
            console.error("User denied account access", error);
        }
    } else {
        alert('MetaMask is not installed. Please install it to use this app.');
    }
}

//
    alert("Lottery functionality will work once you paste the Lottery ABI inside lotteryABI = [];");
};
