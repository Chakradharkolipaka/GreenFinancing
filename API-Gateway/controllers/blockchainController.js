const { ethers, JsonRpcProvider } = require('ethers');
require('dotenv').config();
const contractABI = require('../abi/GreenFinancingABI.json');

console.log(process.env.RPC_NODE_URL);
//set up user
const User = require('../models/User');
// Set up wallet and provider
const provider = new JsonRpcProvider(process.env.RPC_NODE_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contributorWallet = new ethers.Wallet(process.env.CONTRIBUTOR_PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI.abi, wallet);
// Get contract instance connected with contributor's wallet
const ContributorContract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI.abi, contributorWallet);

//controller function to get user info
const signup = async (req, res) => {
    try {
        const { username, email, password, wallet, organization } = req.body;
        // Optionally: hash password here before saving
        const user = new User({ username, email, password, wallet, organization });
        await user.save();
        res.status(201).json({ message: 'Signup successful' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

//controller function to login user
const login = async (req, res) => {
    try {
        const { email, password, wallet } = req.body;
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password." });
        }
        // Check password and wallet address
        if (user.password !== password || user.wallet !== wallet) {
            return res.status(401).json({ error: "Invalid email, password, or wallet address." });
        }
        // On success, return user info (omit password)
        const { password: _, ...userData } = user.toObject();
        res.json({ message: "Login successful", user: userData });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

// Controller function to get the project details
const getProjectDetails = async (req, res) => {
    try {
        const [owner, projectCost, totalFundsRaised, fundsAllocated, projectStarted] = await contract.getProjectDetails(); 
        
        res.json({
            owner,
            projectCost: projectCost.toString(),
            totalFundsRaised: totalFundsRaised.toString(),
            fundsAllocated: fundsAllocated.toString(),
            projectStarted
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Error retrieving project details" });
    }
};

// Controller function to contribute funds
const contributeFunds = async (req, res) => {
    try {
        const contributionAmount = ethers.utils.parseEther(req.query.amount);
        
        const tx = await ContributorContract.contribute({ value: contributionAmount });
        const receipt = await tx.wait();

        res.json({ 
            message: "Contribution Successful", 
            transactionHash: receipt.hash 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Error occurred while contributing funds" });
    }
};

// Controller function to start the project
const startProject = async (req, res) => {
    try {
        const projectCost = ethers.utils.parseEther(req.query.cost);

        const tx = await contract.startProject(projectCost);
        const receipt = await tx.wait();

        res.json({ 
            message: "Project Started Successfully", 
            transactionHash: receipt.hash 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Error occurred while starting the project" });
    }
};

// Controller function to allocate funds
const allocateFunds = async (req, res) => {
    try {
        const allocationAmount = ethers.utils.parseEther(req.query.amount);

        const tx = await contract.allocateFunds(allocationAmount);
        const receipt = await tx.wait();

        res.json({ 
            message: "Funds Allocated Successfully", 
            transactionHash: receipt.hash 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Error occurred while allocating funds" });
    }
};

// Controller function to withdraw allocated funds
const withdrawFunds = async (req, res) => {
    try {
        const receiverAddress = req.query.receiver;
        const withdrawalAmount = ethers.utils.parseEther(req.query.amount);

        const tx = await contract.withdrawFunds(receiverAddress, withdrawalAmount);
        const receipt = await tx.wait();

        res.json({ 
            message: "Funds Withdrawn Successfully", 
            transactionHash: receipt.hash 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Error occurred while withdrawing funds" });
    }
};

// Controller function to get the contract balance
const getContractBalance = async (req, res) => {
    try {
        const balance = await contract.getContractBalance();
        res.json({ balance: ethers.utils.formatEther(balance) });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Error occurred while retrieving contract balance" });
    }
};

module.exports = {
    signup,
    login, 
    getProjectDetails,
    contributeFunds,
    startProject,
    allocateFunds,
    withdrawFunds,
    getContractBalance
};
