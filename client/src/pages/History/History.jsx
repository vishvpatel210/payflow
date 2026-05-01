import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, Activity, CheckCircle2, ShieldCheck, UserPlus, RefreshCw, Loader2, Settings
} from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import api from '../../config/axios';

const History = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/activities');
      setActivities(res.data || []);
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchHistory();

    // Poll every 5 seconds for real-time updates
    const interval = setInterval(() => {
      fetchHistory();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateObj) => {
    return new Date(dateObj).toLocaleString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Processing': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'Failed': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-amber-50 text-amber-600 border-amber-100';
    }
  };

  const getIconForAction = (action) => {
    if (action.includes('Employee Added')) return { icon: <UserPlus className="text-emerald-500" size={16} />, bg: 'bg-emerald-50' };
    if (action.includes('Employee Updated')) return { icon: <RefreshCw className="text-blue-500" size={16} />, bg: 'bg-blue-50' };
    if (action.includes('Employee Removed')) return { icon: <Activity className="text-red-500" size={16} />, bg: 'bg-red-50' };
    if (action.includes('Payroll')) return { icon: <Activity className="text-indigo-500" size={16} />, bg: 'bg-indigo-50' };
    if (action.includes('Settings')) return { icon: <Settings className="text-purple-500" size={16} />, bg: 'bg-purple-50' };
    
    return { icon: <Activity className="text-slate-500" size={16} />, bg: 'bg-slate-50' };
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 font-outfit mb-2 flex items-center gap-3">
              Activity History
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </h1>
            <p className="text-sm text-slate-500">Live audit trail of system activities and changes.</p>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden mb-8">
          <div className="bg-slate-50 border-b border-slate-100 px-8 py-5 flex items-center gap-3">
            <Clock size={18} className="text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Live Activity Feed</h3>
          </div>

          <div className="overflow-x-auto hide-scrollbar min-h-[400px] relative">
            {loading && activities.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm z-10">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Live Feed...</p>
              </div>
            ) : activities.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                  <Activity size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-700">No activity found</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-sm">System events will appear here in real-time once actions are performed.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date & Time</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Activity Type</th>
                    <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {activities.map((activity, idx) => {
                    const { icon, bg } = getIconForAction(activity.action);
                    return (
                      <motion.tr 
                        key={activity._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        <td className="px-8 py-5">
                          <p className="text-xs font-bold text-slate-800">{formatDate(activity.createdAt)}</p>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center`}>
                              {icon}
                            </div>
                            <span className="text-xs font-bold text-slate-700">{activity.action}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-xs font-medium text-slate-600 max-w-md">{activity.description}</p>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <span className={`px-3 py-1.5 rounded-full text-[9px] font-bold tracking-widest uppercase inline-flex items-center gap-1.5 border ${getStatusStyle(activity.status)}`}>
                            <div className={`w-1.5 h-1.5 rounded-full bg-current`} />
                            {activity.status}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default History;
