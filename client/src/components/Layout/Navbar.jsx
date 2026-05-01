import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Search as SearchIcon, Bell, Settings2, Loader2, ArrowRight, UserPlus, RefreshCw, Activity, Settings } from 'lucide-react';
import api from '../../config/axios';

const Navbar = ({ userName, userEmail, avatarUrl }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdowns on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/activities');
        setNotifications(res.data?.slice(0, 4) || []);
      } catch (err) {
        console.error('Failed to load notifications', err);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setDropdownOpen(false);
      return;
    }

    setDropdownOpen(true);
    
    if (location.pathname === '/employees') {
      setLoading(true);
      try {
        const res = await api.get(`/employees?search=${query}`);
        setSearchResults(res.data.employees?.slice(0, 5) || []);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    } else if (location.pathname === '/payroll') {
      setLoading(true);
      try {
        const res = await api.get('/payroll/current');
        const payrollEmployees = res.data.employees || [];
        const filtered = payrollEmployees.filter(emp => 
          emp.name.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filtered.slice(0, 5));
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // Other pages: show suggestions
      setSearchResults([]);
    }
  };

  const handleResultClick = (result) => {
    setDropdownOpen(false);
    setSearchQuery('');
    if (location.pathname === '/employees') {
      navigate(`/employees?search=${encodeURIComponent(result.name)}`);
    } else if (location.pathname === '/payroll') {
      navigate(`/payroll?search=${encodeURIComponent(result.name)}`);
    }
  };

  const getIconForAction = (action) => {
    if (action.includes('Employee Added')) return { icon: <UserPlus className="text-emerald-500" size={14} />, bg: 'bg-emerald-50' };
    if (action.includes('Employee Updated')) return { icon: <RefreshCw className="text-blue-500" size={14} />, bg: 'bg-blue-50' };
    if (action.includes('Employee Removed')) return { icon: <Activity className="text-red-500" size={14} />, bg: 'bg-red-50' };
    if (action.includes('Payroll')) return { icon: <Activity className="text-indigo-500" size={14} />, bg: 'bg-indigo-50' };
    if (action.includes('Settings')) return { icon: <Settings className="text-purple-500" size={14} />, bg: 'bg-purple-50' };
    
    return { icon: <Activity className="text-slate-500" size={14} />, bg: 'bg-slate-50' };
  };

  const isHistoryActive = location.pathname === '/history';
  
  return (
    <header className="h-20 border-b border-slate-100 flex items-center justify-between px-8 bg-white shrink-0 relative z-30">
      <div className="relative w-96 group" ref={dropdownRef}>
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="SEARCH DIRECTORY..." 
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold tracking-wider text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all uppercase placeholder-slate-400"
        />
        
        {/* Search Dropdown */}
        {dropdownOpen && searchQuery.trim() && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
            {location.pathname !== '/employees' && location.pathname !== '/payroll' ? (
              <div className="p-2 space-y-1">
                <p className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quick Navigation</p>
                <Link to="/employees" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-xl transition-colors text-sm font-semibold text-slate-700">
                  <ArrowRight size={14} className="text-indigo-500" /> Go to Employees
                </Link>
                <Link to="/payroll" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-xl transition-colors text-sm font-semibold text-slate-700">
                  <ArrowRight size={14} className="text-indigo-500" /> Go to Payroll
                </Link>
                <Link to="/reports" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-xl transition-colors text-sm font-semibold text-slate-700">
                  <ArrowRight size={14} className="text-indigo-500" /> Go to Reports
                </Link>
                <Link to="/configuration" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-xl transition-colors text-sm font-semibold text-slate-700">
                  <ArrowRight size={14} className="text-indigo-500" /> Go to Configuration
                </Link>
              </div>
            ) : loading ? (
              <div className="p-4 flex justify-center">
                <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
              </div>
            ) : searchResults.length > 0 ? (
              <div className="p-2 space-y-1">
                <p className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Results</p>
                {searchResults.map((result) => (
                  <button 
                    key={result._id || result.employeeId} 
                    onClick={() => handleResultClick(result)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-xl transition-colors text-left"
                  >
                    <img 
                      src={result.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${result.name}`} 
                      alt={result.name}
                      className="w-8 h-8 rounded-full border border-slate-200 bg-slate-50 object-cover"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-700">{result.name}</p>
                      <p className="text-[10px] font-semibold text-slate-500 uppercase">{result.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center">
                <p className="text-sm font-semibold text-slate-500">No results found</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-8 items-center h-full">
        <div className="flex gap-6 h-full text-sm font-bold text-slate-400 tracking-wider uppercase">
          <Link 
            to={isHistoryActive ? "/dashboard" : "#"} 
            onClick={(e) => {
              if (!isHistoryActive) e.preventDefault();
            }}
            className={`flex items-center h-full transition-colors ${!isHistoryActive ? 'relative text-indigo-800 border-b-2 border-indigo-600' : 'hover:text-slate-600'}`}
          >
            DIRECTORY
          </Link>
          <Link 
            to="/history"
            className={`flex items-center h-full transition-colors ${isHistoryActive ? 'relative text-indigo-800 border-b-2 border-indigo-600' : 'hover:text-slate-600'}`}
          >
            HISTORY
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className={`relative p-2 transition-colors rounded-xl ${notificationsOpen ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
            >
              <Bell size={20} />
              {notifications.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>}
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
                  <Link to="/history" onClick={() => setNotificationsOpen(false)} className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest hover:text-indigo-600">View All</Link>
                </div>
                <div className="max-h-80 overflow-y-auto hide-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map(notif => {
                      const { icon, bg } = getIconForAction(notif.action);
                      return (
                        <div key={notif._id} className="px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-3">
                          <div className={`w-8 h-8 rounded-full ${bg} shrink-0 flex items-center justify-center mt-0.5`}>
                            {icon}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 mb-0.5">{notif.action}</p>
                            <p className="text-[10px] text-slate-500 leading-relaxed mb-1 line-clamp-2">{notif.description}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                              {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-xs font-medium text-slate-500">No new notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <Link to="/settings" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
            <Settings2 size={20} />
          </Link>
          
          <div className="h-8 w-px bg-slate-200 mx-2"></div>
          
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-800">{userName}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{userEmail}</p>
            </div>
            <img src={avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-indigo-100 bg-indigo-50 object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
