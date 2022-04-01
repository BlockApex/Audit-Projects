// SPDX-License-Identifier: MIT
pragma solidity =0.7.6;
pragma abicoder v2;

import "@openzeppelin/contracts/math/Math.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "./base/ERC721Permit.sol";
import "./interfaces/IUnipilot.sol";
import "./base/PeripheryPayments.sol";

import "./interfaces/uniswap/IUniswapLiquidityManager.sol";

/// @title Unipilot is Universal liquidity optimizer
/// @notice Wraps all positions in ERC721 non-fungible token interface for all the liquidity managers of Unipilot
/// which are built on top of concentrated AMMs. Unipilot protocol aims to maximize the liquidity
/// earning of the users while saving gas fees and manual oversight.
/// @dev Unipilot acts as intermediary between the user who wants to provide liquidity to any pool
/// of any concentrated liquidity dexes & earn fees from such actions.
/// @dev It is the only contract with minting rights for PILOT.
/// @dev This contract has the rights for adding new managers
contract Unipilot is IUnipilot, ERC721Permit, PeripheryPayments {
    using SafeMath for uint256;

    string public testProp = "hello from inside unipilot";

    /// @dev The ID of the next token that will be minted. Skips 0
    uint256 private _nextId = 1;

    /// @dev The address of the Unipilot admin, which handles adding new managers for Unipilot protocol
    address public override governance;

    /// @dev returns the status of exchange managers added by this contract
    mapping(address => bool) public exchangeWhitelist;

    /// @param initialHandler uniswap liquidity manager contract address
    constructor(address initialHandler)
        ERC721Permit("Unipilot Positions NFT-V1", "PILOT-POS-V1", "1")
    {
        governance = msg.sender;
        exchangeWhitelist[initialHandler] = true;
    }

    IUniswapLiquidityManager public ulm;

    function initialize(address _ulm) public {
        ulm = IUniswapLiquidityManager(_ulm);
    }

    modifier isAuthorizedForToken(uint256 tokenId) {
        require(_isApprovedOrOwner(msg.sender, tokenId), "NA");
        _;
    }

    modifier onlyGovernance() {
        _isGovernance();
        _;
    }

    modifier onlyLiquidityManager() {
        _isLiquidityManager();
        _;
    }

    modifier isExchangeWhitelist(address handler) {
        _isExchangeWhitelist(handler);
        _;
    }

    /// @notice sets new address for the admin role
    function setGovernance(address _governance) external onlyGovernance {
        require(_governance != address(0), "IGA");
        governance = _governance;
    }

    /// @notice sets new liquidity manager address built on top of concentrated AMM
    function setExchangeAddress(address exchangeAddress) external onlyGovernance {
        require(exchangeAddress != address(0), "IEA");
        exchangeWhitelist[exchangeAddress] = true;
    }

    /// @notice Mints `mintedTokenId` for new liquidity position and transfers it to user.
    function mintUnipilotNFT(address sender)
        external
        override
        onlyLiquidityManager
        returns (uint256 mintedTokenId)
    {
        _mint(sender, (mintedTokenId = _nextId++));
    }

    /// @notice Creates `amount` PILOT tokens and assigns them to `recipient`
    /// @dev only liquidity managers have minter role
    function mintPilot(address recipient, uint256 amount)
        external
        override
        onlyLiquidityManager
    {
        if (amount > 0) IERC20(PILOT).mint(recipient, amount);
    }

    /// @notice Creates a new pool on respective dex if it does not exist also add the liquidity
    /// @dev Doing -1 in deposit amount0 becuase sometimes liquidity ratio becomes 1:1 & all liquidity is consumed
    /// by base liquidity no tokens left for range position
    /// @param params The params necessary to create pool & mint a position
    /// @param data data[0] required data for deposit & data[1] required data for pool creation on respective dex
    function createPoolAndDeposit(
        IHandler.DepositParams memory params,
        bytes[2] calldata data
    )
        external
        payable
        override
        isExchangeWhitelist(params.exchangeAddress)
        returns (
            uint256 amount0Base,
            uint256 amount1Base,
            uint256 amount0Range,
            uint256 amount1Range,
            uint256 mintedTokenId
        )
    {
        IHandler(params.exchangeAddress).createPair(
            params.token0,
            params.token1,
            data[0]
        );

        (address token0, address token1, uint256 amount0, uint256 amount1) = params
            .token0 < params.token1
            ? (params.token0, params.token1, params.amount0Desired, params.amount1Desired)
            : (
                params.token1,
                params.token0,
                params.amount1Desired,
                params.amount0Desired
            );

        (amount0Base, amount1Base, amount0Range, amount1Range, mintedTokenId) = deposit(
            IHandler.DepositParams({
                sender: params.sender,
                exchangeAddress: params.exchangeAddress,
                token0: token0,
                token1: token1,
                amount0Desired: amount0 - 1,
                amount1Desired: amount1
            }),
            data[1]
        );
    }

    /// @notice Withdraws the desired shares from the Unipilot's current ticks.
    /// @param params pilotToken: Will be true to collect equivalent amount fees in PILOT,
    /// wethToken: Will be false to collect fees in ETH for weth pairs only,
    /// exchangeAddress: Address of the liquidity manager to collect fees from,
    /// liquidity: Amount of shares burned by sender
    /// tokenId: The ID of the NFT for which tokens are being collected
    function withdraw(IHandler.WithdrawParams calldata params, bytes memory data)
        external
        payable
        isAuthorizedForToken(params.tokenId)
        isExchangeWhitelist(params.exchangeAddress)
    {
        IHandler(params.exchangeAddress).withdraw(
            params.pilotToken,
            params.wethToken,
            params.liquidity,
            params.tokenId,
            data
        );
    }

    /// @notice Collects accumulated user's fees.
    /// @param params pilotToken: Will be true to collect equivalent amount fees in PILOT,
    /// wethToken: Will be false to collect fees in ETH for weth pairs only,
    /// exchangeAddress: Address of the liquidity manager to collect fees from,
    /// tokenId: The ID of the NFT for which tokens are being collected
    function collect(IHandler.CollectParams calldata params, bytes memory data)
        external
        payable
        isAuthorizedForToken(params.tokenId)
        isExchangeWhitelist(params.exchangeAddress)
    {
        IHandler(params.exchangeAddress).collect(
            params.pilotToken,
            params.wethToken,
            params.tokenId,
            data
        );
    }

    /// @notice Deposits tokens in proportion to the Unipilot's current ticks.
    /// & creates a new Unipilot position wrapped in a NFT
    /// @param params The params necessary to mint a new position or increase liquidity in existing position,
    /// encoded as `DepositParams` in IHandler
    /// Pass tokenId 0 to mint new position & pass already minted token ID to increase liquidity in unipilot
    /// @param data Any data that should be passed through to the liquidity manager
    function deposit(IHandler.DepositParams memory params, bytes memory data)
        public
        payable
        override
        isExchangeWhitelist(params.exchangeAddress)
        returns (
            uint256 amount0Base,
            uint256 amount1Base,
            uint256 amount0Range,
            uint256 amount1Range,
            uint256 mintedTokenId
        )
    {
        require(params.amount0Desired > 0 || params.amount1Desired > 0, "IA");
        DepositVars memory depositVars;

        (
            depositVars.totalAmount0,
            depositVars.totalAmount1,
            depositVars.totalLiquidity
        ) = IHandler(params.exchangeAddress).getReserves(
            params.token0,
            params.token1,
            data
        );

        (
            depositVars.shares,
            depositVars.amount0,
            depositVars.amount1
        ) = getSharesAndAmounts(
            depositVars.totalAmount0,
            depositVars.totalAmount1,
            depositVars.totalLiquidity,
            params.amount0Desired,
            params.amount1Desired
        );

        require(depositVars.shares > 0, "IMA");

        if (depositVars.amount0 > 0)
            pay(params.token0, _msgSender(), params.exchangeAddress, depositVars.amount0);
        if (depositVars.amount1 > 0)
            pay(params.token1, _msgSender(), params.exchangeAddress, depositVars.amount1);


        (amount0Base, amount1Base, amount0Range, amount1Range, mintedTokenId) = IHandler(
            params.exchangeAddress
        ).deposit(
                params.token0,
                params.token1,
                params.sender,
                depositVars.amount0,
                depositVars.amount1,
                depositVars.shares,
                data
            );

    }

    function _getAndIncrementNonce(uint256 tokenId)
        internal
        pure
        override
        returns (uint256)
    {
        uint256 nonce = 0;
        return nonce++;
    }

    function _isGovernance() internal view {
        require(msg.sender == governance, "NG");
    }

    function _isLiquidityManager() internal view {
        require(exchangeWhitelist[msg.sender], "NLM");
    }

    function _isExchangeWhitelist(address _handler) internal view {
        require(exchangeWhitelist[_handler], "ENW");
    }

    /// @dev Calculates the largest possible `amount0` and `amount1` such that
    /// they're in the same proportion as total amounts, but not greater than
    /// `amount0Desired` and `amount1Desired` respectively.
    /// @dev Calculates the user shares depending on deposited amounts, reserves & total liquidity of pool
    /// which will fetched from respective manager
    function getSharesAndAmounts(
        uint256 totalAmount0,
        uint256 totalAmount1,
        uint256 totalLiquidity,
        uint256 amount0Desired,
        uint256 amount1Desired
    )
        public
        pure
        returns (
            uint256 shares,
            uint256 amount0,
            uint256 amount1
        )
    {

        // If total supply > 0, vault can't be empty
        assert(totalLiquidity == 0 || totalAmount0 > 0 || totalAmount1 > 0);

        if (totalLiquidity == 0) {

            // For first deposit, just use the amounts desired
            amount0 = amount0Desired;
            amount1 = amount1Desired;
            shares = Math.max(amount0, amount1);

        } else if (totalAmount0 == 0) {
            amount1 = amount1Desired;
            shares = amount1.mul(totalLiquidity).div(totalAmount1);
        } else if (totalAmount1 == 0) {
            amount0 = amount0Desired;
            shares = amount0.mul(totalLiquidity).div(totalAmount0);
        } else {
            uint256 cross = Math.min(
                amount0Desired.mul(totalAmount1),
                amount1Desired.mul(totalAmount0)
            );

            require(cross > 0, "CRS");

            // Round up amounts
            amount0 = cross.sub(1).div(totalAmount1).add(1);
            amount1 = cross.sub(1).div(totalAmount0).add(1);
            shares = cross.mul(totalLiquidity).div(totalAmount0).div(totalAmount1);
        }

        //assert(shares < totalLiquidity);
    }
}