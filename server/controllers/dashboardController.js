const Employee = require('../models/Employee');

// GET /api/dashboard/stats
exports.getDashboardStats = async (req, res) => {
  try {
    const employees = await Employee.find({});
    
    let totalPayroll = 0;
    let taxOverview = 0;
    let pendingPayments = 0;
    const departmentCounts = {
      'ENGINEERING': 0,
      'DESIGN OPS': 0,
      'OPERATIONS': 0,
      'MARKETING': 0
    };
    
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const trendsMap = {};
    
    employees.forEach(emp => {
      const salary = emp.baseSalary || 0;
      totalPayroll += salary;
      taxOverview += (salary * (emp.taxPercent || 20)) / 100;
      
      if (emp.status === 'Onboarding') {
        pendingPayments++;
      }
      
      if (emp.department) {
        const deptUpper = emp.department.toUpperCase();
        if (departmentCounts[deptUpper] !== undefined) {
          departmentCounts[deptUpper]++;
        }
      }
      
      const dateToUse = emp.joiningDate || emp.createdAt || new Date();
      const monthStr = monthNames[new Date(dateToUse).getMonth()];
      trendsMap[monthStr] = (trendsMap[monthStr] || 0) + salary;
    });

    const totalEmployees = employees.length;

    // Donut chart data formatting
    const colors = {
      'ENGINEERING': '#4f46e5', // indigo-600
      'MARKETING': '#818cf8',   // indigo-400
      'OPERATIONS': '#e0e7ff',  // indigo-100
      'DESIGN OPS': '#a5b4fc'   // indigo-300
    };
    
    const departmentSplit = Object.keys(departmentCounts).map(key => ({
      name: key,
      value: totalEmployees > 0 ? Math.round((departmentCounts[key] / totalEmployees) * 100) : 0,
      color: colors[key]
    })).filter(dept => dept.value > 0);

    // Line chart data formatting (last 6 months)
    const currentMonthIndex = new Date().getMonth();
    const payrollTrends = [];
    for (let i = 5; i >= 0; i--) {
      let mIndex = currentMonthIndex - i;
      if (mIndex < 0) mIndex += 12;
      const mStr = monthNames[mIndex];
      payrollTrends.push({
        name: mStr,
        value: trendsMap[mStr] || 0
      });
    }

    // Recent activity (Last 5 employees)
    const recentActivityRaw = await Employee.find().sort({ createdAt: -1 }).limit(5);
    const recentActivity = recentActivityRaw.map(emp => {
      let action = 'New Hire Added';
      let cycle = 'Onboarding Process';
      let status = 'PROCESSING';
      
      if (emp.status === 'Active') {
        action = 'Profile Verified';
        cycle = 'Added to Payroll';
        status = 'COMPLETED';
      } else if (emp.status === 'Leave') {
        action = 'Status Updated';
        cycle = 'Leave of Absence';
        status = 'PAUSED';
      }

      const timeDiff = new Date() - new Date(emp.createdAt);
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      let timeStr = hours < 1 ? 'JUST NOW' : `${hours} HOURS AGO`;
      if (hours > 24) {
        timeStr = `${Math.floor(hours/24)} DAYS AGO`;
      }

      return {
        id: emp._id,
        name: emp.name,
        role: emp.role,
        action,
        cycle,
        status,
        time: timeStr,
        avatar: emp.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.name}`
      };
    });

    res.status(200).json({
      totalPayroll,
      totalEmployees,
      pendingPayments,
      taxOverview,
      growth: 4.2,
      departmentSplit,
      payrollTrends,
      recentActivity
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
