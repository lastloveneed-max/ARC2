// Deployed Contract Addresses from your GitHub README
const cryptoStreamerAddress = "0x37C5C84A8085454de70eaeE36328120aa491f97b";
const escrowAddress         = "0x8a0cE00De9EB5577a52a8d827aec3E816765f3B3";
const votingAddress         = "0xCF58270Ab39aD4eCc97455F01c32A343DF641B8d";
const lotteryAddress        = "0x3ca70E29a6c85634C2bA6eDf00D30f4A9b53cfe1";

// CryptoStreamer ABI (You already provided this)
const cryptoStreamerABI = [{"inputs":[],"name":"AmountMustBeGreaterThanZero","type":"error"},{"inputs":[],"name":"CannotStreamToYourself","type":"error"},{"inputs":[],"name":"DurationMustBeGreaterThanZero","type":"error"},{"inputs":[],"name":"InvalidEmployeeAddress","type":"error"},{"inputs":[],"name":"NoFundsAvailable","type":"error"},{"inputs":[],"name":"OnlyEmployeeCanWithdraw","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"streamId","type":"uint256"},{"indexed":true,"internalType":"address","name":"employer","type":"address"},{"indexed":true,"internalType":"address","name":"employee","type":"address"}],"name":"StreamCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"streamId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokensWithdrawn","type":"event"},{"inputs":[{"internalType":"uint256","name":"_streamId","type":"uint256"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_employee","type":"address"},{"internalType":"uint256","name":"_totalAmount","type":"uint256"},{"internalType":"contract IERC20","name":"_token","type":"address"},{"internalType":"uint256","name":"_durationSeconds","type":"uint256"}],"name":"createStream","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"nextStreamId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"streams","outputs":[{"internalType":"address","name":"employer","type":"address"},{"internalType":"address","name":"employee","type":"address"},{"internalType":"uint256","name":"totalAmount","type":"uint256"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"endTime","type":"uint256"},{"internalType":"uint256","name":"withdrawnAmount","type":"uint256"},{"internalType":"contract IERC20","name":"token","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_streamId","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];

// 🛑 Leave these empty or paste ABI from Remix/ArcScan for other contracts later
const escrowABI = []; 
const votingABI = []; 
const lotteryABI = []; 

let provider;
let signer;

// Global Contract Instances
let cryptoStreamerContract;
let escrowContract;
let votingContract;
let lotteryContract;

// 1. Connect MetaMask Wallet
document.getElementById("connectWallet").onclick = async () => {
    if (window.ethereum) {
        try {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
            
            // Initializing all contracts
            cryptoStreamerContract = new ethers.Contract(cryptoStreamerAddress, cryptoStreamerABI, signer);
            // escrowContract = new ethers.Contract(escrowAddress, escrowABI, signer);
            // votingContract = new ethers.Contract(votingAddress, votingABI, signer);
            // lotteryContract = new ethers.Contract(lotteryAddress, lotteryABI, signer);
            
            alert("MetaMask Wallet Connected Successfully! 🎉");
            document.getElementById("connectWallet").innerText = "Wallet Connected";
        } catch (error) {
            console.error(error);
            alert("Wallet connection failed!");
        }
    } else {
        alert("Please install MetaMask extension!");
    }
};

// 2. Crypto Streamer Button Logic
document.getElementById("startStreamBtn").onclick = async () => {
    if (!cryptoStreamerContract) { alert("Please connect wallet first!"); return; }
    try {
        const employee = "0x8a0cE00De9EB5577a52a8d827aec3E816765f3B3"; 
        const totalAmount = ethers.utils.parseUnits("10", 18); 
        const tokenAddress = "0x37C5C84A8085454de70eaeE36328120aa491f97b"; 
        const durationSeconds = 3600; 
        alert("Confirm transaction in MetaMask...");
        const tx = await cryptoStreamerContract.createStream(employee, totalAmount, tokenAddress, durationSeconds);
        await tx.wait(); 
        alert("Crypto Stream Created! 🚀");
    } catch (error) { console.error(error); alert("Transaction Failed!"); }
};

// 3. Freelancer Escrow Button Logic
document.getElementById("releaseFundsBtn").onclick = async () => {
    alert("Escrow functionality will work once you paste the Escrow ABI inside escrowABI = [];");
};

// 4. Gasless Voting Button Logic
document.getElementById("castVoteBtn").onclick = async () => {
    alert("Voting functionality will work once you paste the Voting ABI inside votingABI = [];");
};

// 5. NFT Gated Lottery Button Logic
document.getElementById("buyTicketBtn").onclick = async () => {
    alert("Lottery functionality will work once you paste the Lottery ABI inside lotteryABI = [];");
};
