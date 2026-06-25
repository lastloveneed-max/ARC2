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

// 1. Crypto Streamer Integration
async function startStream() {
    if (!signer) return alert("Please connect your wallet first!");
    try {
        const contract = new ethers.Contract(cryptoStreamerAddress, cryptoStreamerABI, signer);
        const tx = await contract.startStream("0x70997970C51812dc3A010C7d01b50e0d17dc79C8", {
            value: ethers.utils.parseEther("0.1")
        });
        await tx.wait();
        alert("Crypto Stream Started Successfully!");
    } catch (err) {
        console.error(err);
        alert("Transaction Failed: " + err.message);
    }
}

// 2. Freelancer Escrow Integration
async function releaseEscrow() {
    if (!signer) return alert("Please connect your wallet first!");
    try {
        const contract = new ethers.Contract(escrowAddress, escrowABI, signer);
        const tx = await contract.releaseFunds();
        await tx.wait();
        alert("Escrow Funds Released!");
    } catch (err) {
        console.error(err);
        alert("Transaction Failed: " + err.message);
    }
}

// 3. Gasless Voting Integration
async function castVote() {
    if (!signer) return alert("Please connect your wallet first!");
    try {
        const contract = new ethers.Contract(votingAddress, votingABI, signer);
        const tx = await contract.castVote(1); 
        await tx.wait();
        alert("Vote Casted Successfully!");
    } catch (err) {
        console.error(err);
        alert("Transaction Failed: " + err.message);
    }
}

// 4. NFT Gated Lottery Integration
async function buyTicket() {
    if (!signer) return alert("Please connect your wallet first!");
    try {
        const contract = new ethers.Contract(lotteryAddress, lotteryABI, signer);
        const tx = await contract.buyTicket({
            value: ethers.utils.parseEther("0.05")
        });
        await tx.wait();
        alert("Lottery Ticket Bought Successfully!");
    } catch (err) {
        console.error(err);
        alert("Transaction Failed: " + err.message);
    }
}

// Event Listeners
document.getElementById('connectWallet').onclick = connectWallet;
document.getElementById('startStreamBtn').onclick = startStream;
document.getElementById('releaseFundsBtn').onclick = releaseEscrow;
document.getElementById('castVoteBtn').onclick = castVote;
document.getElementById('buyTicketBtn').onclick = buyTicket;
