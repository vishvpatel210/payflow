const Employee = require('../models/Employee');
const Activity = require('../models/Activity');

// GET /api/employees
exports.getAllEmployees = async (req, res) => {
  try {
    const { search, department, status, page = 1, limit = 10 } = req.query;
    const query = { userId: req.user.id };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (department) query.department = department;
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const employees = await Employee.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
    
    // Return total count for pagination
    const total = await Employee.countDocuments(query);

    res.status(200).json({
      employees,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      totalEmployees: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/employees/:id
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findOne({ _id: req.params.id, userId: req.user.id });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/employees
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, role, baseSalary } = req.body;
    
    // Validate required
    if (!name || !email || !role || !baseSalary) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check duplicate email for this user
    const duplicate = await Employee.findOne({ email, userId: req.user.id });
    if (duplicate) return res.status(400).json({ message: 'Email already exists' });

    const newEmployee = new Employee({ ...req.body, userId: req.user.id });
    const savedEmployee = await newEmployee.save();
    
    // Log activity
    await Activity.create({
      userId: req.user.id,
      employeeId: savedEmployee._id,
      action: 'Employee Added',
      description: `Added ${savedEmployee.name} to ${savedEmployee.department || 'Directory'}`,
      status: savedEmployee.status === 'Active' ? 'Completed' : 'Processing'
    });

    res.status(201).json(savedEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/employees/:id
exports.updateEmployee = async (req, res) => {
  try {
    const updatedEmployee = await Employee.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updatedEmployee) return res.status(404).json({ message: 'Employee not found' });
    
    // Log activity
    await Activity.create({
      userId: req.user.id,
      employeeId: updatedEmployee._id,
      action: 'Employee Updated',
      description: `Updated profile for ${updatedEmployee.name}`,
      status: 'Completed'
    });

    res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/employees/:id
exports.deleteEmployee = async (req, res) => {
  try {
    const deletedEmployee = await Employee.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deletedEmployee) return res.status(404).json({ message: 'Employee not found' });
    
    // Log activity
    await Activity.create({
      userId: req.user.id,
      action: 'Employee Removed',
      description: `Removed ${deletedEmployee.name} from directory`,
      status: 'Completed'
    });

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/employees/stats
exports.getEmployeeStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments({ userId: req.user.id });
    const activeEmployees = await Employee.countDocuments({ status: 'Active', userId: req.user.id });
    const onboardingEmployees = await Employee.countDocuments({ status: 'Onboarding', userId: req.user.id });
    
    const employees = await Employee.find({ userId: req.user.id });
    
    const totalPayroll = employees.reduce((acc, emp) => acc + (emp.baseSalary || 0), 0);
    
    const departmentCounts = {};
    employees.forEach(emp => {
      if (emp.department) {
        departmentCounts[emp.department] = (departmentCounts[emp.department] || 0) + 1;
      }
    });

    const departmentSplit = {};
    for (const [dept, count] of Object.entries(departmentCounts)) {
      departmentSplit[dept] = totalEmployees > 0 ? ((count / totalEmployees) * 100).toFixed(2) : 0;
    }

    res.status(200).json({
      totalEmployees,
      activeEmployees,
      onboardingEmployees,
      totalPayroll,
      departmentSplit
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
