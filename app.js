java script file



const contractAddress = "0x37C5C84A8085454de70eaeE36328120aa491f97b"; 

// Here is your complete ABI pasted inside the brackets
const contractABI = [{"inputs":[],"name":"AmountMustBeGreaterThanZero","type":"error"},{"inputs":[],"name":"CannotStreamToYourself","type":"error"},{"inputs":[],"name":"DurationMustBeGreaterThanZero","type":"error"},{"inputs":[],"name":"InvalidEmployeeAddress","type":"error"},{"inputs":[],"name":"NoFundsAvailable","type":"error"},{"inputs":[],"name":"OnlyEmployeeCanWithdraw","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"streamId","type":"uint256"},{"indexed":true,"internalType":"address","name":"employer","type":"address"},{"indexed":true,"internalType":"address","name":"employee","type":"address"}],"name":"StreamCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"streamId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokensWithdrawn","type":"event"},{"inputs":[{"internalType":"uint256","name":"_streamId","type":"uint256"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_employee","type":"address"},{"internalType":"uint256","name":"_totalAmount","type":"uint256"},{"internalType":"contract IERC20","name":"_token","type":"address"},{"internalType":"uint256","name":"_durationSeconds","type":"uint256"}],"name":"createStream","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"nextStreamId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"streams","outputs":[{"internalType":"address","name":"employer","type":"address"},{"internalType":"address","name":"employee","type":"address"},{"internalType":"uint256","name":"totalAmount","type":"uint256"},{"internalType":"uint256","name":"startTime","type":"uint256"},{"internalType":"uint256","name":"endTime","type":"uint256"},{"internalType":"uint256","name":"withdrawnAmount","type":"uint256"},{"internalType":"contract IERC20","name":"token","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_streamId","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]; 

let provider;
let signer;
let contract;

document.getElementById("connectWallet").onclick = async () => {
    if (window.ethereum) {
        try {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
            
            contract = new ethers.Contract(contractAddress, contractABI, signer);
            
            alert("MetaMask Wallet Connected Successfully! 🎉");
            document.getElementById("connectWallet").innerText = "Wallet Connected";
        } catch (error) {
            console.error(error);
            alert("Wallet connection failed!");
        }
    } else {
        alert("Please install MetaMask extension in your browser!");
    }
};

document.getElementById("startStreamBtn").onclick = async () => {
    if (!contract) {
        alert("Please connect your wallet first!");
        return;
    }
    try {
        // Data according to your smart contract's createStream function
        const employee = "0x8a0cE00De9EB5577a52a8d827aec3E816765f3B3"; 
        const totalAmount = ethers.utils.parseUnits("10", 18); // Example: 10 Tokens
        const tokenAddress = "0x37C5C84A8085454de70eaeE36328120aa491f97b"; // Your ERC20 token address
        const durationSeconds = 3600; // 1 hour

        alert("Please confirm the transaction in MetaMask...");
        
        // Calling your real createStream function
        const tx = await contract.createStream(employee, totalAmount, tokenAddress, durationSeconds);
        await tx.wait(); 
        
        alert("Crypto Stream Created Successfully! 🚀");
    } catch (error) {
        console.error(error);
        alert("Transaction Failed! Check browser console for details.");
    }
};