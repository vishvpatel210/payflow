const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  company: {
    name: { type: String, default: 'The Atelier' },
    email: { type: String, default: 'admin@payflow.com' },
    address: { type: String, default: '' },
    logo: { type: String, default: '' },
    currency: { type: String, default: 'INR' },
    timezone: { type: String, default: 'UTC+5:30' }
  },
  payroll: {
    cycleDate: { type: Number, default: 15 },
    processingDate: { type: Number, default: 28 },
    autoSelectMonth: { type: Boolean, default: true },
    autoGeneration: { type: Boolean, default: false },
    overtimeEnabled: { type: Boolean, default: true }
  },
  tax: {
    incomeTaxPercent: { type: Number, default: 10 },
    pfPercent: { type: Number, default: 12 },
    professionalTax: { type: Number, default: 200 },
    otherDeductionsPercent: { type: Number, default: 0 },
    bonusType: { type: String, enum: ['Fixed', 'Percentage'], default: 'Fixed' }
  },
  notifications: {
    emailEnabled: { type: Boolean, default: true },
    payrollCompletedAlerts: { type: Boolean, default: true },
    pendingReminders: { type: Boolean, default: true },
    newEmployeeAlerts: { type: Boolean, default: true }
  },
  appearance: {
    darkMode: { type: Boolean, default: false },
    themeColor: { type: String, default: '#6366f1' },
    compactView: { type: Boolean, default: false },
    fontSize: { type: String, enum: ['Small', 'Medium', 'Large'], default: 'Medium' }
  },
  security: {
    twoFactorAuth: { type: Boolean, default: false },
    sessionTimeout: { type: Number, default: 30 } // minutes
  }
}, { timestamps: true });

module.exports = mongoose.model('Setting', SettingSchema);
