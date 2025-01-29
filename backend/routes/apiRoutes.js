const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authController = require('../controllers/authController');
const loanController = require('../controllers/loanController');

// Transaction routes
router.post('/transactions', transactionController.createTransaction);
router.get('/transactions/:account_id', transactionController.getTransactionsByAccount);
router.patch('/transactions/:transaction_id', transactionController.updateTransactionStatus);
router.get('/transactions/:transaction_id', transactionController.getTransactionById);

// Loan routes
router.post('/loans', loanController.createLoan);
router.get('/loans/:account_id', loanController.getLoansByAccount);

// Authentication routes
router.post('/auth/login', authController.login);
router.post('/auth/signup', authController.signup);

module.exports = router;
