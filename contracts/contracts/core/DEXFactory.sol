// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Arc Network — EVM-compatible L1, USDC as native gas (Chain ID 5042002)
// https://docs.arc.io

import { IDEXFactory } from "../interfaces/IDEXFactory.sol";
import { DEXPair }     from "./DEXPair.sol";

contract DEXFactory is IDEXFactory {
    address public feeTo;
    address public feeToSetter;

    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs;

    constructor(address _feeToSetter) {
        feeToSetter = _feeToSetter;
    }

    function allPairsLength() external view returns (uint256) {
        return allPairs.length;
    }

    // ── Create pair ──────────────────────────────────────────────────────────

    function createPair(address tokenA, address tokenB) external returns (address pair) {
        require(tokenA != tokenB, "DEX: IDENTICAL_ADDRESSES");

        (address token0, address token1) = tokenA < tokenB
            ? (tokenA, tokenB)
            : (tokenB, tokenA);

        require(token0 != address(0), "DEX: ZERO_ADDRESS");
        require(getPair[token0][token1] == address(0), "DEX: PAIR_EXISTS");

        // Deploy pair with CREATE2 so the address is deterministic.
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        pair = address(new DEXPair{salt: salt}());

        DEXPair(pair).initialize(token0, token1);

        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair; // reverse mapping
        allPairs.push(pair);

        emit PairCreated(token0, token1, pair, allPairs.length);
    }

    // ── Fee management ───────────────────────────────────────────────────────

    function setFeeTo(address _feeTo) external {
        require(msg.sender == feeToSetter, "DEX: FORBIDDEN");
        feeTo = _feeTo;
    }

    function setFeeToSetter(address _feeToSetter) external {
        require(msg.sender == feeToSetter, "DEX: FORBIDDEN");
        feeToSetter = _feeToSetter;
    }
}
