pragma solidity ^0.6.0;
import "@openzeppelin/contracts-ethereum-package/contracts/Initializable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/token/ERC20/IERC20.sol";
import "./utils/MultipleOwners.sol";
import "./IDaoSmartContract.sol";
import "./IDaoStakeContract.sol";

contract DaoSmartContract is IDaoSmartContract, MulitpleOwners, PausableUpgradeSafe {
    using SafeMath for uint256;

    IDaoStakeContract public daoStakeContract;
    IERC20 public phnxContract;

    address public phnxContractAddress;

    address public signer;

    uint256 public collateralAmount;

    mapping(string => Proposal) public proposalList;

    function initialize(
        address _phoenixContractAddress,
        address _signer
    ) external override initializer {
        OwnableUpgradeSafe.__Ownable_init();
        PausableUpgradeSafe.__Pausable_init();
        phnxContractAddress = _phoenixContractAddress;
        phnxContract = IERC20(_phoenixContractAddress);
        // daoStakeContract = IDaoStakeContract(_daoStakeContract);
        signer = _signer;
        // approve dao stake contract to use max value of this contract
        
    }

    function setStakeContract(address _stakeContract) external onlyOwners{
        daoStakeContract = IDaoStakeContract(_stakeContract);
        phnxContract.approve(_stakeContract, uint256(-1));
    }

    function vote(uint256 _altQuantity, uint256 _time) external {
        address sender = msg.sender;
        require(daoStakeContract!=IDaoStakeContract(address(0)),"Staking Contract has not been set yet");
        require(_altQuantity != 0, "value not valid");
        require(_time >= 1 days && _time <= 365 days, "time not valid");
        phnxContract.transferFrom(sender, address(this), _altQuantity);
        daoStakeContract.stakeFor(_altQuantity, _time, sender);
    }

    function updateProposal(
        uint256 fundsRequested,
        uint256 endTimestamp,
        uint256 colletralAmount,
        uint256 totalMilestones,
        string calldata proposalId
    ) external override whenNotPaused {
        require(proposalList[proposalId].proposer != address(0), "This proposal Does not exist");
        address sender = msg.sender;
        require(proposalList[proposalId].proposer == sender, "Only Owner of propsal can edit this propsal");
        proposalList[proposalId] = Proposal(
            fundsRequested,
            0,
            endTimestamp,
            colletralAmount,
            totalMilestones,
            0,
            0,
            0,
            sender,
            false
        );
        emit ProposalEditted(
            proposalId,
            proposalList[proposalId].fundsRequested,
            proposalList[proposalId].initiationTimestamp,
            proposalList[proposalId].completionTimestamp,
            proposalList[proposalId].colletralAmount,
            proposalList[proposalId].totalMilestones,
            proposalList[proposalId].status,
            proposalList[proposalId].totalVotes,
            proposalList[proposalId].proposer
        );
    }

    function submitProposal(
        uint256 fundsRequested,
        uint256 endTimestamp,
        uint256 colletralAmount,
        uint256 totalMilestones,
        string calldata proposalId
    ) external override whenNotPaused {
        require(proposalList[proposalId].proposer == address(0), "Proposal already submitted");
        proposalList[proposalId] = Proposal(
            fundsRequested,
            0,
            endTimestamp,
            colletralAmount,
            totalMilestones,
            0,
            0,
            0,
            msg.sender,
            false
        );

        emit ProposalSubmitted(
            proposalId,
            proposalList[proposalId].fundsRequested,
            proposalList[proposalId].initiationTimestamp,
            proposalList[proposalId].completionTimestamp,
            proposalList[proposalId].colletralAmount,
            proposalList[proposalId].totalMilestones,
            proposalList[proposalId].status,
            proposalList[proposalId].totalVotes,
            proposalList[proposalId].proposer
        );
    }

    function withdrawCollateral(
        string calldata proposalId,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external override {
        address sender = msg.sender;
        require(!proposalList[proposalId].isClaimed, "Collateral Already Claimed");
        require(proposalList[proposalId].proposer == sender, "Only Owner of Proposal can withdraw");
        bytes32 message = keccak256(abi.encode(proposalId, sender));
        _validate(v, r, s, message);
        proposalList[proposalId].isClaimed = true;
        IERC20(phnxContractAddress).transfer(sender, proposalList[proposalId].colletralAmount);
        emit ColleteralWithdrawn(proposalId, proposalList[proposalId].colletralAmount, sender);
    }

    function updateProposalStatus(string calldata proposalId, uint256 status) external override {
        require(proposalList[proposalId].proposer != address(0), "proposal not submitted before");
        uint256 oldStatus = proposalList[proposalId].status;
        if (status == uint256(Status.UPVOTE) && proposalList[proposalId].status == uint256(Status.PENDING)) {
            proposalList[proposalId].status = uint256(Status.UPVOTE);
            IERC20(phnxContractAddress).transferFrom(
                proposalList[proposalId].proposer,
                address(this),
                proposalList[proposalId].colletralAmount
            );
            collateralAmount = collateralAmount.add(proposalList[proposalId].colletralAmount);
        }

        if (status == uint256(Status.VOTING) && proposalList[proposalId].status == uint256(Status.UPVOTE)) {
            proposalList[proposalId].status = uint256(Status.VOTING);
        }
        if (status == uint256(Status.ACTIVE) && proposalList[proposalId].status == uint256(Status.VOTING)) {
            proposalList[proposalId].status = uint256(Status.ACTIVE);
            proposalList[proposalId].initiationTimestamp = block.timestamp;
        }
        if (status == uint256(Status.REJECTED) && proposalList[proposalId].status == uint256(Status.PENDING)) {
            proposalList[proposalId].status = uint256(Status.REJECTED);
        }

        if (status == uint256(Status.COMPLETED) && proposalList[proposalId].status == uint256(Status.ACTIVE)) {
            proposalList[proposalId].status = uint256(Status.COMPLETED);
            IERC20(phnxContractAddress).transfer(
                proposalList[proposalId].proposer,
                proposalList[proposalId].colletralAmount
            );
        }

        require(proposalList[proposalId].status == status, "Status Not updated");
        emit ProposalStatusUpdated(proposalId, oldStatus, proposalList[proposalId].status);
    }

    function getDomainSeparator() internal view returns (bytes32) {
        return keccak256(abi.encode("0x01", address(this)));
    }

    function _validate(
        uint8 v,
        bytes32 r,
        bytes32 s,
        bytes32 encodeData
    ) internal view {
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", getDomainSeparator(), encodeData));
        address recoveredAddress = ecrecover(digest, v, r, s);
        // Explicitly disallow authorizations for address(0) as ecrecover returns address(0) on malformed messages
        require(recoveredAddress != address(0) && recoveredAddress == signer, "INVALID_SIGNATURE");
    }

    function pause() external override onlyOwners {
        _pause();
    }

    function unPause() external override onlyOwners {
        _unpause();
    }


    
    function splitSignature (bytes memory sig) 
    public 
    pure
    returns (uint8, bytes32, bytes32){
        
       // require(sig.length == 67, "transaction reverted due to the invalid length");
        
        uint8 v;
        bytes32 r;
        bytes32 s;
        
        assembly{
        r := mload(add(sig, 32))
        s := mload(add(sig, 64))
        v := byte(0, mload(add(sig, 96)))
        }
        return (v, r, s);
    }
}


//0xDc6010328c57999df231AF58e29FF60DCa7f8A2E

//update Proposal colletral amount 