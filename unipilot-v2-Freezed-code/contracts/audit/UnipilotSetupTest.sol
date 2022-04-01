// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma abicoder v2;

import { encodePriceSqrt } from "./utils/Math.sol";
import "../test/TestERC20.sol";
import "../UnipilotStrategy.sol";
import "../UnipilotActiveVault.sol";
import "../UnipilotPassiveVault.sol";
import "../UnipilotActiveFactory.sol";
import "../UnipilotPassiveFactory.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

interface Vm {
    function expectEmit(
        bool,
        bool,
        bool,
        bool
    ) external;

    function expectRevert(bytes memory) external;

    function prank(address) external;

    function warp(uint256) external;

    function startPrank(address) external;

    function roll(uint256) external;

    function stopPrank() external;

    function deal(address, uint256) external;

    function addr(uint256) external returns (address);

    function getCode(string calldata) external returns (bytes memory);
}

contract Test {
    Vm public constant vm =
        Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    function deployCode(string memory what) public returns (address addr) {
        bytes memory bytecode = vm.getCode(what);
        assembly {
            addr := create(0, add(bytecode, 0x20), mload(bytecode))
        }
    }
}

contract SwapImpl {
    ISwapRouter public immutable swapRouter;

    // For this example, we will set the pool fee to 0.3%.
    uint24 public constant poolFee = 3000;

    constructor(ISwapRouter _swapRouter) {
        swapRouter = _swapRouter;
    }

    function swapExactInputSingle(
        uint256 amountIn,
        address _token0,
        address _token1,
        uint24 _fee
    ) external returns (uint256 amountOut) {
        TransferHelper.safeTransferFrom(
            _token0,
            msg.sender,
            address(this),
            amountIn
        );

        TransferHelper.safeApprove(_token0, address(swapRouter), amountIn);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: _token0,
                tokenOut: _token1,
                fee: _fee,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        // The call to `exactInputSingle` executes the swap.
        amountOut = swapRouter.exactInputSingle(params);
    }
}

contract ActiveTesting is Test {
    TestERC20 token0;
    TestERC20 token1;

    SwapImpl swap;

    UnipilotStrategy us;
    
    UnipilotActiveVault uav;
    UnipilotPassiveVault upv;
    
    UnipilotActiveFactory uaf;
    UnipilotPassiveFactory upf;

    struct TicksData {
        int24 baseTickLower;
        int24 baseTickUpper;
        int24 rangeTickLower;
        int24 rangeTickUpper;
    }

    TicksData public td;

    address pool;
    address[] poolarr;
    int24[] tickarr;

    address weth9 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    address v3Factory = 0x1F98431c8aD98523631AE4a59f267346ea31F984;

    address governance = vm.addr(1);
    address indexFund = vm.addr(2);
    address newGov = vm.addr(3);
    address newIF = vm.addr(4);

    address user1 = vm.addr(5);
    address user2 = vm.addr(6);
    address user3 = vm.addr(7);
    address user4 = vm.addr(8);
    address user5 = vm.addr(9);
    address userx = vm.addr(10);

    function setUp() public virtual {
        initSetup(governance, indexFund);

        token0 = new TestERC20(1e12 ether);
        token1 = new TestERC20(1e12 ether);
        swap = new SwapImpl(
            ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564)
        );
        token0.transfer(user1, 100000 ether);
        token1.transfer(user1, 100000 ether);
        token0.transfer(user2, 100000 ether);
        token1.transfer(user2, 100000 ether);
        token0.transfer(user3, 100000 ether);
        token1.transfer(user3, 100000 ether);
        token0.transfer(user4, 100000 ether);
        token1.transfer(user4, 100000 ether);
        token0.transfer(user5, 100000 ether);
        token1.transfer(user5, 100000 ether);

        token0.transfer(userx, 100000 ether);
        token1.transfer(userx, 100000 ether);
    }

    function swapFunction(
        address _token0,
        address _token1,
        uint256 _amountIn,
        uint24 _fee
    ) public {
        swap.swapExactInputSingle(_amountIn, _token0, _token1, _fee);
    }

    function initSetup(address _governance, address _indexFund) internal {
        us = new UnipilotStrategy(_governance);
        indexFund = _indexFund;
        uaf = new UnipilotActiveFactory(
            v3Factory, //v3factory
            _governance,
            address(us),
            _indexFund,
            weth9, //weth9
            10
        );
    }

    function setupActiveVault(
        address _token0,
        address _token1,
        uint24 _fee,
        uint160 _sqrtPrice,
        string memory _name,
        string memory _symbol
    ) internal returns (UnipilotActiveVault) {
        pool = IUniswapV3Factory(v3Factory).createPool(_token0, _token1, _fee);
        IUniswapV3Pool(pool).initialize(_sqrtPrice);

        poolarr.push(pool);
        tickarr.push(600);

        us.setBaseTicks(poolarr, tickarr);

        uav = new UnipilotActiveVault(
            pool,
            address(uaf),
            weth9,
            governance,
            _name,
            _symbol
        );

        uav.init();

        (
            td.baseTickLower,
            td.baseTickUpper,
            td.rangeTickLower,
            td.rangeTickUpper
        ) = uav.ticksData();

        return uav;
    }

    function setupPassiveVault(
        address _token0,
        address _token1,
        uint24 _fee,
        uint160 _sqrtPrice,
        string memory _name,
        string memory _symbol
    ) internal returns (UnipilotPassiveVault) {
        pool = IUniswapV3Factory(v3Factory).createPool(_token0, _token1, _fee);
        IUniswapV3Pool(pool).initialize(_sqrtPrice);

        upv = new UnipilotPassiveVault(
            pool,
            address(uaf),
            weth9,
            _name,
            _symbol
        );

        return upv;
    }


    function mintToV3(
        address recipient,
        address _pool,
        uint128 amount,
        address payer
    ) public {
        IUniswapV3Pool(_pool).mint(
            recipient,
            td.baseTickLower,
            td.baseTickUpper,
            amount,
            abi.encode(payer)
        );
    }
}
