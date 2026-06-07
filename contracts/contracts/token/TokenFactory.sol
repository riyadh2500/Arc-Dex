// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Arc Network — EVM-compatible L1, USDC as native gas (Chain ID 5042002)
// Builder: @riyadhisla58886 | https://x.com/riyadhisla58886
//
// Arc fee note:
//   creationFee is denominated in native USDC (18-decimal units at the msg.value
//   level).  Example: 0.5 USDC native = 500_000_000_000_000_000 (0.5e18).
//   The frontend env var NEXT_PUBLIC_TOKEN_CREATION_FEE_USDC should hold this
//   value as a human-readable string, e.g. "0.5".

import { ERC20Template } from "./ERC20Template.sol";
import { Ownable }       from "@openzeppelin/contracts/access/Ownable.sol";

contract TokenFactory is Ownable {
    // ── State ────────────────────────────────────────────────────────────────

    /// @notice Fee in native USDC (18-decimal) to deploy a token.
    uint256 public creationFee;

    /// @notice Address that receives collected creation fees.
    address public feeReceiver;

    /// @notice All tokens deployed through this factory.
    address[] public allTokens;

    /// @notice Tokens deployed by each creator.
    mapping(address => address[]) public tokensByCreator;

    // ── Events ───────────────────────────────────────────────────────────────
    event TokenCreated(
        address indexed token,
        address indexed creator,
        string  name,
        string  symbol,
        uint256 totalSupply
    );
    event CreationFeeUpdated(uint256 oldFee, uint256 newFee);
    event FeeReceiverUpdated(address oldReceiver, address newReceiver);

    // ── Constructor ──────────────────────────────────────────────────────────

    /// @param _creationFee  Fee in native USDC (e.g. 5e17 = 0.5 USDC).
    /// @param _feeReceiver  Wallet that collects creation fees.
    constructor(uint256 _creationFee, address _feeReceiver) {
        creationFee  = _creationFee;
        feeReceiver  = _feeReceiver;
    }

    // ── Token creation ───────────────────────────────────────────────────────

    /// @notice Deploy a new ERC-20 token. Caller must send `creationFee` in native USDC.
    function createToken(
        string  calldata name_,
        string  calldata symbol_,
        uint8            decimals_,
        uint256          totalSupply_,
        string  calldata logoURI_
    ) external payable returns (address token) {
        require(msg.value >= creationFee, "TokenFactory: INSUFFICIENT_FEE");
        require(totalSupply_ > 0,         "TokenFactory: ZERO_SUPPLY");
        require(decimals_ <= 18,          "TokenFactory: INVALID_DECIMALS");

        token = address(
            new ERC20Template(name_, symbol_, decimals_, totalSupply_, logoURI_, msg.sender)
        );

        allTokens.push(token);
        tokensByCreator[msg.sender].push(token);

        // Forward fee to receiver
        (bool ok,) = feeReceiver.call{value: msg.value}("");
        require(ok, "TokenFactory: FEE_TRANSFER_FAILED");

        emit TokenCreated(token, msg.sender, name_, symbol_, totalSupply_);
    }

    // ── Views ────────────────────────────────────────────────────────────────

    function allTokensLength() external view returns (uint256) {
        return allTokens.length;
    }

    function tokensByCreatorLength(address creator) external view returns (uint256) {
        return tokensByCreator[creator].length;
    }

    // ── Admin ────────────────────────────────────────────────────────────────

    function setCreationFee(uint256 newFee) external onlyOwner {
        emit CreationFeeUpdated(creationFee, newFee);
        creationFee = newFee;
    }

    function setFeeReceiver(address newReceiver) external onlyOwner {
        require(newReceiver != address(0), "TokenFactory: ZERO_ADDRESS");
        emit FeeReceiverUpdated(feeReceiver, newReceiver);
        feeReceiver = newReceiver;
    }
}
