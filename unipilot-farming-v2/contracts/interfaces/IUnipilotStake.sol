//SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;

interface IUnipilotStake {
    function getBoostMultiplier(address _vault, address _user)
        external
        view
        returns (uint256);

    event Staked(
        uint256 _amount,
        address indexed _tokenAddress,
        address indexed _owner
    );
    event UnStaked(
        uint256 _amount,
        address indexed _tokenAddress,
        address indexed _owner
    );

    function stake(uint256 _amount) external;

    function unStake(uint256 _share) external;

    function setVaults(address[] memory _vaults) external;
}
