"use client";

import React, { useState } from 'react';
import { 
  Bell, CheckCircle2, AlertCircle, Calendar, CreditCard, 
  DownloadCloud, HelpCircle, FileText, Smartphone, Wallet,
  Building, CheckCircle, ChevronRight, PieChart as PieChartIcon
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip 
} from 'recharts';

export default function AntiGravityFeesDashboard() {
  const [role, setRole] = useState<'parent' | 'student'>('parent');

  // Dummy Data
  const feesBreakdown = [
    { name: 'Tuition Fee', value: 45000, color: '#6366F1' }, // Indigo
    { name: 'Transport', value: 12000, color: '#8B5CF6' },   // Purple
    { name: 'Library', value: 3000, color: '#EC4899' },      // Pink
    { name: 'Exam Fee', value: 2500, color: '#3B82F6' },     // Blue
    { name: 'Other', value: 1500, color: '#14B8A6' },        // Teal
  ];
  
  const totalFees = feesBreakdown.reduce((acc, item) => acc + item.value, 0);

  const upcomingInvoices = [
    { id: 'INV-092', name: 'Tuition Fee - Term 2', student: 'Aarav Kumar', dueDate: '15 Jun 2026', amount: 15000, status: 'Due Soon' },
    { id: 'INV-093', name: 'Transport Fee - Q2', student: 'Aarav Kumar', dueDate: '30 Jun 2026', amount: 4000, status: 'Upcoming' },
    { id: 'INV-094', name: 'Library Penalty', student: 'Diya Kumar', dueDate: '10 May 2026', amount: 300, status: 'Overdue' },
  ];

  const recentTransactions = [
    { id: 'TXN-8812', date: '05 Apr 2026', desc: 'Tuition Fee - Term 1', amount: 15000, mode: 'UPI', status: 'Paid' },
    { id: 'TXN-8805', date: '02 Apr 2026', desc: 'Transport Fee - Q1', amount: 4000, mode: 'Net Banking', status: 'Paid' },
    { id: 'TXN-8742', date: '15 Jan 2026', desc: 'Admission Fee', amount: 25000, mode: 'Credit Card', status: 'Paid' },
  ];

  const installments = [
    { term: 'Term 1', date: '01 Apr', amount: 15000, status: 'paid' },
    { term: 'Term 2', date: '15 Jun', amount: 15000, status: 'current' },
    { term: 'Term 3', date: '15 Sep', amount: 15000, status: 'future' },
  ];

  const glassCard = "bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]";

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#E9EFFA] via-[#F8FAFF] to-[#E9EFFA] p-4 sm:p-8 font-sans text-slate-800 relative overflow-hidden">
      
      {/* Floating Background Shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-300/30 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[35%] bg-purple-300/30 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 p-[2px]">
                <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center overflow-hidden">
                  <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm">
                <span className="flex w-3 h-3 bg-green-500 rounded-full"></span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                {role === 'parent' ? 'Rajesh Kumar' : 'Aarav Kumar'}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
                  {role === 'parent' ? 'Parent Portal' : 'Student Portal'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* Role Toggle for Demo */}
            <div className="flex bg-white/50 backdrop-blur-md p-1 rounded-xl border border-white/60">
              <button 
                onClick={() => setRole('parent')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${role === 'parent' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Parent
              </button>
              <button 
                onClick={() => setRole('student')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${role === 'student' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Student
              </button>
            </div>
            <button className="relative p-3 bg-white/60 backdrop-blur-md border border-white/60 rounded-xl hover:bg-white transition-colors text-slate-600">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Smart Alert */}
        <div className="bg-indigo-50/80 backdrop-blur-md border border-indigo-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full">
              <AlertCircle className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-indigo-900">
              Pay before <strong className="font-bold">15 June</strong> to avoid ₹300 late fee penalty on Term 2 Tuition.
            </p>
          </div>
          <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors hidden sm:block">
            Enable Reminders
          </button>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Spans 2) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Outstanding Summary */}
            <div className={`${glassCard} flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="flex-1 space-y-4 relative z-10 w-full">
                <div>
                  <p className="text-slate-500 font-medium text-sm">Total Outstanding</p>
                  <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-800 mt-1 tracking-tight">₹21,600</h2>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium">
                  <div className="flex items-center gap-1.5 text-red-500 bg-red-50 px-2.5 py-1 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    <span>1 Overdue</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                    <ClockIcon className="w-4 h-4" />
                    <span>2 Pending</span>
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  {role === 'parent' ? (
                    <>
                      <button className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5">
                        Pay Now
                      </button>
                      <button className="flex-1 sm:flex-none px-6 py-3 bg-white/50 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-white transition-all">
                        View Invoices
                      </button>
                    </>
                  ) : (
                    <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center gap-2">
                      <HelpCircle className="w-4 h-4" />
                      Ask Guardian to Pay
                    </button>
                  )}
                </div>
              </div>

              {/* Circular Progress */}
              <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#E2E8F0" strokeWidth="8" />
                  <circle 
                    cx="50" cy="50" r="40" fill="none" 
                    stroke="url(#gradient)" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray="251.2" strokeDashoffset="103" // approx 59% (251.2 * 0.41)
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366F1" />
                      <stop offset="100%" stopColor="#A855F7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute text-center flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-slate-800">59%</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Paid</span>
                </div>
              </div>
            </div>

            {/* Installment Timeline */}
            <div className={glassCard}>
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-500" />
                Payment Timeline (2026-27)
              </h3>
              
              <div className="relative flex items-center justify-between max-w-2xl mx-auto px-4">
                {/* Connecting Line */}
                <div className="absolute left-8 right-8 top-5 h-1 bg-slate-200 rounded-full z-0"></div>
                <div className="absolute left-8 right-1/2 top-5 h-1 bg-indigo-500 rounded-full z-0"></div>

                {installments.map((inst, i) => (
                  <div key={i} className="relative z-10 flex flex-col items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-all ${
                      inst.status === 'paid' ? 'bg-green-500 text-white' : 
                      inst.status === 'current' ? 'bg-indigo-500 text-white ring-4 ring-indigo-100 shadow-indigo-500/40' : 
                      'bg-slate-200 text-slate-400'
                    }`}>
                      {inst.status === 'paid' ? <CheckCircle className="w-5 h-5" /> : <span className="font-bold text-sm">{i+1}</span>}
                    </div>
                    <div className="text-center">
                      <p className={`font-bold text-sm ${inst.status === 'current' ? 'text-indigo-600' : 'text-slate-700'}`}>{inst.term}</p>
                      <p className="text-xs text-slate-500 font-medium">{inst.date}</p>
                      <p className="text-xs font-semibold mt-1">₹{(inst.amount/1000)}k</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Invoices List */}
            <div className={`${glassCard} !p-0 overflow-hidden`}>
              <div className="p-6 border-b border-white/40 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">Pending Dues</h3>
                <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">View All</button>
              </div>
              <div className="divide-y divide-slate-100/50">
                {(role === 'student' ? upcomingInvoices.filter(i => i.student === 'Aarav Kumar') : upcomingInvoices).map((inv, i) => (
                  <div key={i} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/40 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-2xl ${
                        inv.status === 'Overdue' ? 'bg-red-100 text-red-600' : 
                        inv.status === 'Due Soon' ? 'bg-amber-100 text-amber-600' : 
                        'bg-indigo-100 text-indigo-600'
                      }`}>
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{inv.name}</h4>
                        <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                          {role === 'parent' && <span>{inv.student}</span>}
                          {role === 'parent' && <span className="w-1 h-1 bg-slate-300 rounded-full"></span>}
                          <span className={inv.status === 'Overdue' ? 'text-red-500 font-medium' : ''}>Due: {inv.dueDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      <div className="text-left sm:text-right">
                        <p className="font-extrabold text-lg text-slate-800">₹{inv.amount.toLocaleString()}</p>
                        <p className={`text-xs font-bold uppercase tracking-wider ${
                           inv.status === 'Overdue' ? 'text-red-500' : 
                           inv.status === 'Due Soon' ? 'text-amber-500' : 
                           'text-indigo-500'
                        }`}>{inv.status}</p>
                      </div>
                      {role === 'parent' && (
                        <button className="p-2 sm:px-4 sm:py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 font-semibold rounded-xl transition-colors shrink-0">
                          <span className="hidden sm:inline">Pay</span>
                          <ChevronRight className="w-5 h-5 sm:hidden" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-8">
            
            {/* Fee Breakdown Chart */}
            <div className={glassCard}>
              <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-indigo-500" />
                Fee Breakdown
              </h3>
              <p className="text-sm text-slate-500 mb-6">Total mapped fee for academic year</p>
              
              <div className="h-48 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={feesBreakdown}
                      cx="50%" cy="50%" innerRadius={60} outerRadius={80}
                      paddingAngle={5} dataKey="value" stroke="none"
                    >
                      {feesBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total</span>
                  <span className="text-xl font-extrabold text-slate-800">₹{totalFees.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                {feesBreakdown.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                      <span className="font-medium text-slate-600">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-800">₹{item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Options */}
            {role === 'parent' && (
              <div className={glassCard}>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Pay</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white/50 border border-slate-200 hover:border-indigo-300 hover:bg-white hover:shadow-sm transition-all text-slate-600 hover:text-indigo-600">
                    <Smartphone className="w-6 h-6" />
                    <span className="text-xs font-bold">UPI / QR</span>
                  </button>
                  <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white/50 border border-slate-200 hover:border-indigo-300 hover:bg-white hover:shadow-sm transition-all text-slate-600 hover:text-indigo-600">
                    <CreditCard className="w-6 h-6" />
                    <span className="text-xs font-bold">Card</span>
                  </button>
                  <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white/50 border border-slate-200 hover:border-indigo-300 hover:bg-white hover:shadow-sm transition-all text-slate-600 hover:text-indigo-600">
                    <Building className="w-6 h-6" />
                    <span className="text-xs font-bold">Net Banking</span>
                  </button>
                  <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white/50 border border-slate-200 hover:border-indigo-300 hover:bg-white hover:shadow-sm transition-all text-slate-600 hover:text-indigo-600">
                    <Wallet className="w-6 h-6" />
                    <span className="text-xs font-bold">Wallets</span>
                  </button>
                </div>
              </div>
            )}

            {/* Quick Actions List */}
            <div className={glassCard}>
              <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/60 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-100 transition-colors">
                      <DownloadCloud className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-slate-700 text-sm">Download Tax Statement</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/60 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-100 transition-colors">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-slate-700 text-sm">Contact Support</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-500 transition-colors" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className={`${glassCard} overflow-hidden`}>
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Recent Transactions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/40">
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Description</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Mode</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Amount</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Status</th>
                  <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {recentTransactions.map((txn, i) => (
                  <tr key={i} className="hover:bg-white/30 transition-colors group">
                    <td className="py-4 text-sm font-medium text-slate-600">{txn.date}</td>
                    <td className="py-4 text-sm font-bold text-slate-800">{txn.desc}</td>
                    <td className="py-4 text-sm font-medium text-slate-600">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs">{txn.mode}</span>
                    </td>
                    <td className="py-4 text-sm font-extrabold text-slate-800 text-right">₹{txn.amount.toLocaleString()}</td>
                    <td className="py-4 text-right">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                        <CheckCircle className="w-3 h-3" />
                        {txn.status}
                      </span>
                    </td>
                    <td className="py-4 text-center">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors inline-flex">
                        <DownloadCloud className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

// Quick Clock Icon Helper
function ClockIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
