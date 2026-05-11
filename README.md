// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ArcSimpleDEX {
    IERC20 public tokenA;
    IERC20 public tokenB;

    uint200 public reserveA;
    uint200 public reserveB;

    constructor(address _tokenA, address _tokenB) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }

    // Add Liquidity to the pool
    function addLiquidity(uint _amountA, uint _amountB) external {
        tokenA.transferFrom(msg.sender, address(this), _amountA);
        tokenB.transferFrom(msg.sender, address(this), _amountB);
        
        reserveA += uint200(_amountA);
        reserveB += uint200(_amountB);
    }

    // Swap Token A for Token B
    // Formula: (x + dx) * (y - dy) = x * y
    function swapAforB(uint _amountAIn) external returns (uint amountBOut) {
        require(_amountAIn > 0, "Amount must be > 0");
        
        // Calculate amount out using x * y = k
        uint amountAWithFee = (_amountAIn * 997) / 1000; // 0.3% fee
        amountBOut = (reserveB * amountAWithFee) / (reserveA + amountAWithFee);

        tokenA.transferFrom(msg.sender, address(this), _amountAIn);
        tokenB.transfer(msg.sender, amountBOut);

        reserveA += uint200(_amountAIn);
        reserveB -= uint200(amountBOut);
    }

    // Helper to check current price
    function getPrice(address _token) external view returns (uint) {
        return (_token == address(tokenA)) 
            ? (reserveB * 1e18) / reserveA 
            : (reserveA * 1e18) / reserveB;
    }
}# ARC2
