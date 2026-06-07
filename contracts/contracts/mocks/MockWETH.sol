// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Arc Network — EVM-compatible L1, USDC as native gas (Chain ID 5042002)
// Builder: @riyadhisla58886 | https://x.com/riyadhisla58886
//
// On Arc the native gas token is USDC (not ETH).
// This MockWUSDC contract wraps native USDC (sent as msg.value) into an
// ERC-20 so the DEXRouter can handle native↔ERC-20 swaps uniformly.
//
// Native USDC decimals : 18  (used for msg.value / gas accounting)
// ERC-20 USDC decimals :  6  (standard USDC representation)
//
// This wrapper uses 18 decimals to match msg.value units so the Router
// needs no decimal conversion when depositing/withdrawing.

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockWETH is ERC20 {
    // Arc: renamed symbol to WUSDC to reflect the wrapped native asset
    constructor() ERC20("Wrapped USDC (Arc)", "WUSDC") {}

    /// @notice Wraps native USDC → WUSDC (1:1, 18-decimal native units).
    function deposit() external payable {
        _mint(msg.sender, msg.value);
    }

    /// @notice Unwraps WUSDC → native USDC.
    function withdraw(uint256 amount) external {
        _burn(msg.sender, amount);
        (bool ok,) = msg.sender.call{value: amount}("");
        require(ok, "WUSDC: ETH_TRANSFER_FAILED");
    }

    receive() external payable {
        _mint(msg.sender, msg.value);
    }
}
