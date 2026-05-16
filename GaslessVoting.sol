// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

// Custom Errors for Gas Optimization
error ProposalNotActive();
error AlreadyVoted();
error InvalidSignature();
error VotingClosed();

contract GaslessVoting {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    struct Proposal {
        string description;   // What the vote is about
        uint256 voteCount;    // Total votes received
        uint256 endTime;      // When the voting ends
        bool exists;          // To check if proposal is valid
    }

    address public owner;
    uint256 public nextProposalId;
    
    mapping(uint256 => Proposal) public proposals;
    // Tracks if a user has already voted for a specific proposal (ProposalId => Voter => Voted)
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ProposalCreated(uint256 indexed proposalId, string description, uint256 endTime);
    event VoteCast(uint256 indexed proposalId, address indexed voter);

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Admin creates a new proposal for voting
     */
    function createProposal(string calldata _description, uint256 _durationSeconds) external {
        uint256 proposalId = nextProposalId;
        nextProposalId++;

        proposals[proposalId] = Proposal({
            description: _description,
            voteCount: 0,
            endTime: block.timestamp + _durationSeconds,
            exists: true
        });

        emit ProposalCreated(proposalId, _description, block.timestamp + _durationSeconds);
    }

    /**
     * @notice Casts a vote using a gasless cryptographic signature (Meta-Transaction)
     * @param _voter The address of the user who signed the vote
     * @param _proposalId The ID of the proposal they are voting for
     * @param _signature The cryptographic signature generated off-chain by the voter
     */
    function castGaslessVote(
        address _voter,
        uint256 _proposalId,
        bytes calldata _signature
    ) external {
        Proposal storage proposal = proposals[_proposalId];
        
        if (!proposal.exists) revert ProposalNotActive();
        if (block.timestamp > proposal.endTime) revert VotingClosed();
        if (hasVoted[_proposalId][_voter]) revert AlreadyVoted();

        // 1. Recreate the exact message hash that the user signed off-chain
        bytes32 messageHash = keccak256(abi.encodePacked(_voter, _proposalId));
        
        // 2. Convert it to an Ethereum Signed Message Hash
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();

        // 3. Recover the signer address from the signature
        address signer = ethSignedMessageHash.recover(_signature);

        // 4. Security Check: Ensure the recovered signer is actually the voter
        if (signer != _voter) revert InvalidSignature();

        // 5. Record the vote
        hasVoted[_proposalId][_voter] = true;
        proposal.voteCount++;

        emit VoteCast(_proposalId, _voter);
    }
}
