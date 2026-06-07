// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Arc Network — EVM-compatible L1, USDC as native gas (Chain ID 5042002)
// https://docs.arc.io

interface IDEXCallee {
    /// @notice Called on the recipient of a flash swap.
    /// @param sender   The address that initiated the swap.
    /// @param amount0  Amount of token0 sent to the callee.
    /// @param amount1  Amount of token1 sent to the callee.
    /// @param data     Arbitrary data forwarded from the swap call.
    function dexCall(
        address sender,
        uint256 amount0,
        uint256 amount1,
        bytes calldata data
    ) external;
}
