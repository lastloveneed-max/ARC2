// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Custom Errors for Gas Optimization
error OnlyBuyer();
error OnlyFreelancer();
error OnlyArbitrator();
error InvalidFreelancerAddress();
error AmountMustBeGreaterThanZero();
error InvalidState();

contract FreelancerEscrow {
    
    enum EscrowState { Initialized, Completed, Released, Disputed }

    struct Job {
        address buyer;        // Who pays for the job
        address freelancer;   // Who does the job
        uint256 amount;       // Total payment locked
        IERC20 token;         // Payment token (e.g., USDC)
        EscrowState state;    // Current state of the escrow
    }

    address public arbitrator; // The platform owner (You) to resolve issues
    uint256 public nextJobId;
    mapping(uint256 => Job) public jobs;

    event JobCreated(uint256 indexed jobId, address indexed buyer, address indexed freelancer, uint256 amount);
    event JobCompleted(uint256 indexed jobId);
    event FundsReleased(uint256 indexed jobId, uint256 amount);
    event DisputeOpened(uint256 indexed jobId);
    event DisputeResolved(uint256 indexed jobId, address indexed winner, uint256 amount);

    constructor() {
        arbitrator = msg.sender; // The deployer becomes the arbitrator
    }

    /**
     * @notice Buyer creates a job and locks the payment
     */
    function createJob(
        address _freelancer,
        uint256 _amount,
        IERC20 _token
    ) external returns (uint256) {
        if (_freelancer == address(0) || _freelancer == msg.sender) revert InvalidFreelancerAddress();
        if (_amount == 0) revert AmountMustBeGreaterThanZero();

        // Lock funds from buyer to this contract
        _token.transferFrom(msg.sender, address(this), _amount);

        uint256 jobId = nextJobId;
        nextJobId++;

        jobs[jobId] = Job({
            buyer: msg.sender,
            freelancer: _freelancer,
            amount: _amount,
            token: _token,
            state: EscrowState.Initialized
        });

        emit JobCreated(jobId, msg.sender, _freelancer, _amount);
        return jobId;
    }

    /**
     * @notice Freelancer marks the job as done
     */
    function completeJob(uint256 _jobId) external {
        Job storage job = jobs[_jobId];
        if (msg.sender != job.freelancer) revert OnlyFreelancer();
        if (job.state != EscrowState.Initialized) revert InvalidState();

        job.state = EscrowState.Completed;
        emit JobCompleted(_jobId);
    }

    /**
     * @notice Buyer approves the work and releases the funds to the freelancer
     */
    function releaseFunds(uint256 _jobId) external {
        Job storage job = jobs[_jobId];
        if (msg.sender != job.buyer) revert OnlyBuyer();
        if (job.state != EscrowState.Completed && job.state != EscrowState.Initialized) revert InvalidState();

        job.state = EscrowState.Released;
        job.token.transfer(job.freelancer, job.amount);

        emit FundsReleased(_jobId, job.amount);
    }

    /**
     * @notice Either party can open a dispute if something goes wrong
     */
    function openDispute(uint256 _jobId) external {
        Job storage job = jobs[_jobId];
        if (msg.sender != job.buyer && msg.sender != job.freelancer) revert InvalidState();
        if (job.state != EscrowState.Initialized && job.state != EscrowState.Completed) revert InvalidState();

        job.state = EscrowState.Disputed;
        emit DisputeOpened(_jobId);
    }

    /**
     * @notice Arbitrator resolves the dispute and sends funds to the rightful party
     * @param _resolveTo The address that should receive the funds (Buyer or Freelancer)
     */
    function resolveDispute(uint256 _jobId, address _resolveTo) external {
        if (msg.sender != arbitrator) revert OnlyArbitrator();
        Job storage job = jobs[_jobId];
        if (job.state != EscrowState.Disputed) revert InvalidState();
        if (_resolveTo != job.buyer && _resolveTo != job.freelancer) revert InvalidState();

        job.state = EscrowState.Released;
        job.token.transfer(_resolveTo, job.amount);

        emit DisputeResolved(_jobId, _resolveTo, job.amount);
    }
}
