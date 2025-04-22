const express = require('express');
const router = express.Router();
const {
    getProjectDetails,
    contributeFunds,
    startProject,
    allocateFunds,
    withdrawFunds,
    getContractBalance,
} = require('../controllers/blockchainController');

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

// Route to get the contract balance
router.get('/contractBalance', getContractBalance);



module.exports = router;