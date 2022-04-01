pragma solidity >=0.6.0;
import "../DaoSmartContract.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/Initializable.sol";
// import "@openzeppelin/contracts-ethereum-package/contracts/access/Ownable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";
import "../MultipleOwners.sol";

contract TestPhnx is DaoSmartContract{

     address echidna_caller = 0xe7Ef8E1402055EB4E89a57d1109EfF3bAA334F5F;

    //  constructor() public {
    //     owner = echidna_caller;
    // }

     function echidna_initialize () public view returns (bool){
         return(initializing == !initialized);
     }

}