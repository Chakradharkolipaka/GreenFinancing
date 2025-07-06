const { ethers, JsonRpcProvider, parseEther, formatEther } = require('ethers');
require('dotenv').config();
const contractABI = require('../abi/GreenFinancingABI.json');
const bcrypt = require('bcrypt');

console.log(process.env.RPC_NODE_URL);
//set up user
const User = require('../models/User');
const Investment = require('../models/Investment'); 
const Project = require('../models/Project');
const ContactUs = require('../models/ContactUs');
const Admin = require('../models/adminAuth');
const WithdrawReview = require('../models/withdrawReview');
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
        if (!username || !email || !password || !wallet) {
            return res.status(400).json({ error: 'All fields except organization are required.' });
        }
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ error: 'User already exists.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword, wallet, organization });
        await user.save();
        const { password: _, ...userData } = user.toObject();
        res.status(201).json({ message: 'Signup successful', user: userData });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

//controller function to login user
const login = async (req, res) => {
    try {
        const { email, password, wallet } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password." });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch || user.wallet !== wallet) {
            return res.status(401).json({ error: "Invalid email, password, or wallet address." });
        }
        const { password: _, ...userData } = user.toObject();
        res.json({ message: "Login successful", user: userData });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

// Admin signup
const adminSignup = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Admin already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ email, password: hashedPassword });
    await admin.save();
    const { password: _, ...adminData } = admin.toObject();
    res.status(201).json({ message: 'Admin signup successful', admin: adminData });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const { password: _, ...adminData } = admin.toObject();
    res.json({ message: 'Admin login successful', admin: adminData });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
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
        const contributionAmount = parseEther(req.query.amount);
        const tx = await ContributorContract.contribute({ value: contributionAmount });
        const receipt = await tx.wait();

        // Save investment to DB
        await Investment.create({
            contributor: req.query.wallet || "unknown", // Pass wallet in query or body
            amount: req.query.amount,
            txHash: receipt.hash,
            timestamp: new Date()
        });

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
        const projectCost = parseEther(req.query.cost);

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
        const allocationAmount = parseEther(req.query.amount);

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

// Controller function to withdraw allocated funds with review
const withdrawFunds = async (req, res) => {
    try {
        // Use admin private key as default receiver
        const receiverAddress = wallet.address;
        const withdrawalAmount = parseEther(req.body.amount);
        const review = req.body.review || "";
        const admin = req.body.admin; // admin email or id
        if (!admin) {
            return res.status(400).json({ error: 'Admin identifier is required.' });
        }
        const tx = await contract.withdrawFunds(receiverAddress, withdrawalAmount);
        const receipt = await tx.wait();
        // Save withdrawal review and transaction to DB
        await WithdrawReview.create({
            amount: req.body.amount,
            receiver: receiverAddress,
            review,
            admin,
            txHash: receipt.hash,
            timestamp: new Date()
        });
        res.json({ 
            message: "Funds Withdrawn Successfully", 
            transactionHash: receipt.hash 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Error occurred while withdrawing funds" });
    }
};

// Endpoint to get withdrawal review history
const getWithdrawReviews = async (req, res) => {
    try {
        const reviews = await WithdrawReview.find().sort({ timestamp: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch withdrawal reviews' });
    }
};

// Endpoint to store withdrawal review (DB only, not blockchain)
const storeWithdrawReview = async (req, res) => {
    try {
        const { amount, receiver, review, admin, txHash } = req.body;
        if (!amount || !receiver || !review || !admin || !txHash) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        await WithdrawReview.create({
            amount,
            receiver,
            review,
            admin,
            txHash,
            timestamp: new Date()
        });
        res.status(201).json({ message: 'Withdrawal review stored.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to store withdrawal review.' });
    }
};

// Controller function to get the contract balance
const getContractBalance = async (req, res) => {
    try {
        const balance = await contract.getContractBalance();
        res.json({ balance: formatEther(balance) });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Error occurred while retrieving contract balance" });
    }
};

// Controller function to get recent investments
const getRecentInvestments = async (req, res) => {
    try {
        const investments = await Investment.find().sort({ timestamp: -1 }).limit(10);
        res.json(investments);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Error retrieving investments" });
    }
};

const addProject = async (req, res) => {
  try {
    const {
      name,
      owner,
      description,
      urls,
      location,
      startDate,
      endDate,
      projectType,
      budget,
      team,
      impact,
      esgScore,
      carbonCredits,
      additionalInfo
    } = req.body;
    const project = await Project.create({
      name,
      owner,
      description,
      urls,
      location,
      startDate,
      endDate,
      projectType,
      budget,
      team,
      impact,
      esgScore,
      carbonCredits,
      additionalInfo
    });
    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error saving project" });
  }
};

const submitContactUs = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }
    await ContactUs.create({ name, email, message });
    res.status(201).json({ message: "Thank you for contacting us!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to submit contact form." });
  }
};

const logInvestment = async (req, res) => {
  try {
    const { contributor, amount, txHash, timestamp } = req.body;
    await Investment.create({ contributor, amount, txHash, timestamp });
    res.status(201).json({ message: "Investment logged" });
  } catch (error) {
    res.status(500).json({ error: "Failed to log investment" });
  }
};

// Controller to get all projects (for user view)
const getAllProjects = async (req, res) => {
  try {
    const Project = require('../models/Project');
    const projects = await Project.find({});
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
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
    getContractBalance,
    getRecentInvestments,
    addProject,
    submitContactUs,
    logInvestment,
    adminSignup,
    adminLogin,
    getWithdrawReviews,
    storeWithdrawReview,
    getAllProjects
};