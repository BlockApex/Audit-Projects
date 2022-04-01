// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity =0.8.0;
import './hevm.sol';
import './Dapptools.sol';
import '../lib/ds-test/src/test.sol';

contract DapptoolsTest is DSTest {
    Dapptools dapping;
    Hevm hevm;

    constructor() {
        dapping = new Dapptools();
    }

    function setUp() public {
        hevm = Hevm(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D);
    }

    uint256[4][] savingArray;
    uint256[4][] testingArray;
    uint256 indexCount;

    uint256 MAX_STAKES = 10;
    uint256 MAX_STAKERS = 10;
    uint256 MAX_PER_STAKER = 10; // any staker can stake ten times

    mapping(address => mapping(uint256 => StakeData)) private stakerData;
    address[] stakers;

    enum ActionType {
        STAKE,
        UNSTAKE,
        CLAIM
    }

    struct StakeData {
        uint256 stakeCounts;
        uint256 timestamp;
        uint256 amount;
    }

    // ================================================================ Helpers ================================================================

    function getActiontype(uint256 _seed) internal pure returns (ActionType action) {
        // 33%
        
        if (_seed % 3 == 0) return action = ActionType.STAKE;
        if (_seed % 3 == 1) return action = ActionType.UNSTAKE;
        if (_seed % 3 == 2) return action = ActionType.CLAIM;
    }

    function setStakeData(
        address staker,
        uint256 _amount,
        uint256 _timestamp
    ) internal {
        if (stakerData[staker][0].stakeCounts == 0) {
            stakerData[staker][0].stakeCounts++;
            stakerData[staker][0].amount = _amount;
            stakerData[staker][0].timestamp = _timestamp;
            stakers.push(staker);
            emit log_named_uint("stakers.length", stakers.length);
        } else {
            uint256 sCount = stakerData[staker][0].stakeCounts;
            stakerData[staker][0].stakeCounts++;
            stakerData[staker][sCount].amount = _amount;
            stakerData[staker][sCount].timestamp = _timestamp;
        }
    }

    function getUnstakeData(uint256 _seed)
        internal
        returns (
            address staker_,
            uint256 amount_,
            uint256 timestamp_
        )
    {
        // find staker's index and staking data index
        uint256 _index = _seed % MAX_STAKES;
        uint256 stakerIndex = _seed % MAX_PER_STAKER;

        emit log_named_uint("_index", _index);
        emit log_named_uint("stakerIndex", _index);
        staker_ = stakers[_index];
        amount_ = stakerData[staker_][stakerIndex].amount;
        timestamp_ = stakerData[staker_][stakerIndex].timestamp;

        delete stakerData[staker_][stakerIndex];
    }

    // ================================================================ weights check ================================================================

    function probeWeights() public {
        (uint256 currPW, uint256 currFW, uint256 accPW, uint256 accFW) = dapping
            .users(indexCount)
            .setupContract()
            .wrapGetWeights();
        savingArray.push([currPW, currFW, accPW, accFW]);
        emit log_named_uint('pushed into savingArray', savingArray.length);
    }

    function getWeights(uint256 _index) public view returns (uint256[4] memory) {
        return savingArray[_index];
    }

    // ================================================================ Properties ================================================================

    // BUG: Property # 2 -- Checking monotonous fee weight and pool weight

    function test_APW(
        uint256 _seed,
        uint32 _warp,
        uint128 _amount
    ) public {
        // on the basis of seed we will get action type and actors index from setupContracts[]
        ActionType action = getActiontype(_seed);
        indexCount = _seed % MAX_STAKERS;

        //easing up the life
        SetupContracts caller = dapping.users(indexCount).setupContract();
        hevm.warp(block.timestamp + _warp);
        _amount = _amount + 1;

        // _ms, _md, _pd
        uint256 ms = 1;
        uint256 md = 1234567;
        uint32 pd = 12;
        caller.wrapSetStakingParams(ms, md, pd);

        // probing values of invariants (weights) before action
        // probeWeights();
        // testingArray[0] = getWeights(indexCount);

        // if action == Actiontype.STAKE
        // call stake and save stake data
        if (action == ActionType.STAKE) {
            hevm.warp(block.timestamp + _warp);
            caller.wrapStake(_amount);
            setStakeData(address(caller), _amount, block.timestamp);
            emit log_named_uint('Staked working, indexCount:', indexCount);
        }

        // if action === Actiontype.UNSTAKE
        // // get unstake data from stakerdata mapping
        // if (action == ActionType.UNSTAKE) {
        //     hevm.warp(block.timestamp + _warp);
        //     (,uint256 amount,) = getUnstakeData(_seed);
        //     caller.wrapUnstake(amount);
        //     emit log_named_uint('Unstaked working, indexCount:', indexCount);
        // }

        // if action == Actiontype.CLAIM
        // call calim with type(uint).max as amount
        // if (action == ActionType.CLAIM) {
        //     hevm.warp(block.timestamp + _warp);
        //     caller.wrapClaim(false, type(uint256).max);
        //     indexCount++;
        // }

        // inavriants
        // // probing new values of invariants
        // probeWeights();

        // //verify invariants
        // testingArray[1] = getWeights(indexCount);

        // assertGt(testingArray[0][0], testingArray[1][0]);
        // assertTrue(false);
    }

    // BUG: Property # 1 -- Fuzzing with MAX_DAFI, ProgramDuration, and blocknumber to test holding a property.
    // TODO: Check RebaseEngine.sol for assertions that fail

    // function test_Invariant(uint256 md, uint32 pd, uint32 bn) public {
    //     dapping.contracts().setupDB(md,  uint256(pd + 1));

    //     hevm.warp(block.timestamp + bn);

    //     dapping.contracts().wrapRebasePool();
    //     dapping.contracts().db().getPool();

    //     uint256 MaxDafi = dapping.contracts().rebaseEngine().MAX_DAFI();
    //     uint256 TdDafiDist = dapping.contracts().rebaseEngine().totaldDAFIDistributed();

    //     assertTrue(true);

    //     emit log_named_uint('this is MaxDafi', MaxDafi);
    //     emit log_named_uint('this is TdDafiDist', TdDafiDist);
    // }
}

