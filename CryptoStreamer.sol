// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/Math; // Added for safe math operations

// Custom Errors for Gas Optimization
error InvalidEmployeeAddress();
error CannotStreamToYourself();
error AmountMustBeGreaterThanZero();
error DurationMustBeGreaterThanZero();
error OnlyEmployeeCanWithdraw();
error NoFundsAvailable();

contract CryptoStreamer {
    using Math for uint256; // Using Math library
    
    struct Stream {
        address employer;       
        address employee;       
        uint256 totalAmount;    
        uint256 startTime;      
        uint256 endTime;        
        uint256 withdrawnAmount;
        IERC20 token;           
    }

    uint256 public nextStreamId;
    mapping(uint256 => Stream) public streams;

    event StreamCreated(uint256 indexed streamId, address indexed employer, address indexed employee);
    event TokensWithdrawn(uint256 indexed streamId, uint256 amount);

    function createStream(
        address _employee, 
        uint256 _totalAmount, 
        IERC20 _token, 
        uint256 _durationSeconds
    ) external returns (uint256) {
        if (_employee == address(0)) revert InvalidEmployeeAddress();
        if (_employee == msg.sender) revert CannotStreamToYourself();
        if (_totalAmount == 0) revert AmountMustBeGreaterThanZero();
        if (_durationSeconds == 0) revert DurationMustBeGreaterThanZero();

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

    function balanceOf(uint256 _streamId) public view returns (uint256) {
        Stream memory stream = streams[_streamId];

        if (block.timestamp <= stream.startTime) {
            return 0;
        }

        if (block.timestamp >= stream.endTime) {
            return stream.totalAmount - stream.withdrawnAmount;
        }

        uint256 timeElapsed = block.timestamp - stream.startTime;
        uint256 totalDuration = stream.endTime - stream.startTime;
        
        // Safe mulDiv to prevent any overflow issues
        uint256 totalUnlocked = timeElapsed.mulDiv(stream.totalAmount, totalDuration);
        
        return totalUnlocked - stream.withdrawnAmount;
    }

    function withdraw(uint256 _streamId) external {
        Stream storage stream = streams[_streamId];
        if (msg.sender != stream.employee) revert OnlyEmployeeCanWithdraw();

        uint256 claimableAmount = balanceOf(_streamId);
        if (claimableAmount == 0) revert NoFundsAvailable();

        stream.withdrawnAmount += claimableAmount;
        stream.token.transfer(stream.employee, claimableAmount);

        emit TokensWithdrawn(_streamId, claimableAmount);
    }
}
