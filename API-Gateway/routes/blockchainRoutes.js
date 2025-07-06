const express = require('express');
const router = express.Router();
const { 
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
} = require('../controllers/blockchainController');

// Route to post user info
router.post('/signup', signup);

// Route to login
router.post('/login', login); 

// Route to get project details
router.get('/projectDetails', getProjectDetails);

// Route to contribute funds to the green project
router.post('/contribute', contributeFunds);

// Route to start the green project (only by the Owner)
router.post('/startProject', startProject);

// Route to allocate funds to the project (only by the Owner)
router.post('/allocateFunds', allocateFunds);

// Route to withdraw allocated funds (only by the Owner)
router.post('/withdrawFunds', withdrawFunds);

// Route to get withdrawal review history
router.get('/withdraw-reviews', getWithdrawReviews);

// Endpoint to store withdrawal review (DB only, not blockchain)
router.post('/store-withdraw-review', storeWithdrawReview);

// Route to get the contract balance
router.get('/contractBalance', getContractBalance);

// Route to get recent investments
router.get('/recent-investments', getRecentInvestments);

// Route to add a new project
router.post('/add-project', addProject);

// Route to get all projects (for user view)
router.get('/projects', getAllProjects);

// Route to submit contact us form
router.post('/contact-us', submitContactUs);

// Route to log an investment
router.post('/log-investment', logInvestment);

// Admin signup
router.post('/admin-signup', adminSignup);

// Admin login
router.post('/admin-login', adminLogin);

module.exports = router;