// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CryptoStreamer {
    
    struct Stream {
        address employer;       // Address of the person funding the stream
        address employee;       // Address of the person receiving the salary
        uint256 totalAmount;    // Total tokens allocated for this stream
        uint256 startTime;      // Timestamp when the stream starts
        uint256 endTime;        // Timestamp when the stream ends
        uint256 withdrawnAmount;// Total tokens the employee has withdrawn so far
        IERC20 token;           // The ERC20 token used for payment (e.g., USDC)
    }

    uint256 public nextStreamId;
    mapping(uint256 => Stream) public streams;

    // Events for frontend tracking
    event StreamCreated(uint256 indexed streamId, address indexed employer, address indexed employee);
    event TokensWithdrawn(uint256 indexed streamId, uint256 amount);

    /**
     * @notice Creates a new salary stream for an employee
     * @param _employee Wallet address of the employee
     * @param _totalAmount Total allocation of tokens
     * @param _token The ERC20 token address
     * @param _durationSeconds Duration of the stream in seconds
     */
    function createStream(
        address _employee, 
        uint256 _totalAmount, 
        IERC20 _token, 
        uint256 _durationSeconds
    ) external returns (uint256) {
        require(_employee != address(0), "Invalid employee address");
        require(_employee != msg.sender, "Cannot stream to yourself");
        require(_totalAmount > 0, "Amount must be greater than 0");
        require(_durationSeconds > 0, "Duration must be greater than 0");

        // Transfer tokens from employer to this contract
        // Note: Employer must call approve() on the token contract first
        _token.transferFrom(msg.sender, address(this), _totalAmount);

        uint256 streamId = nextStreamId;
        nextStreamId++;

        streams[streamId] = Stream({
            employer: msg.sender,
            employee: _employee,
            totalAmount: _totalAmount,
            startTime: block.timestamp,
            endTime: block.timestamp + _durationSeconds,
            withdrawnAmount: 0,
            token: _token
        });

        emit StreamCreated(streamId, msg.sender, _employee);
        return streamId;
    }

    /**
     * @notice Calculates how much token an employee can withdraw right now
     * @param _streamId The ID of the target stream
     */
    function balanceOf(uint256 _streamId) public view returns (uint256) {
        Stream memory stream = streams[_streamId];

        // If the stream hasn't started yet, balance is 0
        if (block.timestamp <= stream.startTime) {
            return 0;
        }

        // If the stream is completely finished, they get the full amount minus what they already took
        if (block.timestamp >= stream.endTime) {
            return stream.totalAmount - stream.withdrawnAmount;
        }

        // Linear math: Calculate exact unlocked amount based on elapsed seconds
        uint256 timeElapsed = block.timestamp - stream.startTime;
        uint256 totalDuration = stream.endTime - stream.startTime;
        
        uint256 totalUnlocked = (stream.totalAmount * timeElapsed) / totalDuration;
        
        return totalUnlocked - stream.withdrawnAmount;
    }

    /**
     * @notice Allows the employee to claim their unlocked funds
     * @param _streamId The ID of the stream to withdraw from
     */
    function withdraw(uint256 _streamId) external {
        Stream storage stream = streams[_streamId];
        require(msg.sender == stream.employee, "Only the employee can withdraw");

        uint256 claimableAmount = balanceOf(_streamId);
        require(claimableAmount > 0, "No funds available to withdraw");

        // Update state before external transfer (Prevents Reentrancy attacks)
        stream.withdrawnAmount += claimableAmount;

        // Transfer the unlocked tokens to the employee
        stream.token.transfer(stream.employee, claimableAmount);

        emit TokensWithdrawn(_streamId, claimableAmount);
    }
}
