// SPDX-License-Identifier: GPL-2.0-or-later

pragma solidity ^0.7.6;

import "./ILixirVault.sol";

interface ILixirStrategy {
    function initializeVault(ILixirVault _vault, bytes memory data) external;
}
