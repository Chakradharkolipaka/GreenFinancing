// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GreenFinancing {

    address public owner; // The owner of the contract (the organization raising funds)
    mapping(address => uint256) public contributors; // Mapping to store the contribution of each address
    uint256 public totalFundsRaised; // Total funds raised for green projects
    uint256 public fundsAllocated; // Funds allocated to green projects
    uint256 public projectCost; // The total cost of the green project
    bool public projectStarted; // A flag to indicate if the project has started

    event ContributionMade(address indexed contributor, uint256 amount);
    event ProjectStarted(uint256 projectCost);
    event FundsAllocated(uint256 amount);
    event FundsWithdrawn(address indexed receiver, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    modifier projectNotStarted() {
        require(!projectStarted, "Project has already started.");
        _;
    }

    modifier projectStartedOnly() {
        require(projectStarted, "Project has not been started yet.");
        _;
    }

    constructor() {
        owner = msg.sender; // The address that deploys the contract becomes the owner
    }

    // Function to contribute funds to the project
    function contribute() public payable {
        require(msg.value > 0, "Contribution must be greater than zero.");
        contributors[msg.sender] += msg.value;
        totalFundsRaised += msg.value;

        emit ContributionMade(msg.sender, msg.value);
    }

    // Function to start the green project (only owner can start the project)
    function startProject(uint256 _projectCost) public onlyOwner projectNotStarted {
        require(_projectCost <= totalFundsRaised, "Not enough funds to start the project.");
        projectCost = _projectCost;
        projectStarted = true;

        emit ProjectStarted(projectCost);
    }

    // Function to allocate funds to the green project
    function allocateFunds(uint256 _amount) public onlyOwner projectStartedOnly {
        require(_amount <= totalFundsRaised - fundsAllocated, "Not enough funds remaining.");
        fundsAllocated += _amount;

        emit FundsAllocated(_amount);
    }

    // Function to withdraw allocated funds for the project
    function withdrawFunds(address payable _receiver, uint256 _amount) public onlyOwner projectStartedOnly {
        require(_amount <= fundsAllocated, "Insufficient allocated funds.");
        fundsAllocated -= _amount;
        _receiver.transfer(_amount);

        emit FundsWithdrawn(_receiver, _amount);
    }

    // Function to get the balance of the contract (useful for transparency)
    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // Function to get the contribution of a specific address
    function getContribution(address _contributor) public view returns (uint256) {
        return contributors[_contributor];
    }

    // Fallback function to accept any accidental ether sent to the contract
    receive() external payable {
        contribute();
    }
}
