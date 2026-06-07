// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Arc Network — EVM-compatible L1, USDC as native gas (Chain ID 5042002)
// Builder: @riyadhisla58886 | https://x.com/riyadhisla58886
//
// Arc-specific notes:
//  • All "ETH" entry points (addLiquidityNative / swapExactNative*) operate
//    on native USDC — msg.value is denominated in native USDC (18-decimal).
//  • The WETH address passed to the constructor should be the WUSDC contract.
//  • No PREVRANDAO randomness is used.
//  • Deterministic finality — no need to wait multiple confirmations.

import { IDEXFactory }  from "../interfaces/IDEXFactory.sol";
import { IDEXPair }     from "../interfaces/IDEXPair.sol";
import { IWETH }        from "../interfaces/IWETH.sol";
import { DEXLibrary }   from "./DEXLibrary.sol";
import { IERC20 }       from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 }    from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract DEXRouter {
    using SafeERC20 for IERC20;

    // ── Immutables ───────────────────────────────────────────────────────────
    address public immutable factory;
    /// @dev On Arc this is the WUSDC (wrapped native USDC) contract address.
    address public immutable WETH;

    // ── Errors / modifiers ───────────────────────────────────────────────────
    modifier ensure(uint256 deadline) {
        require(deadline >= block.timestamp, "DEXRouter: EXPIRED");
        _;
    }

    constructor(address _factory, address _WETH) {
        factory = _factory;
        WETH    = _WETH;
    }

    receive() external payable {
        // Accept native USDC refunds only from the WUSDC contract
        assert(msg.sender == WETH);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  INTERNAL HELPERS
    // ═══════════════════════════════════════════════════════════════════════

    function _addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin
    ) internal returns (uint256 amountA, uint256 amountB) {
        if (IDEXFactory(factory).getPair(tokenA, tokenB) == address(0)) {
            IDEXFactory(factory).createPair(tokenA, tokenB);
        }
        (uint256 reserveA, uint256 reserveB) = DEXLibrary.getReserves(factory, tokenA, tokenB);
        if (reserveA == 0 && reserveB == 0) {
            (amountA, amountB) = (amountADesired, amountBDesired);
        } else {
            uint256 amountBOptimal = DEXLibrary.quote(amountADesired, reserveA, reserveB);
            if (amountBOptimal <= amountBDesired) {
                require(amountBOptimal >= amountBMin, "DEXRouter: INSUFFICIENT_B_AMOUNT");
                (amountA, amountB) = (amountADesired, amountBOptimal);
            } else {
                uint256 amountAOptimal = DEXLibrary.quote(amountBDesired, reserveB, reserveA);
                require(amountAOptimal <= amountADesired, "DEXRouter: EXCESSIVE_A_AMOUNT");
                require(amountAOptimal >= amountAMin, "DEXRouter: INSUFFICIENT_A_AMOUNT");
                (amountA, amountB) = (amountAOptimal, amountBDesired);
            }
        }
    }

    function _swap(uint256[] memory amounts, address[] memory path, address _to) internal {
        for (uint256 i; i < path.length - 1; i++) {
            (address input, address output) = (path[i], path[i + 1]);
            (address token0,) = DEXLibrary.sortTokens(input, output);
            uint256 amountOut = amounts[i + 1];
            (uint256 amount0Out, uint256 amount1Out) = input == token0
                ? (uint256(0), amountOut)
                : (amountOut, uint256(0));
            address to = i < path.length - 2
                ? DEXLibrary.pairFor(factory, output, path[i + 2])
                : _to;
            IDEXPair(DEXLibrary.pairFor(factory, input, output)).swap(
                amount0Out, amount1Out, to, new bytes(0)
            );
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  ADD LIQUIDITY — ERC-20 / ERC-20
    // ═══════════════════════════════════════════════════════════════════════

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint256 amountADesired,
        uint256 amountBDesired,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) external ensure(deadline) returns (uint256 amountA, uint256 amountB, uint256 liquidity) {
        (amountA, amountB) = _addLiquidity(tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin);
        address pair = DEXLibrary.pairFor(factory, tokenA, tokenB);
        IERC20(tokenA).safeTransferFrom(msg.sender, pair, amountA);
        IERC20(tokenB).safeTransferFrom(msg.sender, pair, amountB);
        liquidity = IDEXPair(pair).mint(to);
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  ADD LIQUIDITY — Native USDC + ERC-20
    //  (On Arc: msg.value is native USDC in 18-decimal units)
    // ═══════════════════════════════════════════════════════════════════════

    function addLiquidityNative(
        address token,
        uint256 amountTokenDesired,
        uint256 amountTokenMin,
        uint256 amountNativeMin,
        address to,
        uint256 deadline
    ) external payable ensure(deadline)
      returns (uint256 amountToken, uint256 amountNative, uint256 liquidity)
    {
        (amountToken, amountNative) = _addLiquidity(
            token, WETH, amountTokenDesired, msg.value, amountTokenMin, amountNativeMin
        );
        address pair = DEXLibrary.pairFor(factory, token, WETH);
        IERC20(token).safeTransferFrom(msg.sender, pair, amountToken);
        IWETH(WETH).deposit{value: amountNative}();
        IERC20(WETH).safeTransfer(pair, amountNative);
        liquidity = IDEXPair(pair).mint(to);
        // Refund excess native USDC
        if (msg.value > amountNative) {
            (bool ok,) = msg.sender.call{value: msg.value - amountNative}("");
            require(ok, "DEXRouter: NATIVE_REFUND_FAILED");
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  REMOVE LIQUIDITY — ERC-20 / ERC-20
    // ═══════════════════════════════════════════════════════════════════════

    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint256 liquidity,
        uint256 amountAMin,
        uint256 amountBMin,
        address to,
        uint256 deadline
    ) public ensure(deadline) returns (uint256 amountA, uint256 amountB) {
        address pair = DEXLibrary.pairFor(factory, tokenA, tokenB);
        IERC20(pair).safeTransferFrom(msg.sender, pair, liquidity);
        (uint256 amount0, uint256 amount1) = IDEXPair(pair).burn(to);
        (address token0,) = DEXLibrary.sortTokens(tokenA, tokenB);
        (amountA, amountB) = tokenA == token0 ? (amount0, amount1) : (amount1, amount0);
        require(amountA >= amountAMin, "DEXRouter: INSUFFICIENT_A_AMOUNT");
        require(amountB >= amountBMin, "DEXRouter: INSUFFICIENT_B_AMOUNT");
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  REMOVE LIQUIDITY — Native USDC + ERC-20
    // ═══════════════════════════════════════════════════════════════════════

    function removeLiquidityNative(
        address token,
        uint256 liquidity,
        uint256 amountTokenMin,
        uint256 amountNativeMin,
        address to,
        uint256 deadline
    ) public ensure(deadline) returns (uint256 amountToken, uint256 amountNative) {
        (amountToken, amountNative) = removeLiquidity(
            token, WETH, liquidity, amountTokenMin, amountNativeMin, address(this), deadline
        );
        IERC20(token).safeTransfer(to, amountToken);
        IWETH(WETH).withdraw(amountNative);
        (bool ok,) = to.call{value: amountNative}("");
        require(ok, "DEXRouter: NATIVE_TRANSFER_FAILED");
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  SWAP — exact input
    // ═══════════════════════════════════════════════════════════════════════

    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external ensure(deadline) returns (uint256[] memory amounts) {
        amounts = DEXLibrary.getAmountsOut(factory, amountIn, path);
        require(amounts[amounts.length - 1] >= amountOutMin, "DEXRouter: INSUFFICIENT_OUTPUT_AMOUNT");
        IERC20(path[0]).safeTransferFrom(msg.sender, DEXLibrary.pairFor(factory, path[0], path[1]), amounts[0]);
        _swap(amounts, path, to);
    }

    /// @notice Swap exact native USDC for tokens.
    function swapExactNativeForTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable ensure(deadline) returns (uint256[] memory amounts) {
        require(path[0] == WETH, "DEXRouter: INVALID_PATH");
        amounts = DEXLibrary.getAmountsOut(factory, msg.value, path);
        require(amounts[amounts.length - 1] >= amountOutMin, "DEXRouter: INSUFFICIENT_OUTPUT_AMOUNT");
        IWETH(WETH).deposit{value: amounts[0]}();
        IERC20(WETH).safeTransfer(DEXLibrary.pairFor(factory, path[0], path[1]), amounts[0]);
        _swap(amounts, path, to);
    }

    /// @notice Swap exact tokens for native USDC.
    function swapExactTokensForNative(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external ensure(deadline) returns (uint256[] memory amounts) {
        require(path[path.length - 1] == WETH, "DEXRouter: INVALID_PATH");
        amounts = DEXLibrary.getAmountsOut(factory, amountIn, path);
        require(amounts[amounts.length - 1] >= amountOutMin, "DEXRouter: INSUFFICIENT_OUTPUT_AMOUNT");
        IERC20(path[0]).safeTransferFrom(msg.sender, DEXLibrary.pairFor(factory, path[0], path[1]), amounts[0]);
        _swap(amounts, path, address(this));
        IWETH(WETH).withdraw(amounts[amounts.length - 1]);
        (bool ok,) = to.call{value: amounts[amounts.length - 1]}("");
        require(ok, "DEXRouter: NATIVE_TRANSFER_FAILED");
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  SWAP — exact output
    // ═══════════════════════════════════════════════════════════════════════

    function swapTokensForExactTokens(
        uint256 amountOut,
        uint256 amountInMax,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external ensure(deadline) returns (uint256[] memory amounts) {
        amounts = DEXLibrary.getAmountsIn(factory, amountOut, path);
        require(amounts[0] <= amountInMax, "DEXRouter: EXCESSIVE_INPUT_AMOUNT");
        IERC20(path[0]).safeTransferFrom(msg.sender, DEXLibrary.pairFor(factory, path[0], path[1]), amounts[0]);
        _swap(amounts, path, to);
    }

    /// @notice Swap native USDC for exact tokens.
    function swapNativeForExactTokens(
        uint256 amountOut,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable ensure(deadline) returns (uint256[] memory amounts) {
        require(path[0] == WETH, "DEXRouter: INVALID_PATH");
        amounts = DEXLibrary.getAmountsIn(factory, amountOut, path);
        require(amounts[0] <= msg.value, "DEXRouter: EXCESSIVE_INPUT_AMOUNT");
        IWETH(WETH).deposit{value: amounts[0]}();
        IERC20(WETH).safeTransfer(DEXLibrary.pairFor(factory, path[0], path[1]), amounts[0]);
        _swap(amounts, path, to);
        // Refund excess native USDC
        if (msg.value > amounts[0]) {
            (bool ok,) = msg.sender.call{value: msg.value - amounts[0]}("");
            require(ok, "DEXRouter: NATIVE_REFUND_FAILED");
        }
    }

    // ═══════════════════════════════════════════════════════════════════════
    //  VIEW HELPERS
    // ═══════════════════════════════════════════════════════════════════════

    function quote(uint256 amountA, uint256 reserveA, uint256 reserveB)
        external pure returns (uint256) {
        return DEXLibrary.quote(amountA, reserveA, reserveB);
    }

    function getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut)
        external pure returns (uint256) {
        return DEXLibrary.getAmountOut(amountIn, reserveIn, reserveOut);
    }

    function getAmountIn(uint256 amountOut, uint256 reserveIn, uint256 reserveOut)
        external pure returns (uint256) {
        return DEXLibrary.getAmountIn(amountOut, reserveIn, reserveOut);
    }

    function getAmountsOut(uint256 amountIn, address[] calldata path)
        external view returns (uint256[] memory) {
        return DEXLibrary.getAmountsOut(factory, amountIn, path);
    }

    function getAmountsIn(uint256 amountOut, address[] calldata path)
        external view returns (uint256[] memory) {
        return DEXLibrary.getAmountsIn(factory, amountOut, path);
    }
}
