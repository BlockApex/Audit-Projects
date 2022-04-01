// SPDX-License-Identifier: GNU GPLv3
pragma solidity 0.8.0;

import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import '../interfaces/INetworkDemand.sol';
import "../interfaces/IPriceFeeds.sol";
import "../interfaces/ITVLFeeds.sol";

/**
*   This contract calculates the network demand factor coeeficient of ERC20 token
*/
contract NetworkDemand is INetworkDemand, Ownable {

    IERC20 public immutable token;

    uint private targetPrice;
    uint private targetTVL;

    IPriceFeeds public priceFeeds;
    ITVLFeeds public tvlFeeds;

    uint16 pricePercentage; // The contribution of price in network demand coefficient calculation, carrying four decimals ex. 25.25% -> 2525
    uint16 tvlPercentage; // The contribution of TVL in network demand coefficient calculation, carrying four decimals

    uint32 constant SIX_DECIMALS = 1000000;
    uint32 constant EIGHT_DECIMALS = 100000000;
    uint32 constant SEVEN_DECIMALS = 10000000;
    uint8 constant TWO_DECIMALS = 100;

    mapping(address => bool) public whitelists; // The accounts which can access this contract

    modifier onlyWhitelist() {
        require(whitelists[msg.sender], "Not authoriused to access the network demand");
        _;
    }

    modifier percentageCheck(uint16 _percentage) {
        require(_percentage <= 10000, "Percentage can only be between 0 and 100");
        _;
    }

    constructor(IERC20 _token, IPriceFeeds _priceFeeds, ITVLFeeds _tvlFeeds) Ownable(){
        token = _token;
        priceFeeds = _priceFeeds;
        tvlFeeds = _tvlFeeds;
        whitelists[msg.sender] = true;
    }

    /*
    *   This method calculated the lastest network demand factor coeeficient which is always meant to be between 0.1 and 1.
    *   It uses price and TVL in given proportions to calculate the demand factor.
    */
    function calculateNetworkDemand() external override view returns (uint){
        // Multiplied by six decimals in first stamement to avoid rounding off to zero in case of very small numbers and percentage carrying four decimals

        uint priceContri = pricePercentage == 0 ? 0 : (priceFeeds.getThePrice() * SIX_DECIMALS / targetPrice) * pricePercentage;
        uint tvlContri = tvlPercentage == 0 ? 0 : (tvlFeeds.getTheTVL() * SIX_DECIMALS / targetTVL) * tvlPercentage;

        uint demandFactorNew = (priceContri + tvlContri) / TWO_DECIMALS;
        // Demand factor with eight decimals

        // Enforcing demand factor to be between 0.1 to 1(we are using eight decimals for demand factor)
        if (demandFactorNew < SEVEN_DECIMALS) {
            demandFactorNew = SEVEN_DECIMALS;
            // SEVEN_DECIMALS means 0.1
        } else if (demandFactorNew > EIGHT_DECIMALS) {
            demandFactorNew = EIGHT_DECIMALS;
            // EIGHT_DECIMALS means 1
        }

        return demandFactorNew;
    }

    function setPricePercentage(uint16 _pricePercentage) external onlyWhitelist percentageCheck(_pricePercentage) {
        pricePercentage = _pricePercentage;
    }

    function getPricePercentage() public view returns (uint16) {
        return pricePercentage;
    }

    function setTVLPercentage(uint16 _tvlPercentage) external onlyWhitelist percentageCheck(_tvlPercentage) {
        tvlPercentage = _tvlPercentage;
    }

    function getTVLPercentage() public view returns (uint16) {
        return tvlPercentage;
    }

    function setTargetPrice(uint _targetPrice) external onlyWhitelist {
        targetPrice = _targetPrice;
    }

    function getTargetPrice() public view returns (uint) {
        return targetPrice;
    }

    function setTargetTVL(uint _targetTVL) external onlyWhitelist {
        targetTVL = _targetTVL;
    }

    function getTargetTVL() public view returns (uint) {
        return targetTVL;
    }

    function getPriceCurrent() external view returns (uint) {
        return priceFeeds.getThePrice();
    }

    function getTVLCurrent() external view returns (uint) {
        return tvlFeeds.getTheTVL();
    }

    function updatePriceFeed(IPriceFeeds newPriceFeed) external onlyWhitelist {
        priceFeeds = newPriceFeed;
    }

    function updateTVLFeed(ITVLFeeds newTVLFeed) external onlyWhitelist {
        tvlFeeds = newTVLFeed;
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