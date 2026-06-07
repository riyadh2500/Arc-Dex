// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Arc Network — EVM-compatible L1, USDC as native gas (Chain ID 5042002)
// https://docs.arc.io
//
// On Arc, the native token is USDC (6 decimals in ERC-20 form, 18 in native).
// This interface wraps native USDC into a plain ERC-20 so the Router can treat
// it like any other token — analogous to WETH on Ethereum.
//
// NOTE: Because Arc's native USDC already exposes an ERC-20 interface, a full
// WUSDC wrapper is only needed for the DEX Router's ETH-like entry points.
// For pure ERC-20 pools you can skip this entirely.

interface IWETH {
    /// @notice Wrap native USDC → WUSDC (call with msg.value in native USDC units).
    function deposit() external payable;

    /// @notice Unwrap WUSDC → native USDC.
    function withdraw(uint256 amount) external;

    // ── Minimal ERC-20 ───────────────────────────────────────────────────────
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}
