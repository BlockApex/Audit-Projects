// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import './TokenBase.sol';

contract TokenBsc is TokenBase {
  constructor() TokenBase('PING BSC Token', 'BPING') {}
}
