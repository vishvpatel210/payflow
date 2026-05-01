import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  FileBarChart, 
  Settings2, 
  Settings, 
  HelpCircle, 
  LogOut,
  UserPlus,
  Zap
} from 'lucide-react';
import { useGlobalSettings } from '../../context/SettingsContext';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useGlobalSettings();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#F8FAFC] border-r border-slate-200 flex flex-col justify-between transform transition-transform duration-300 ease-in-out shrink-0 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 overflow-y-auto hide-scrollbar">
          <div className="mb-10">
            <h1 className="text-xl font-bold text-slate-800 font-outfit">
              {settings?.company?.name || 'The Atelier'}
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mt-1">Admin Workspace</p>
          </div>

          <nav className="space-y-1">
            <Link to="/dashboard" onClick={onClose} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/dashboard') ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>
              <LayoutDashboard size={18} />
              <span className="text-sm">Dashboard</span>
            </Link>
            <Link to="/employees" onClick={onClose} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/employees') ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>
              <Users size={18} />
              <span className="text-sm">Employees</span>
            </Link>
            <Link to="/payroll" onClick={onClose} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/payroll') ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>
              <Wallet size={18} />
              <span className="text-sm">Payroll</span>
            </Link>
            <Link to="/reports" onClick={onClose} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/reports') ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>
              <FileBarChart size={18} />
              <span className="text-sm">Reports</span>
            </Link>
            <Link to="/configuration" onClick={onClose} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/configuration') ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>
              <Settings2 size={18} />
              <span className="text-sm">Configuration</span>
            </Link>
            <Link to="/settings" onClick={onClose} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/settings') ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>
              <Settings size={18} />
              <span className="text-sm">Settings</span>
            </Link>
          </nav>
        </div>

        <div className="p-6 space-y-3 shrink-0 bg-[#F8FAFC]">
          <Link to="/payroll" onClick={onClose} className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-md shadow-indigo-500/20 text-sm">
            <Zap size={16} /> Process Payroll
          </Link>
          <Link to="/employees/new" onClick={onClose} className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm text-sm">
            <UserPlus size={16} /> Add Employee
          </Link>
          <div className="pt-4 border-t border-slate-200 mt-4">
            <a href="#" className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold uppercase tracking-wider transition-colors">
              <HelpCircle size={14} /> Help Center
            </a>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-red-500 text-xs font-semibold uppercase tracking-wider transition-colors text-left">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
