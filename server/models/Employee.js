const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  avatar: { 
    type: String 
  },
  role: { 
    type: String, 
    required: true 
  },
  department: { 
    type: String,
    enum: ['Engineering', 'Design Ops', 'Operations', 'Marketing']
  },
  baseSalary: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String,
    enum: ['Active', 'Onboarding', 'Leave'],
    default: 'Active'
  },
  joiningDate: { 
    type: Date 
  },
  taxPercent: { 
    type: Number, 
    default: 20 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);
