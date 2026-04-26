const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const employeeController = require('../controllers/employeeController');

// Apply JWT protect middleware on all routes
router.use(auth);

// Register routes
router.get('/', employeeController.getAllEmployees);
router.post('/', employeeController.createEmployee);
router.get('/stats', employeeController.getEmployeeStats); // Must be placed before /:id route
router.get('/:id', employeeController.getEmployeeById);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;
