// SPDX-License-Identifier: MIT
pragma solidity >=0.7.6;

import "./interfaces/IERC20.sol";
import "./interfaces/IUnipilotTokenProxy.sol";

contract UnipilotTokenProxy is IUnipilotTokenProxy {
    IERC20 private constant UNIPILOT =
        IERC20(0x2e53716051bE4BCCE9F546fcfb0ef7632E505DBD);

    address public timelock;

    modifier onlyMinter() {
        require(minter[msg.sender], "PILOT_TOKEN_PROXY:: NOT_MINTER");
        _;
    }

    modifier onlyTimelock() {
        require(msg.sender == timelock, "PILOT_TOKEN_PROXY:: NOT_TIMELOCK");
        _;
    }

    mapping(address => bool) public minter;

    constructor(address _timelock) {
        timelock = _timelock;
    }

    function updateTimelock(address _timelock) external override onlyTimelock {
        emit TimelockUpdated(timelock, timelock = _timelock);
    }

    function updateMinter(address _minter) external override onlyTimelock {
        bool status = !minter[_minter];
        minter[_minter] = status;
        emit MinterUpdated(_minter, status);
    }

    function mint(address _to, uint256 _value) external override onlyMinter {
        UNIPILOT.mint(_to, _value);
    }
}
