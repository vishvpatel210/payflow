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
  Zap,
  Menu
} from 'lucide-react';

import { useGlobalSettings } from '../../context/SettingsContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useState } from 'react';

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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] font-sans overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white md:rounded-l-3xl shadow-[-10px_0_30px_rgba(0,0,0,0.02)] border-l border-slate-100">
        
        {/* Top Header */}
        <Navbar 
          userName={userName} 
          userEmail={userEmail} 
          avatarUrl={avatarUrl} 
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        {/* Scrollable Area */}
        <div className="flex-1 overflow-auto hide-scrollbar p-4 sm:p-8 bg-[#F8FAFC]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
