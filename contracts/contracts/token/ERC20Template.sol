// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Arc Network — EVM-compatible L1, USDC as native gas (Chain ID 5042002)
// Builder: @riyadhisla58886 | https://x.com/riyadhisla58886

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title ERC20Template
/// @notice Cloneable ERC-20 token deployed by TokenFactory on Arc.
contract ERC20Template is ERC20, Ownable {
    uint8   private _decimals;
    string  public  logoURI;

    constructor(
        string memory name_,
        string memory symbol_,
        uint8  decimals_,
        uint256 totalSupply_,
        string memory logoURI_,
        address creator
    ) ERC20(name_, symbol_) {
        _transferOwnership(creator);
        _decimals = decimals_;
        logoURI   = logoURI_;
        _mint(creator, totalSupply_);
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    /// @notice Owner can update the logo URI (e.g. to a new IPFS pin).
    function setLogoURI(string calldata uri) external onlyOwner {
        logoURI = uri;
    }
}
