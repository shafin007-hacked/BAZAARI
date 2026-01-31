
import React, { useState } from 'react';
import { Shield, Users, DollarSign, AlertCircle, Clock, PackageOpen, SearchX } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ads' | 'payments'>('ads');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">System Administration</h1>
          <p className="text-slate-500 dark:text-slate-400">Moderation and financial verification dashboard.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 dark:bg-slate-800 text-white px-4 py-2.5 rounded-2xl self-start">
          <Shield className="w-5 h-5 text-teal-400" />
          <span className="font-bold text-sm">Owner Access Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Pending Ads', val: '0', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/20' },
          { label: 'Active Users', val: '1', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/20' },
          { label: 'Total Revenue', val: '৳0', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/20' },
          { label: 'Scam Reports', val: '0', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/20' }
        ].map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className={`${kpi.bg} ${kpi.color} p-4 rounded-2xl`}>
              <kpi.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">{kpi.val}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
        <button onClick={() => setActiveTab('ads')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'ads' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500'}`}>Ad Moderation</button>
        <button onClick={() => setActiveTab('payments')} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'payments' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500'}`}>Verify Payments</button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
         <div className="p-6 border-b"><h3 className="font-bold">Pending Queue</h3></div>
         <div className="flex-1 flex flex-col items-center justify-center text-center p-20">
            <SearchX className="w-16 h-16 text-slate-200 mb-4" />
            <h3 className="text-xl font-bold">Queue is empty</h3>
            <p className="text-slate-500 max-w-xs mx-auto text-sm mt-2">All items have been processed. Great job!</p>
         </div>
      </div>
    </div>
  );
};

export default AdminPanel;
