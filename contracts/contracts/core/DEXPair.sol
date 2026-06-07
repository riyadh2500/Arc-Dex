// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Arc Network — EVM-compatible L1, USDC as native gas (Chain ID 5042002)
// https://docs.arc.io
//
// Arc-specific notes:
//  • block.prevrandao is always 0 — not used here (no randomness needed).
//  • Timestamps: wall-clock, sub-second blocks may share the same value.
//    We store uint32 block.timestamp % 2^32 for TWAP, same as Uniswap v2.
//  • No ETH/WETH in this contract — all swaps are ERC-20 ↔ ERC-20.
//    The Router wraps native USDC into WUSDC before calling here.

import { DEXErc20 }    from "./DEXErc20.sol";
import { IDEXFactory } from "../interfaces/IDEXFactory.sol";
import { IDEXCallee }  from "../interfaces/IDEXCallee.sol";
import { Math }        from "@openzeppelin/contracts/utils/math/Math.sol";
import { IERC20 }      from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DEXPair is DEXErc20 {
    using Math for uint256;

    // ── Constants ────────────────────────────────────────────────────────────
    uint256 public constant MINIMUM_LIQUIDITY = 1_000;

    // ── State ────────────────────────────────────────────────────────────────
    address public factory;
    address public token0;
    address public token1;

    uint112 private reserve0;
    uint112 private reserve1;
    uint32  private blockTimestampLast;

    uint256 public price0CumulativeLast;
    uint256 public price1CumulativeLast;
    uint256 public kLast; // reserve0 * reserve1 at last fee-mint event

    uint256 private unlocked = 1;

    // ── Events ───────────────────────────────────────────────────────────────
    event Mint(address indexed sender, uint256 amount0, uint256 amount1);
    event Burn(address indexed sender, uint256 amount0, uint256 amount1, address indexed to);
    event Swap(
        address indexed sender,
        uint256 amount0In,
        uint256 amount1In,
        uint256 amount0Out,
        uint256 amount1Out,
        address indexed to
    );
    event Sync(uint112 reserve0, uint112 reserve1);

    // ── Modifiers ────────────────────────────────────────────────────────────
    modifier lock() {
        require(unlocked == 1, "DEXPair: LOCKED");
        unlocked = 0;
        _;
        unlocked = 1;
    }

    constructor() {
        factory = msg.sender;
    }

    /// @notice Called once by the factory immediately after deployment.
    function initialize(address _token0, address _token1) external {
        require(msg.sender == factory, "DEXPair: FORBIDDEN");
        token0 = _token0;
        token1 = _token1;
    }

    // ── Views ────────────────────────────────────────────────────────────────

    function getReserves()
        public
        view
        returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast)
    {
        _reserve0          = reserve0;
        _reserve1          = reserve1;
        _blockTimestampLast = blockTimestampLast;
    }

    // ── Internal helpers ─────────────────────────────────────────────────────

    function _safeTransfer(address token, address to, uint256 value) private {
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSelector(IERC20.transfer.selector, to, value)
        );
        require(success && (data.length == 0 || abi.decode(data, (bool))), "DEXPair: TRANSFER_FAILED");
    }

    /// @dev Updates reserves and, on the first call per block, the TWAP accumulators.
    function _update(
        uint256 balance0,
        uint256 balance1,
        uint112 _reserve0,
        uint112 _reserve1
    ) private {
        require(balance0 <= type(uint112).max && balance1 <= type(uint112).max, "DEXPair: OVERFLOW");

        // Arc note: multiple blocks may share the same timestamp (sub-second blocks).
        // We accumulate only when time has advanced to avoid zero-division.
        uint32 blockTimestamp = uint32(block.timestamp % 2**32);
        uint32 timeElapsed    = blockTimestamp - blockTimestampLast;

        if (timeElapsed > 0 && _reserve0 != 0 && _reserve1 != 0) {
            // Overflow-safe TWAP accumulation (intentional uint overflow like Uniswap v2).
            // Note: Solidity doesn't support method chaining on library calls,
            // so we use explicit intermediate variables.
            unchecked {
                uint224 enc1 = UQ112x112.encode(_reserve1);
                uint224 enc0 = UQ112x112.encode(_reserve0);
                price0CumulativeLast += uint256(UQ112x112.uqdiv(enc1, _reserve0)) * timeElapsed;
                price1CumulativeLast += uint256(UQ112x112.uqdiv(enc0, _reserve1)) * timeElapsed;
            }
        }

        reserve0           = uint112(balance0);
        reserve1           = uint112(balance1);
        blockTimestampLast = blockTimestamp;

        emit Sync(reserve0, reserve1);
    }

    /// @dev Mints protocol fee LP tokens if feeTo is set.
    function _mintFee(uint112 _reserve0, uint112 _reserve1) private returns (bool feeOn) {
        address feeTo = IDEXFactory(factory).feeTo();
        feeOn = feeTo != address(0);
        uint256 _kLast = kLast;

        if (feeOn) {
            if (_kLast != 0) {
                uint256 rootK     = Math.sqrt(uint256(_reserve0) * uint256(_reserve1));
                uint256 rootKLast = Math.sqrt(_kLast);
                if (rootK > rootKLast) {
                    uint256 numerator   = totalSupply * (rootK - rootKLast);
                    uint256 denominator = rootK * 5 + rootKLast;
                    uint256 liquidity   = numerator / denominator;
                    if (liquidity > 0) _mint(feeTo, liquidity);
                }
            }
        } else if (_kLast != 0) {
            kLast = 0;
        }
    }

    // ── Core ─────────────────────────────────────────────────────────────────

    /// @notice Mint LP tokens. Tokens must be sent to this contract before calling.
    function mint(address to) external lock returns (uint256 liquidity) {
        (uint112 _reserve0, uint112 _reserve1,) = getReserves();
        uint256 balance0 = IERC20(token0).balanceOf(address(this));
        uint256 balance1 = IERC20(token1).balanceOf(address(this));
        uint256 amount0  = balance0 - _reserve0;
        uint256 amount1  = balance1 - _reserve1;

        bool feeOn    = _mintFee(_reserve0, _reserve1);
        uint256 _totalSupply = totalSupply;

        if (_totalSupply == 0) {
            liquidity = Math.sqrt(amount0 * amount1) - MINIMUM_LIQUIDITY;
            _mint(address(0), MINIMUM_LIQUIDITY); // permanently lock first MINIMUM_LIQUIDITY tokens
        } else {
            liquidity = Math.min(
                amount0 * _totalSupply / _reserve0,
                amount1 * _totalSupply / _reserve1
            );
        }

        require(liquidity > 0, "DEXPair: INSUFFICIENT_LIQUIDITY_MINTED");
        _mint(to, liquidity);

        _update(balance0, balance1, _reserve0, _reserve1);
        if (feeOn) kLast = uint256(reserve0) * uint256(reserve1);

        emit Mint(msg.sender, amount0, amount1);
    }

    /// @notice Burn LP tokens. LP tokens must be sent to this contract before calling.
    function burn(address to) external lock returns (uint256 amount0, uint256 amount1) {
        (uint112 _reserve0, uint112 _reserve1,) = getReserves();
        address _token0 = token0;
        address _token1 = token1;

        uint256 balance0  = IERC20(_token0).balanceOf(address(this));
        uint256 balance1  = IERC20(_token1).balanceOf(address(this));
        uint256 liquidity = balanceOf[address(this)];

        bool feeOn        = _mintFee(_reserve0, _reserve1);
        uint256 _totalSupply = totalSupply;

        amount0 = liquidity * balance0 / _totalSupply;
        amount1 = liquidity * balance1 / _totalSupply;

        require(amount0 > 0 && amount1 > 0, "DEXPair: INSUFFICIENT_LIQUIDITY_BURNED");

        _burn(address(this), liquidity);
        _safeTransfer(_token0, to, amount0);
        _safeTransfer(_token1, to, amount1);

        balance0 = IERC20(_token0).balanceOf(address(this));
        balance1 = IERC20(_token1).balanceOf(address(this));

        _update(balance0, balance1, _reserve0, _reserve1);
        if (feeOn) kLast = uint256(reserve0) * uint256(reserve1);

        emit Burn(msg.sender, amount0, amount1, to);
    }

    /// @notice Swap tokens. Tokens must be sent to this contract before calling.
    function swap(
        uint256 amount0Out,
        uint256 amount1Out,
        address to,
        bytes calldata data
    ) external lock {
        require(amount0Out > 0 || amount1Out > 0, "DEXPair: INSUFFICIENT_OUTPUT_AMOUNT");

        (uint112 _reserve0, uint112 _reserve1,) = getReserves();
        require(amount0Out < _reserve0 && amount1Out < _reserve1, "DEXPair: INSUFFICIENT_LIQUIDITY");

        address _token0 = token0;
        address _token1 = token1;
        require(to != _token0 && to != _token1, "DEXPair: INVALID_TO");

        if (amount0Out > 0) _safeTransfer(_token0, to, amount0Out);
        if (amount1Out > 0) _safeTransfer(_token1, to, amount1Out);

        // Flash-swap callback
        if (data.length > 0) IDEXCallee(to).dexCall(msg.sender, amount0Out, amount1Out, data);

        uint256 balance0 = IERC20(_token0).balanceOf(address(this));
        uint256 balance1 = IERC20(_token1).balanceOf(address(this));

        uint256 amount0In = balance0 > _reserve0 - amount0Out ? balance0 - (_reserve0 - amount0Out) : 0;
        uint256 amount1In = balance1 > _reserve1 - amount1Out ? balance1 - (_reserve1 - amount1Out) : 0;
        require(amount0In > 0 || amount1In > 0, "DEXPair: INSUFFICIENT_INPUT_AMOUNT");

        // 0.3 % fee check: balance * 1000 - amountIn * 3 >= reserve * 1000
        uint256 balance0Adjusted = balance0 * 1000 - amount0In * 3;
        uint256 balance1Adjusted = balance1 * 1000 - amount1In * 3;
        require(
            balance0Adjusted * balance1Adjusted >= uint256(_reserve0) * uint256(_reserve1) * 1_000_000,
            "DEXPair: K"
        );

        _update(balance0, balance1, _reserve0, _reserve1);

        emit Swap(msg.sender, amount0In, amount1In, amount0Out, amount1Out, to);
    }

    /// @notice Force balances to match reserves (skim surplus).
    function skim(address to) external lock {
        _safeTransfer(token0, to, IERC20(token0).balanceOf(address(this)) - reserve0);
        _safeTransfer(token1, to, IERC20(token1).balanceOf(address(this)) - reserve1);
    }

    /// @notice Force reserves to match balances.
    function sync() external lock {
        _update(
            IERC20(token0).balanceOf(address(this)),
            IERC20(token1).balanceOf(address(this)),
            reserve0,
            reserve1
        );
    }
}

// ── UQ112x112 fixed-point library (for TWAP) ─────────────────────────────────
library UQ112x112 {
    uint224 constant Q112 = 2**112;

    function encode(uint112 y) internal pure returns (uint224 z) {
        z = uint224(y) * Q112;
    }

    function uqdiv(uint224 x, uint112 y) internal pure returns (uint224 z) {
        z = x / uint224(y);
    }
}
