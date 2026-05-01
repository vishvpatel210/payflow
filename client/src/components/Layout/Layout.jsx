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
  Search,
  Bell,
  UserPlus,
  Zap
} from 'lucide-react';

import { useGlobalSettings } from '../../context/SettingsContext';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useGlobalSettings();

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userName = user?.name || 'User Account';
  const userEmail = user?.email || 'admin@payflow.com';
  const avatarSeed = user?.name || user?.email || 'User Account';
  const avatarUrl = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(avatarSeed)}&background=random`;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#F8FAFC] border-r border-slate-200 flex flex-col justify-between hidden md:flex shrink-0">
        <div className="p-6">
          <div className="mb-10">
            <h1 className="text-xl font-bold text-slate-800 font-outfit">
              {settings?.company?.name || 'The Atelier'}
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mt-1">Admin Workspace</p>
          </div>

          <nav className="space-y-1">
            <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/dashboard') ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>
              <LayoutDashboard size={18} />
              <span className="text-sm">Dashboard</span>
            </Link>
            <Link to="/employees" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/employees') ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>
              <Users size={18} />
              <span className="text-sm">Employees</span>
            </Link>
            <Link to="/payroll" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/payroll') ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>
              <Wallet size={18} />
              <span className="text-sm">Payroll</span>
            </Link>
            <Link to="/reports" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/reports') ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>
              <FileBarChart size={18} />
              <span className="text-sm">Reports</span>
            </Link>
            <Link to="/configuration" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/configuration') ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>
              <Settings2 size={18} />
              <span className="text-sm">Configuration</span>
            </Link>
            <Link to="/settings" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive('/settings') ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>
              <Settings size={18} />
              <span className="text-sm">Settings</span>
            </Link>
          </nav>
        </div>

        <div className="p-6 space-y-3">
          <Link to="/payroll" className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-md shadow-indigo-500/20 text-sm">
            <Zap size={16} /> Process Payroll
          </Link>
          <Link to="/employees/new" className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm text-sm">
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white rounded-l-3xl shadow-[-10px_0_30px_rgba(0,0,0,0.02)] border-l border-slate-100">
        
        {/* Top Header */}
        <Navbar userName={userName} userEmail={userEmail} avatarUrl={avatarUrl} />

        {/* Scrollable Area */}
        <div className="flex-1 overflow-auto hide-scrollbar p-8 bg-[#F8FAFC]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
