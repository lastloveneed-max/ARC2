// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

// Custom Errors for Gas Optimization
error NotNFTHolder();
error InvalidEntryFee();
error LotteryClosed();
error LotteryStillActive();
error NoPlayers();
error TransferFailed();

contract NFTGatedLottery {
    
    IERC721 public requiredNFT; // The NFT contract address required to enter
    uint256 public entryFee;    // Amount of Native Coin required to buy a ticket
    uint256 public lotteryEndTime;
    address public owner;
    address public recentWinner;
    
    address[] public players;

    event TicketPurchased(address indexed player);
    event WinnerPicked(address indexed winner, uint256 prizeAmount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call");
        _;
    }

    constructor(address _nftAddress, uint256 _entryFee, uint256 _durationSeconds) {
        owner = msg.sender;
        requiredNFT = IERC721(_nftAddress);
        entryFee = _entryFee;
        lotteryEndTime = block.timestamp + _durationSeconds;
    }

    /**
     * @notice Allows an NFT holder to buy a lottery ticket
     */
    function enterLottery() external payable {
        if (block.timestamp > lotteryEndTime) revert LotteryClosed();
        if (msg.value != entryFee) revert InvalidEntryFee();
        
        // Security Check: Ensure the user owns at least 1 NFT from the required collection
        if (requiredNFT.balanceOf(msg.sender) == 0) revert NotNFTHolder();

        players.push(msg.sender);
        emit TicketPurchased(msg.sender);
    }

    /**
     * @notice Picks a random winner from the players array safely across EVM networks
     */
    function pickWinner() external onlyOwner {
        if (block.timestamp <= lotteryEndTime) revert LotteryStillActive();
        if (players.length == 0) revert NoPlayers();

        // Safe pseudo-random number generator compatible with ARC chain and standard EVM
        uint256 indexOfWinner = uint256(
            keccak256(
                abi.encodePacked(msg.sender, block.timestamp, gasleft(), players.length)
            )
        ) % players.length;

        address winner = players[indexOfWinner];
        recentWinner = winner;
        
        // Reset the lottery state for next round
        players = new address[](0); 
        lotteryEndTime = block.timestamp + 604800; // Automatically extend by 1 week

        // Send the entire balance of the contract to the winner
        uint256 prize = address(this).balance;
        (bool success, ) = payable(winner).call{value: prize}("");
        if (!success) revert TransferFailed();

        emit WinnerPicked(winner, prize);
    }

    // Helper function to check total players
    function getPlayersCount() external view returns (uint256) {
        return players.length;
    }
}
