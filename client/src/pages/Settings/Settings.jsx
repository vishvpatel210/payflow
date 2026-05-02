import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Wallet2, 
  Percent, 
  Users2, 
  BellRing, 
  ShieldCheck, 
  Palette, 
  Database,
  Save,
  RotateCcw,
  Upload,
  Search,
  Check,
  Loader2,
  Trash2,
  ChevronRight,
  Monitor,
  Lock,
  Mail,
  MapPin,
  Clock,
  Download,
  Calendar
} from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import api from '../../config/axios';
import toast from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('company');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      setSettings(response.data);
    } catch (err) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await api.put('/settings', settings);
      setSettings(response.data);
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      try {
        const response = await api.post('/settings/reset');
        setSettings(response.data);
        toast.success('Settings reset to default');
      } catch (err) {
        toast.error('Failed to reset settings');
      }
    }
  };

  const updateNestedSetting = (category, field, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const tabs = [
    { id: 'company', label: 'Company', icon: Building2 },
    { id: 'payroll', label: 'Payroll', icon: Wallet2 },
    { id: 'tax', label: 'Tax & Deductions', icon: Percent },
    { id: 'users', label: 'User Management', icon: Users2 },
    { id: 'notifications', label: 'Notifications', icon: BellRing },
    { id: 'security', label: 'Security', icon: ShieldCheck },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'backup', label: 'Backup & Export', icon: Database },
  ];

  if (loading || !settings) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Syncing Configuration...</p>
        </div>
      </Layout>
    );
  }

  const filteredTabs = tabs.filter(tab => 
    tab.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 font-outfit mb-2">System Settings</h1>
            <p className="text-sm text-slate-500">Configure your atelier's organizational and operational parameters.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleReset}
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-all"
            >
              <RotateCcw size={16} /> Reset Default
            </button>
            <button 
              onClick={() => handleSave()}
              disabled={saving}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all disabled:opacity-70"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save All Changes
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 min-h-[70vh]">
          {/* Sidebar Tabs */}
          <div className="lg:w-72 shrink-0">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-4 shadow-sm h-full">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search settings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
              <div className="space-y-1">
                {filteredTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${
                      activeTab === tab.id 
                      ? 'bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                    }`}
                  >
                    <tab.icon size={18} />
                    <span className="text-sm font-bold">{tab.label}</span>
                    {activeTab === tab.id && <motion.div layoutId="activeTab" className="ml-auto"><ChevronRight size={14} /></motion.div>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-8 lg:p-10 hide-scrollbar">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Category Sections */}
                  {activeTab === 'company' && (
                    <div className="space-y-8">
                      <SectionTitle title="Company Information" description="Identity and regional configuration for your atelier." />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup label="Company Name" icon={Building2}>
                          <input 
                            type="text" 
                            value={settings.company.name}
                            onChange={(e) => updateNestedSetting('company', 'name', e.target.value)}
                            className="settings-input" 
                          />
                        </InputGroup>
                        <InputGroup label="Company Email" icon={Mail}>
                          <input 
                            type="email" 
                            value={settings.company.email}
                            onChange={(e) => updateNestedSetting('company', 'email', e.target.value)}
                            className="settings-input" 
                          />
                        </InputGroup>
                        <div className="md:col-span-2">
                          <InputGroup label="Address" icon={MapPin}>
                            <textarea 
                              rows={3} 
                              value={settings.company.address}
                              onChange={(e) => updateNestedSetting('company', 'address', e.target.value)}
                              className="settings-input resize-none" 
                            />
                          </InputGroup>
                        </div>
                        <InputGroup label="Currency" icon={Wallet2}>
                          <select 
                            value={settings.company.currency}
                            onChange={(e) => updateNestedSetting('company', 'currency', e.target.value)}
                            className="settings-input"
                          >
                            <option value="INR">INR (₹)</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                          </select>
                        </InputGroup>
                        <InputGroup label="Timezone" icon={Clock}>
                          <select 
                            value={settings.company.timezone}
                            onChange={(e) => updateNestedSetting('company', 'timezone', e.target.value)}
                            className="settings-input"
                          >
                            <option value="UTC+5:30">India (GMT+5:30)</option>
                            <option value="UTC+0:00">Universal (GMT+0:00)</option>
                          </select>
                        </InputGroup>
                      </div>
                      <div className="pt-6 border-t border-slate-50">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Company Logo</label>
                        <div className="flex items-center gap-6">
                          <div className="w-20 h-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400">
                            <Building2 size={32} />
                          </div>
                          <button className="px-5 py-2.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-white transition-all">
                            <Upload size={16} /> Upload New Logo
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'payroll' && (
                    <div className="space-y-8">
                      <SectionTitle title="Payroll Execution" description="Rules for automated and manual payroll processing cycles." />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <InputGroup label="Salary Cycle Start Date" icon={Calendar}>
                          <input 
                            type="number" 
                            min="1" max="31"
                            value={settings.payroll.cycleDate}
                            onChange={(e) => updateNestedSetting('payroll', 'cycleDate', parseInt(e.target.value))}
                            className="settings-input" 
                          />
                        </InputGroup>
                        <InputGroup label="Payroll Processing Date" icon={Clock}>
                          <input 
                            type="number" 
                            min="1" max="31"
                            value={settings.payroll.processingDate}
                            onChange={(e) => updateNestedSetting('payroll', 'processingDate', parseInt(e.target.value))}
                            className="settings-input" 
                          />
                        </InputGroup>
                      </div>
                      <div className="space-y-4 pt-6 border-t border-slate-50">
                        <ToggleGroup 
                          title="Auto Select Current Month" 
                          description="Automatically select the running month on dashboard load." 
                          checked={settings.payroll.autoSelectMonth}
                          onChange={(val) => updateNestedSetting('payroll', 'autoSelectMonth', val)}
                        />
                        <ToggleGroup 
                          title="Auto Payroll Generation" 
                          description="Draft payroll records automatically at the end of each cycle." 
                          checked={settings.payroll.autoGeneration}
                          onChange={(val) => updateNestedSetting('payroll', 'autoGeneration', val)}
                        />
                        <ToggleGroup 
                          title="Enable Overtime Tracking" 
                          description="Allow overtime calculations based on additional hours worked." 
                          checked={settings.payroll.overtimeEnabled}
                          onChange={(val) => updateNestedSetting('payroll', 'overtimeEnabled', val)}
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'tax' && (
                    <div className="space-y-8">
                      <SectionTitle title="Tax & Deductions" description="Configure regional compliance and benefit deduction rates." />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <InputGroup label="Income Tax (%)" icon={Percent}>
                          <input 
                            type="number" 
                            value={settings.tax.incomeTaxPercent}
                            onChange={(e) => updateNestedSetting('tax', 'incomeTaxPercent', parseFloat(e.target.value))}
                            className="settings-input" 
                          />
                        </InputGroup>
                        <InputGroup label="EPF Contribution (%)" icon={Percent}>
                          <input 
                            type="number" 
                            value={settings.tax.pfPercent}
                            onChange={(e) => updateNestedSetting('tax', 'pfPercent', parseFloat(e.target.value))}
                            className="settings-input" 
                          />
                        </InputGroup>
                        <InputGroup label="Professional Tax (Fixed)" icon={Wallet2}>
                          <input 
                            type="number" 
                            value={settings.tax.professionalTax}
                            onChange={(e) => updateNestedSetting('tax', 'professionalTax', parseFloat(e.target.value))}
                            className="settings-input" 
                          />
                        </InputGroup>
                        <InputGroup label="Bonus Calculation Type" icon={Building2}>
                          <select 
                            value={settings.tax.bonusType}
                            onChange={(e) => updateNestedSetting('tax', 'bonusType', e.target.value)}
                            className="settings-input"
                          >
                            <option value="Fixed">Fixed Amount</option>
                            <option value="Percentage">Percentage of Base</option>
                          </select>
                        </InputGroup>
                      </div>
                    </div>
                  )}

                  {activeTab === 'users' && (
                    <div className="space-y-8">
                      <div className="flex justify-between items-start">
                        <SectionTitle title="User Management" description="Manage access levels for HR and Finance administrators." />
                        <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all">
                          + Add Admin User
                        </button>
                      </div>
                      <div className="bg-slate-50 rounded-2xl overflow-hidden">
                        <div className="px-6 py-4 flex items-center justify-between hover:bg-white transition-all border-b border-white">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">A</div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">Admin Account</p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Super Admin</p>
                            </div>
                          </div>
                          <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-bold tracking-widest uppercase">Full Access</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'notifications' && (
                    <div className="space-y-8">
                      <SectionTitle title="Communication Preferences" description="Configure when and how to receive system alerts." />
                      <div className="space-y-4">
                        <ToggleGroup 
                          title="Global Email Notifications" 
                          checked={settings.notifications.emailEnabled}
                          onChange={(val) => updateNestedSetting('notifications', 'emailEnabled', val)}
                        />
                        <ToggleGroup 
                          title="Payroll Completion Alerts" 
                          checked={settings.notifications.payrollCompletedAlerts}
                          onChange={(val) => updateNestedSetting('notifications', 'payrollCompletedAlerts', val)}
                        />
                        <ToggleGroup 
                          title="Pending Payroll Reminders" 
                          checked={settings.notifications.pendingReminders}
                          onChange={(val) => updateNestedSetting('notifications', 'pendingReminders', val)}
                        />
                        <ToggleGroup 
                          title="New Employee Onboarding Alerts" 
                          checked={settings.notifications.newEmployeeAlerts}
                          onChange={(val) => updateNestedSetting('notifications', 'newEmployeeAlerts', val)}
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'security' && (
                    <div className="space-y-8">
                      <SectionTitle title="Security & Authentication" description="Protect your atelier's sensitive financial data." />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2">
                           <ToggleGroup 
                            title="Two-Factor Authentication (2FA)" 
                            description="Require an additional code to log in to the admin panel."
                            checked={settings.security.twoFactorAuth}
                            onChange={(val) => updateNestedSetting('security', 'twoFactorAuth', val)}
                          />
                        </div>
                        <InputGroup label="Session Timeout (Minutes)" icon={Clock}>
                          <input 
                            type="number" 
                            value={settings.security.sessionTimeout}
                            onChange={(e) => updateNestedSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                            className="settings-input" 
                          />
                        </InputGroup>
                      </div>
                      <div className="pt-6 border-t border-slate-50">
                        <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all">
                          <Lock size={16} /> Change Master Password
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'appearance' && (
                    <div className="space-y-8">
                      <SectionTitle title="Interface Preferences" description="Customize how the PayFlow dashboard looks for you." />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2">
                           <ToggleGroup 
                            title="Dark Mode Interface" 
                            checked={settings.appearance.darkMode}
                            onChange={(val) => updateNestedSetting('appearance', 'darkMode', val)}
                          />
                        </div>
                        <InputGroup label="Theme Primary Color" icon={Palette}>
                          <div className="flex items-center gap-3">
                            <input 
                              type="color" 
                              value={settings.appearance.themeColor}
                              onChange={(e) => updateNestedSetting('appearance', 'themeColor', e.target.value)}
                              className="w-10 h-10 border-none rounded-xl cursor-pointer bg-transparent" 
                            />
                            <span className="text-sm font-bold text-slate-600 uppercase">{settings.appearance.themeColor}</span>
                          </div>
                        </InputGroup>
                        <InputGroup label="Dashboard Font Size" icon={Monitor}>
                          <select 
                            value={settings.appearance.fontSize}
                            onChange={(e) => updateNestedSetting('appearance', 'fontSize', e.target.value)}
                            className="settings-input"
                          >
                            <option value="Small">Small</option>
                            <option value="Medium">Medium</option>
                            <option value="Large">Large</option>
                          </select>
                        </InputGroup>
                        <div className="md:col-span-2">
                          <ToggleGroup 
                            title="Compact Data Tables" 
                            description="Display more rows in employee and payroll tables."
                            checked={settings.appearance.compactView}
                            onChange={(val) => updateNestedSetting('appearance', 'compactView', val)}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'backup' && (
                    <div className="space-y-8">
                      <SectionTitle title="Data & Backups" description="Export records and manage system snapshots." />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <BackupCard title="Export Employees" description="Download master directory as CSV" icon={Download} />
                        <BackupCard title="Export Payroll" description="Download all historical records as PDF" icon={Download} />
                        <BackupCard title="Database Snapshot" description="Create a full system backup" icon={Database} primary />
                        <BackupCard title="Import Directory" description="Bulk upload employees via CSV" icon={Upload} />
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="px-10 py-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Synced: {new Date(settings.updatedAt).toLocaleString()}</p>
               <button 
                onClick={() => handleSave()}
                disabled={saving}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all disabled:opacity-70"
               >
                 {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={14} />}
                 Save {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings
               </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

/* ─── UI Helper Components ───────────────────────────────── */

const SectionTitle = ({ title, description }) => (
  <div className="mb-6">
    <h2 className="text-xl font-bold text-slate-800 font-outfit mb-1">{title}</h2>
    <p className="text-xs text-slate-400 font-medium">{description}</p>
  </div>
);

const InputGroup = ({ label, children, icon: Icon }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">{label}</label>
    <div className="relative group">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />}
      {children}
    </div>
  </div>
);

const ToggleGroup = ({ title, description, checked, onChange }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-white transition-all cursor-default group">
    <div>
      <h4 className="text-sm font-bold text-slate-700">{title}</h4>
      {description && <p className="text-[10px] text-slate-400 font-medium">{description}</p>}
    </div>
    <button 
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full relative transition-all duration-300 ${checked ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.3)]' : 'bg-slate-200'}`}
    >
      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  </div>
);

const BackupCard = ({ title, description, icon: Icon, primary }) => (
  <button className={`p-6 rounded-[2rem] border transition-all text-left group flex items-start gap-4 ${
    primary ? 'bg-indigo-600 border-indigo-700 text-white' : 'bg-white border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30'
  }`}>
    <div className={`p-3 rounded-2xl ${primary ? 'bg-white/20' : 'bg-indigo-50 text-indigo-600 group-hover:bg-white'}`}>
      <Icon size={20} />
    </div>
    <div>
      <h4 className={`text-sm font-bold ${primary ? 'text-white' : 'text-slate-800'}`}>{title}</h4>
      <p className={`text-[10px] font-medium ${primary ? 'text-indigo-100' : 'text-slate-400'}`}>{description}</p>
    </div>
  </button>
);

export default Settings;
