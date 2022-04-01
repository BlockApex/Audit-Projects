// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity =0.8.0;

import '/home/jariruddin/BlockApex-Linux/dDAFI-testing/contracts/blockapex/setup/SetupContracts.sol';
// import '../../setup/SetupContracts.sol';

contract Dapptools {
    SetupToken public setupToken;
    TestERC20 public token;

    UserContract public userContract;
    UserContract[] public users;

    constructor() {
        setupToken = new SetupToken();
        token = setupToken.token();

        for (uint256 index = 0; index < 11; index++) {
            userContract = new UserContract(token);
            users.push(userContract);
        }
    }

    function getCaller(uint256 _index) public view returns (UserContract) {
        return users[_index];
    }
}

contract UserContract {
    SetupContracts public setupContract;

    constructor(TestERC20 _token) {
        setupContract = new SetupContracts(_token);
        _token._mint(address(setupContract), 1e30 ether);
    }
}

