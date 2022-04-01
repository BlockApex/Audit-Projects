// // SPDX-License-Identifier: MIT
pragma solidity 0.7.6;
pragma abicoder v2;

import "../test/TestERC20.sol";
//import "../test/ERC20.sol";
import "../interfaces/external/IERC20.sol";
//import "../base/ERC721Permit.sol";
import "../base/UniswapLiquidityManager.sol";
//import "../interfaces/IUnipilot.sol";
//import "../interfaces/IHandler.sol";
import "../Unipilot.sol";
import "../UniStrategy.sol";
import "../V3Oracle.sol";
import "../base/ULMState.sol";
//import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

//import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
//import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";

contract SwapExamples {
    ISwapRouter public immutable swapRouter;

    // For this example, we will set the pool fee to 0.3%.
    uint24 public constant poolFee = 3000;

    constructor(ISwapRouter _swapRouter) {
        swapRouter = _swapRouter;
    }

    function swapExactInputSingle(
        uint256 amountIn,
        address _token0,
        address _token1
    ) external returns (uint256 amountOut) {
        TransferHelper.safeTransferFrom(_token0, msg.sender, address(this), amountIn);

        TransferHelper.safeApprove(_token0, address(swapRouter), amountIn);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: _token0,
                tokenOut: _token1,
                fee: poolFee,
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

contract Setup {
    address internal indexFund = 0x424A8F861a17CF1aF6F10136773588d745Cd0FaC;

    UniswapLiquidityManager public ulm;
    Unipilot public unipilot;
    ULMState public ulmState;
    V3Oracle public oracle;
    UniStrategy public uniStrategy;
    address public UniswapV3Factory = 0x5b1869D9A4C187F2EAa108f3062412ecf0526b24;
    SwapExamples public swap;

    constructor() {
        ulmState = new ULMState();
        oracle = new V3Oracle(address(ulmState));
        uniStrategy = new UniStrategy();

        ulm = new UniswapLiquidityManager(
            address(oracle),
            address(ulmState),
            indexFund,
            address(uniStrategy),
            UniswapV3Factory
        );

        unipilot = new Unipilot(address(ulm));
        ulm.initialize(address(unipilot));
        swap = new SwapExamples(ISwapRouter(0xCfEB869F69431e42cdB54A4F4f105C19C080A601));
    }
}

contract UnipilotUser {
    Setup public contracts;
    //SetupTokens public tokens;
    IHandler.DepositParams public depositParams;
    TestERC20 _token0;
    TestERC20 _token1;

    constructor(TestERC20 _token0_, TestERC20 _token1_) {
        contracts = new Setup();
        _token0 = _token0_;
        _token1 = _token1_;
    }

    struct nft {
        uint256 nftID;
    }

    mapping(address => nft) public nftData;

    function balance0() public view returns (uint256) {
        uint256 bal = _token0.balanceOf(address(this));
        return bal;
        // address tokenc0 = address(token1);
        // return tokenc0;
    }

    function balance1() public view returns (uint256) {
        uint256 bal = _token1.balanceOf(address(this));
        return bal;
        // address tokenc0 = address(token1);
        // return tokenc0;
    }

    function balance0fULM() public view returns (uint256) {
        uint256 bal = _token0.balanceOf(address(contracts.ulm()));
        return bal;
        // address tokenc0 = address(token1);
        // return tokenc0;
    }

    function balance1fULM() public view returns (uint256) {
        uint256 bal = _token1.balanceOf(address(contracts.ulm()));
        return bal;
        // address tokenc0 = address(token1);
        // return tokenc0;
    }

    function createpair(uint24 fee, uint160 sqrt) public returns (address pool) {
        //uint24 fee = 3000;
        //uint160 sqrt = 25052894984021797146183221489;

        pool = contracts.ulm().createPair(
            address(_token0),
            address(_token1),
            abi.encode(fee, sqrt)
        );
    }

    function depositT(uint24 fee, uint256 tokenId, uint256 amount0, uint256 amount1) public returns (uint256){
        //uint24 fee = 3000;
        //uint256 tokenId = 0;
        if (address(_token0) > address(_token1)) {
            (_token0, _token1) = (_token1, _token0);
        }

        (, , , , uint256 mintedTokenId) = contracts.unipilot().deposit(
            IHandler.DepositParams({
                sender: address(this),
                exchangeAddress: address(contracts.ulm()),
                token0: address(_token0),
                token1: address(_token1),
                amount0Desired: amount0,
                amount1Desired: amount1
            }),
            abi.encode(fee, tokenId)
        );

        nftData[address(this)].nftID = mintedTokenId;

        return mintedTokenId;
    }

    function swapNigga(uint256 loop) public returns (uint256 amoutout) {
        for (uint256 i = 0; i < loop; i++) {
            uint256 amountin = 100;
            amoutout = contracts.swap().swapExactInputSingle(
                amountin,
                address(_token0),
                address(_token1)
            );
        }
    }

    function collectO() public {
        contracts.unipilot().collect(
            IHandler.CollectParams({
                pilotToken: false,
                wethToken: false,
                exchangeAddress: address(contracts.ulm()),
                tokenId: nftData[address(this)].nftID
            }),
            abi.encode(address(this))
        );
    }

    function shouldrebase(uint24 _fee) public view returns(bool nod){
       
        address pool = contracts.ulm().getPoolAddress(
            address(_token0),
            address(_token1),
            _fee
        );
        nod = contracts.ulmState().shouldReadjust(
            pool, 
            address(contracts.ulm())
        );
    }

    function rebase() public {
        uint24 fee = 3000;
        bool nod = shouldrebase(fee);
        if(nod){
            contracts.ulm().readjustLiquidity(
                address(_token0), 
                address(_token1), 
                fee
            );
        }
    }

    function withdrawal(uint256 _nft) public {
        (, , uint256 userLiquidity, , , , ) = IUniswapLiquidityManager(contracts.ulm()).positions(_nft);
        // require(removeLiquidity <= userLiquidity, "you asked for too much");
        contracts.unipilot().withdraw(
            IHandler.WithdrawParams({
                pilotToken: false,
                wethToken: false,
                exchangeAddress: address(contracts.ulm()),
                liquidity: userLiquidity,
                tokenId: _nft
            }),
            abi.encode(address(this))
        );
    }

    // function DepositeDust () public {
    //     createpair();
    //     depositT();
    //     uint256 bal0 = balance0fULM();
    //     uint256 bal1 = balance1fULM();
    //     assert(bal0 == 0 && bal1 == 0);
    // }

    // function DepWithDust () public {
    //     createpair();
    //     depositT();
    //     withdrawal();
    //     uint256 bal0 = balance0fULM();
    //     uint256 bal1 = balance1fULM();
    //     assert(bal0 == 0 && bal1 == 0);
    // }

    // function collectDust () public {
    //     createpair();
    //     depositT();
    //     swapNigga(8);
    //     collect0();
    //     uint256 bal0 = balance0fULM();
    //     uint256 bal1 = balance1fULM();
    //     assert(bal0 == 0 && bal1 == 0);
    // }

    // function WithColDust () public {
    //     createpair();
    //     depositT();
    //     swapNigga(8);
    //     withdrawal();
    //     uint256 bal0 = balance0fULM();
    //     uint256 bal1 = balance1fULM();
    //     assert(bal0 == 0 && bal1 == 0);
    // }
}

contract E2E {

    UnipilotUser[10] public user;
    uint256[] public nftID;
    address public pool;
    uint256 public nft; 
    TestERC20 public token0;
    TestERC20 public token1;
    bool usercreated;

    bool minted;

    constructor () {
        token0 = new TestERC20(1e12 ether);
        token1 = new TestERC20(1e12 ether);
        
        cPair_Test();
    }

    struct PoolParams {
        uint24 fee;
        int24 tickSpacing;
        int24 minTick;
        int24 maxTick;
        uint24 tickCount;
        uint160 startPrice;
        int24 startTick;
    }


    PoolParams poolParams;

    function createUser() internal {
        
        // if(!usercreated){
            for(uint256 i = 0 ; i < 10; i++){ 
                user[i] =  new UnipilotUser(token0, token1);
                token0.mint(address(user[i]), 100000 ether);
                token1.mint(address(user[i]), 100000 ether);

            }
            // usercreated = true;
        // }
    }

    function balance() public view returns(uint256 bal) {
        bal = user[1].balance0();
    }

    function balancePool() public view returns(uint256 bal) {
        bal = token0.balanceOf(address(pool));
    }

    function balanceULM() public view returns(uint256 bal) {
        bal = user[1].balance0fULM();
    }

    function forgePoolParams(uint128 _seed) internal view returns (PoolParams memory _poolParams) {
        //
        // decide on one of the three fees, and corresponding tickSpacing
        //
        if (_seed % 3 == 0) {
            _poolParams.fee = uint24(500);
            _poolParams.tickSpacing = int24(10);
        } else if (_seed % 3 == 1) {
            _poolParams.fee = uint24(3000);
            _poolParams.tickSpacing = int24(60);
        } else if (_seed % 3 == 2) {
            _poolParams.fee = uint24(10000);
            _poolParams.tickSpacing = int24(2000);
        }

        _poolParams.maxTick = (int24(887272) / _poolParams.tickSpacing) * _poolParams.tickSpacing;
        _poolParams.minTick = -_poolParams.maxTick;
        _poolParams.tickCount = uint24(_poolParams.maxTick / _poolParams.tickSpacing);

        //
        // set the initial price
        //
        _poolParams.startTick = int24((_seed % uint128(_poolParams.tickCount)) * uint128(_poolParams.tickSpacing));
        if (_seed % 3 == 0) {
            // set below 0
            _poolParams.startPrice = TickMath.getSqrtRatioAtTick(-_poolParams.startTick);
        } else if (_seed % 3 == 1) {
            // set at 0
            _poolParams.startPrice = TickMath.getSqrtRatioAtTick(0);
            _poolParams.startTick = 0;
        } else if (_seed % 3 == 2) {
            // set above 0
            _poolParams.startPrice = TickMath.getSqrtRatioAtTick(_poolParams.startTick);
        }
    }

    function cPair_Test() internal {
        // if(!minted){
            createUser();
            uint128 _seed = 15;    
            poolParams = forgePoolParams(_seed);
       
            pool =   user[1].createpair(poolParams.fee, poolParams.startPrice);

            // minted = true;
        // }

    }

    function deposite_init() public payable {
          for(uint256 j = 0 ; j < 2 ; j++ ){
            nft = user[1].depositT(poolParams.fee, 0 , 1000 ether,1000 ether);
            nftID.push(nft);
           
         }
        
    }

    function dwap() public {
       // user[1].swapNigga(8);
    }


    function deposite_Test(uint128 _seed, uint256 _amount0, uint256 _amount1) public {
            //cPair_Test(); 
            //deposite_init();
        for(uint256 k = 0; k < 10 ; k++){
            user[k].depositT(poolParams.fee ,nftID[k+1], _amount0, _amount1);
            uint256 bal0 = user[k].balance0fULM();
            uint256 bal1 = user[k].balance1fULM();
            assert(bal0 == 0 && bal1 == 0);
        }
        
    }

    function withdraw_test() public {
        for (uint256 index = 0; index < nftID.length; index++) {
            user[1].withdrawal(index+1);
        }
        
    }

}
