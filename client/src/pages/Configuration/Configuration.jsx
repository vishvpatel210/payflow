import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Banknote,
  Receipt,
  Globe2,
  ChevronDown
} from 'lucide-react';
import Layout from '../../components/Layout/Layout';

const Configuration = () => {
  const [bonus, setBonus] = useState('5000');
  const [bonusType, setBonusType] = useState('fixed');
  
  const [incomeTax, setIncomeTax] = useState('10');
  const [incomeTaxEnabled, setIncomeTaxEnabled] = useState(true);
  
  const [pf, setPf] = useState('12');
  const [pfEnabled, setPfEnabled] = useState(true);
  
  const [otherDeductions, setOtherDeductions] = useState('0');
  const [otherEnabled, setOtherEnabled] = useState(false);

  // Live Calculator Logic
  const baseSalary = 50000;
  
  const parsedBonus = parseFloat(bonus) || 0;
  const calculatedBonus = bonusType === 'fixed' ? parsedBonus : (baseSalary * parsedBonus) / 100;
  
  const parsedTax = parseFloat(incomeTax) || 0;
  const calculatedTax = incomeTaxEnabled ? (baseSalary * parsedTax) / 100 : 0;
  
  const parsedPf = parseFloat(pf) || 0;
  const calculatedPf = pfEnabled ? (baseSalary * parsedPf) / 100 : 0;
  
  const parsedOther = parseFloat(otherDeductions) || 0;
  const calculatedOther = otherEnabled ? (baseSalary * parsedOther) / 100 : 0;

  const estimatedNet = baseSalary + calculatedBonus - calculatedTax - calculatedPf - calculatedOther;

  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-slate-800 font-outfit mb-2">Tax & Salary Configuration</h1>
            <p className="text-sm text-slate-500 max-w-lg leading-relaxed">
              Manage earnings and deductions applied during payroll to ensure accurate employee compensation.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-8 text-sm font-bold text-slate-500"
          >
            <button className="hover:text-slate-800 transition-colors">Earnings</button>
            <button className="hover:text-slate-800 transition-colors">Deductions</button>
            <div className="relative text-indigo-600">
              <button>Compliance</button>
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-indigo-600 rounded-full shadow-[0_2px_8px_rgba(79,70,229,0.4)]"></div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Earnings Configuration */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-[0_2px_20px_rgb(0,0,0,0.02)] transition-shadow hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  <Banknote size={20} />
                </div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Earnings Configuration</h3>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Performance Bonus</label>
                  <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                    <button 
                      onClick={() => setBonusType('fixed')}
                      className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${bonusType === 'fixed' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                      Fixed (₹)
                    </button>
                    <button 
                      onClick={() => setBonusType('percentage')}
                      className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${bonusType === 'percentage' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                      Percentage (%)
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <input 
                    type="number" 
                    value={bonus}
                    onChange={(e) => setBonus(e.target.value)}
                    className="w-full pl-4 pr-16 py-4 bg-white border border-slate-200 rounded-xl text-lg font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    {bonusType === 'fixed' ? 'INR' : '%'}
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">Optional performance-based bonus added to salary</p>
              </div>
            </motion.div>

            {/* Deductions Configuration */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-[0_2px_20px_rgb(0,0,0,0.02)] transition-shadow hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-8"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  <Receipt size={20} />
                </div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Deductions</h3>
              </div>
              
              {/* Income Tax */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Income Tax (%)</label>
                  <button 
                    onClick={() => setIncomeTaxEnabled(!incomeTaxEnabled)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${incomeTaxEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${incomeTaxEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>
                <input 
                  type="number" 
                  value={incomeTax}
                  onChange={(e) => setIncomeTax(e.target.value)}
                  disabled={!incomeTaxEnabled}
                  className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl text-lg font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-50 disabled:bg-slate-50"
                />
                <p className="text-[10px] text-slate-400 mt-2 font-medium">Statutory income tax deducted at source</p>
              </div>

              {/* Provident Fund */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Provident Fund (PF %)</label>
                  <button 
                    onClick={() => setPfEnabled(!pfEnabled)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${pfEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${pfEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>
                <input 
                  type="number" 
                  value={pf}
                  onChange={(e) => setPf(e.target.value)}
                  disabled={!pfEnabled}
                  className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl text-lg font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-50 disabled:bg-slate-50"
                />
                <p className="text-[10px] text-slate-400 mt-2 font-medium">Employee contribution to the retirement fund</p>
              </div>

              {/* Other Deductions */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Other Deductions (%)</label>
                  <button 
                    onClick={() => setOtherEnabled(!otherEnabled)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${otherEnabled ? 'bg-indigo-600' : 'bg-slate-200'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${otherEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>
                <input 
                  type="number" 
                  value={otherDeductions}
                  onChange={(e) => setOtherDeductions(e.target.value)}
                  disabled={!otherEnabled}
                  className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl text-lg font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all disabled:opacity-50 disabled:bg-slate-50"
                />
                <p className="text-[10px] text-slate-400 mt-2 font-medium">Miscellaneous deductions including health insurance or gym</p>
              </div>
            </motion.div>

            {/* Jurisdiction */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-[0_2px_20px_rgb(0,0,0,0.02)] transition-shadow hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  <Globe2 size={20} />
                </div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Jurisdiction</h3>
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block mb-3">Primary Country Selector</label>
                <div className="relative">
                  <select className="w-full px-4 py-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer">
                    <option value="India">India</option>
                    <option value="USA">United States</option>
                    <option value="UK">United Kingdom</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4 pt-4"
            >
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/30">
                Save Changes
              </button>
              <button className="bg-[#F8FAFC] hover:bg-slate-100 text-slate-600 px-8 py-3.5 rounded-xl font-bold text-sm transition-all">
                Reset
              </button>
            </motion.div>

          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Salary Breakdown */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-[2rem] shadow-[0_10px_40px_rgb(0,0,0,0.06)] border border-slate-100 overflow-hidden"
            >
              <div className="p-8 pb-6">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-lg font-bold text-slate-800 font-outfit">Live Salary Breakdown</h3>
                  <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest">
                    Draft View
                  </span>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm font-medium">Base Salary</span>
                    <span className="text-slate-800 font-bold">{formatINR(baseSalary)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      <span className="text-slate-500 text-sm font-medium">Bonus</span>
                    </div>
                    <span className="text-emerald-500 font-bold">
                      + {formatINR(calculatedBonus)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                      <span className="text-slate-500 text-sm font-medium">
                        Income Tax ({incomeTaxEnabled ? incomeTax : 0}%)
                      </span>
                    </div>
                    <span className="text-red-500 font-bold">
                      - {formatINR(calculatedTax)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                      <span className="text-slate-500 text-sm font-medium">
                        Provident Fund ({pfEnabled ? pf : 0}%)
                      </span>
                    </div>
                    <span className="text-red-500 font-bold">
                      - {formatINR(calculatedPf)}
                    </span>
                  </div>
                  
                  {otherEnabled && (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                        <span className="text-slate-500 text-sm font-medium">
                          Other Deductions ({otherDeductions}%)
                        </span>
                      </div>
                      <span className="text-red-500 font-bold">
                        - {formatINR(calculatedOther)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Net Salary Block */}
              <div className="p-8 text-white relative overflow-hidden selection:bg-white selection:text-indigo-600" style={{ backgroundColor: '#4f46e5' }}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>
                <div className="relative z-10">
                  <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-1">Estimated Net Salary</p>
                  <div className="flex items-end gap-1 mb-4">
                    <h2 className="text-5xl font-bold font-outfit">
                      ₹{estimatedNet.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </h2>
                    <span className="text-xl font-bold text-indigo-300 mb-1">
                      .{(estimatedNet % 1).toFixed(2).substring(2)}
                    </span>
                  </div>
                  <p className="text-[10px] text-indigo-200/80 leading-relaxed font-medium">
                    This is an estimated value based on the current configuration. 
                    Actual payouts may vary based on attendance and additional compliance rules.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Compliance Banner */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="rounded-[2rem] overflow-hidden relative shadow-[0_10px_40px_rgb(0,0,0,0.1)]"
            >
              {/* Reliable dark background fallback via inline styles to bypass cache issues */}
              <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(to bottom right, #312e81, #0f172a)' }}></div>
              
              {/* Premium geometric background elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 pointer-events-none"></div>
              
              <div className="relative z-10 p-8 h-40 flex flex-col justify-end backdrop-blur-sm selection:bg-white selection:text-slate-900">
                <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1 shadow-sm">Compliance Status</p>
                <h3 className="text-white text-xl font-bold tracking-wide drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">Standard Regional Policy Applied</h3>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Configuration;
