// pragma solidity ^0.7.6;

// //Utilities
// import "./interfaces/IUnipilotFarm.sol";
// import "./interfaces/IUnipilotStake.sol";

// // openzeppelin helpers
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/math/SafeMath.sol";
// import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

// /// @notice Unipilot staking contract
// contract Staking is IUnipilotStake {
//     using SafeMath for uint256;
//     using SafeERC20 for IERC20;

//     address public governance;

//     // mapping(uint256 => bool) private vaults;
//     // mapping(address => mapping(address => uint256)) public userMultiplier;

//     constructor(address _governance) {
//         governance = _governance;
//     }

//     modifier onlyGovernance() {
//         require(msg.sender == governance, "NA");
//         _;
//     }

//     function setVaults(address[] memory _vaults)
//         external
//         override
//         onlyGovernance
//     {
//         //         for (uint256 i = 0; i < _vaults.length; i++) {
//         //             vaults[_vaults[i]] = !vaults[_vaults[i]];
//         //         }
//     }

//     function stake(uint256 _amount) external override onlyGovernance {
//         //         userMultiplier[]
//     }

//     function unStake(uint256 _share) external override onlyGovernance {
//         //         userMultiplier[]
//     }
// }
