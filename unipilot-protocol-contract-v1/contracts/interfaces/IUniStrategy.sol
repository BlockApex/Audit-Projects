// SPDX-License-Identifier: GPL-2.0-or-later

pragma solidity >=0.7.6;

interface IUniStrategy {
    struct PoolStrategy {
        int24 baseThreshold;
        int24 rangeMultiplier;
        int24 maxTwapDeviation;
        uint32 twapDuration;
    }

    function getTicks(address _pool)
        external
        returns (
            int24 baseLower,
            int24 baseUpper,
            int24 bidLower,
            int24 bidUpper,
            int24 askLower,
            int24 askUpper
        );

    function pricethreshold() external view returns (uint24);
}
