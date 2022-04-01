pragma solidity ^0.6.0;

interface IDaoSmartContract {
    enum Status { PENDING, UPVOTE, VOTING, ACTIVE, COMPLETED, REJECTED }

    struct Proposal {
        uint256 fundsRequested;
        uint256 initiationTimestamp;
        uint256 completionTimestamp;
        uint256 colletralAmount;
        uint256 totalMilestones;
        uint256 completedMilestones;
        uint256 status;
        uint256 totalVotes;
        address proposer;
        bool isClaimed;
    }

    event ProposalSubmitted(
        string proposalId,
        uint256 fundsRequested,
        uint256 initiationTimestamp,
        uint256 completionTimestamp,
        uint256 colletralAmount,
        uint256 totalMilestones,
        uint256 status,
        uint256 totalVotes,
        address proposer
    );

    event ProposalEditted(
        string proposalId,
        uint256 fundsRequested,
        uint256 initiationTimestamp,
        uint256 completionTimestamp,
        uint256 colletralAmount,
        uint256 totalMilestones,
        uint256 status,
        uint256 totalVotes,
        address proposer
    );
    event ProposalStatusUpdated(string proposalId, uint256 previousStatus, uint256 newStatus);

    event ColleteralWithdrawn(string proposalId, uint256 collateralAmount, address proposer);

    function initialize(
        address _phoenixContractAddress,
        address _signer
    ) external;

    function updateProposal(
        uint256 fundsRequested,
        uint256 endTimestamp,
        uint256 colletralAmount,
        uint256 totalMilestones,
        string calldata proposalId
    ) external;

    function submitProposal(
        uint256 fundsRequested,
        uint256 endTimestamp,
        uint256 colletralAmount,
        uint256 totalMilestones,
        string calldata proposalId
    ) external;

    function withdrawCollateral(
        string calldata proposalId,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    function updateProposalStatus(string calldata proposalId, uint256 status) external;

    function pause() external;

    function unPause() external;
}
