const express = require('express');
const addExpenseController = require('../controllers/addExpenseController');
const listExpenseController = require('../controllers/listExpenseController');
const router = express.Router();




router.get('/', addExpenseController.expenseForm)
router.get('/add', addExpenseController.expenseForm); // should render  add expense form
router.post('/save', addExpenseController.saveExpense);
router.get('/list', addExpenseController.listExpense)
















module.exports = router;