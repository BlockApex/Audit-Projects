// SPDX-License-Identifier: GNU GPLv3
pragma solidity 0.8.0;

import "/home/jariruddin/BlockApex-Linux/dDAFI-testing/node_modules/openzeppelin-solidity/contracts/access/Ownable.sol";
import "/home/jariruddin/BlockApex-Linux/dDAFI-testing/node_modules/openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
// import "openzeppelin-solidity/contracts/access/Ownable.sol";
// import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

/**
 * This is a simple Token Pool contract to hold tokens. It's useful in the case where a separate contract
 * needs to hold multiple distinct pools of the same token.
 */
contract TokenPool is Ownable {
    IERC20 public immutable token;

    constructor(IERC20 _token) {
        token = _token;
    }

    mapping(address => bool) public whitelists; // The accounts which can access this pool

    modifier onlyWhitelist() {
        require(whitelists[msg.sender], "Not authorised to access the token pool");
        _;
    }

    function balance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }

    function transfer(address to, uint256 value) external onlyWhitelist returns (bool) {
        require(to != address(0));
        return token.transfer(to, value);
    }

    function rescueFunds(IERC20 tokenToRescue, address to, uint256 amount) external onlyWhitelist returns (bool) {
        require(address(token) != address(tokenToRescue), 'TokenPool: Cannot claim token held by the contract');

        return IERC20(tokenToRescue).transfer(to, amount);
    }

    function addWhitelist(address account) external onlyOwner {
        require(account != address(0));
        whitelists[account] = true;
    }

    function removeWhitelist(address account) external onlyOwner {
        require(account != address(0));
        require(whitelists[account], "Account doesnt exist in whitelist");
        whitelists[account] = false;
    }
}