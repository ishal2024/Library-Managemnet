import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  CheckCircle,
  LayoutGrid,
  Box,
  Eye,
  EyeOff,
  Calendar,
  IndianRupee,
  CreditCard,
  Smartphone,
  Banknote,
  Clock
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux'
import { getDashboardData, getPaymentLog } from '../axios/dashboardApi';
import { addDashboardData } from '../store/dashboardSlicer';
import { useEffect } from 'react';
import AdminDashboardSkeleton from './Loaders/Skeletons/AdminDashboardSkeleton';
import Spinner from './Loaders/Spinner/Spinner';

// --- HELPERS ---
const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  return parts.length > 1
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name[0].toUpperCase();
};


export default function AdminDashboardPage() {

  const dispatch = useDispatch()
  const { status, dashboardData } = useSelector((state) => state?.dashboard)

  // State
  const [isSkeletonOpen, setSkeletonOpen] = useState(false)
  const [isRevenueVisible, setIsRevenueVisible] = useState(false);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentLogs, setPaymentLogs] = useState([])
  const [paymentLogsSpinner , setPaymentLogSpinner] = useState(false)

  async function initializeDashboardData() {
    setSkeletonOpen(true)
    try {
      const res = await getDashboardData()
      if (res?.data?.status) {
        dispatch(addDashboardData(res?.data?.data))
        setSkeletonOpen(false)
      }
    } catch (error) {
      setSkeletonOpen(false)
      console.log(error?.response?.data)
    }
  }

  async function handlePaymentLogs() {
    try {
      setPaymentLogSpinner(true)
      const res = await getPaymentLog(paymentDate)
      if (res?.data?.status) {
        setPaymentLogs(res?.data?.data?.payments)
        setPaymentLogSpinner(false)
      }
    } catch (error) {
      setPaymentLogSpinner(false)
      setPaymentLogs([])
    }
  }

  useEffect(() => {
    if (!status)
      initializeDashboardData()
  }, [status])

  useEffect(() => {
    handlePaymentLogs()
  }, [paymentDate])


  // Method Icon Helper
  const getMethodIcon = (method) => {
    switch (method) {
      case 'UPI': return <Smartphone size={14} className="text-[var(--accent-primary)]" />;
      case 'Card': return <CreditCard size={14} className="text-purple-400" />;
      case 'Cash': return <Banknote size={14} className="text-[var(--success)]" />;
      default: return null;
    }
  };

  return (

    <div className="min-h-screen bg-[var(--bg-background)] text-[var(--text-primary)] font-sans p-4 md:p-8 transition-colors duration-300">


      <style>{`
:root {
  --bg-background: #09090b;
  --bg-card: #18181b;
  --bg-surface: #27272a;
  --bg-surface-hover: #3f3f46;

  --text-primary: #f4f4f5;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;

  --border-muted: #27272a;
  --border-focus: #3f3f46;

  --accent-primary: #3b82f6;
  --accent-hover: #2563eb;
  --accent-transparent: rgba(59,130,246,0.1);

  --success: #10b981;
  --success-bg: rgba(16,185,129,0.1);
  --warning: #f59e0b;
  --warning-bg: rgba(245,158,11,0.1);
}

.custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: var(--bg-surface-hover); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
`}</style>
      {!isSkeletonOpen  ?  (

        <div className="max-w-[1400px] mx-auto space-y-8">

          <header className="flex flex-col gap-1">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">Dashboard</h1>
            <p className="text-sm text-[var(--text-secondary)]">Library overview and activity</p>
          </header>

          {/* =========================================
            OVERVIEW STAT BOXES
            ========================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {/* 1. Total Revenue (With Toggle) */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Total Revenue</span>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                  <IndianRupee size={20} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <h3 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight font-mono">
                  {isRevenueVisible ? `₹${dashboardData?.totalRevenue}` : '••••••'}
                </h3>
                <button
                  onClick={() => setIsRevenueVisible(!isRevenueVisible)}
                  className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] rounded-lg transition-colors"
                  title={isRevenueVisible ? "Hide Revenue" : "Show Revenue"}
                >
                  {isRevenueVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* 2. Total Users */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Total Users</span>
                <div className="p-2.5 rounded-xl bg-[var(--accent-transparent)] text-[var(--accent-primary)] group-hover:scale-110 transition-transform duration-300">
                  <Users size={20} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-[var(--text-primary)]">{dashboardData?.totalUsers}</h3>
            </div>

            {/* 3. New Users */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">New Users</span>
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform duration-300">
                  <UserPlus size={20} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-[var(--text-primary)]">{dashboardData?.newUsers?.length}</h3>
            </div>

            {/* 4. Fees Paid Users */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Fees Paid Users</span>
                <div className="p-2.5 rounded-xl bg-[var(--success-bg)] text-[var(--success)] group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle size={20} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-[var(--text-primary)]">{dashboardData?.totalPaidUsers}</h3>
            </div>

            {/* 5. Total Fixed Seats */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Total Fixed Seats</span>
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform duration-300">
                  <LayoutGrid size={20} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-[var(--text-primary)]">{dashboardData?.totalFixedSeats}</h3>
            </div>

            {/* 6. Total Fixed Lockers */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Total Fixed Lockers</span>
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 group-hover:scale-110 transition-transform duration-300">
                  <Box size={20} />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-[var(--text-primary)]">{dashboardData?.totalFixedLockers}</h3>
            </div>

          </div>

          {/* =========================================
            MAIN CONTENT SECTION (Split Layout)
            ========================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch h-full">

            {/* LEFT SECTION: PAYMENT LOGS */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl shadow-sm flex flex-col h-[500px] overflow-hidden">

              {/* Header */}
              <div className="p-5 sm:p-6 border-b border-[var(--border-muted)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[var(--bg-surface)]/30 shrink-0">
                <h2 className="text-lg font-bold text-[var(--text-primary)]">Payment Logs</h2>

                {/* Date Selector */}
                <div className="relative flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-xl px-3 py-2 shadow-sm focus-within:ring-2 ring-[var(--accent-primary)]/40 transition-all group overflow-hidden cursor-pointer hover:border-[var(--border-focus)]">
                  <Calendar size={16} className="text-[var(--text-secondary)] group-focus-within:text-[var(--accent-primary)] transition-colors" />
                  <span className="font-semibold text-xs tracking-wide text-[var(--text-primary)]">{paymentDate?.split("-")?.reverse().join("-")}</span>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* List Body */}
              {!paymentLogsSpinner ? <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                {paymentLogs.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    {paymentLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between p-3.5 rounded-xl hover:bg-[var(--bg-surface)]/50 transition-colors border border-transparent hover:border-[var(--border-muted)] group"
                      >
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-[var(--text-primary)] text-sm">{log?.userId?.name}</span>
                          <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
                            Seat: {log?.userId?.seatType} • <Clock size={10} className="ml-1" /> {new Date(log?.createdAt)?.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
                          </span>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <span className="font-bold text-[var(--text-primary)] text-sm">₹{log?.amount}</span>
                          <div className="flex items-center gap-1.5 bg-[var(--bg-surface)] border border-[var(--border-muted)] px-2 py-0.5 rounded text-[10px] font-medium text-[var(--text-secondary)] group-hover:border-[var(--border-focus)] transition-colors">
                            {getMethodIcon(log?.paymentMethod)} {log.method}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-[var(--text-secondary)] gap-2">
                    <Banknote size={32} className="text-[var(--border-focus)] mb-2" />
                    <p className="font-medium text-[var(--text-primary)] text-sm">No payments recorded</p>
                    <p className="text-xs">No transactions found for {paymentDate}.</p>
                  </div>
                )}
              </div> : 
              <div className='flex justify-center items-center h-full'>
              <Spinner />
              </div>
              }
            </div>

            {/* RIGHT SECTION: NEW USERS */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl shadow-sm flex flex-col h-[500px] overflow-hidden">

              {/* Header */}
              <div className="p-5 sm:p-6 border-b border-[var(--border-muted)] flex justify-between items-center bg-[var(--bg-surface)]/30 shrink-0">
                <h2 className="text-lg font-bold text-[var(--text-primary)]">New Users</h2>
                <div className="p-1.5 rounded-lg bg-[var(--accent-transparent)] text-[var(--accent-primary)]">
                  <UserPlus size={18} />
                </div>
              </div>

              {/* List Body */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                <div className="flex flex-col gap-1">
                  {dashboardData?.newUsers?.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3.5 rounded-xl hover:bg-[var(--bg-surface)]/50 transition-colors border border-transparent hover:border-[var(--border-muted)]"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-primary)]/20 to-purple-500/20 border border-[var(--accent-primary)]/20 flex items-center justify-center text-[var(--accent-primary)] font-bold text-xs shrink-0 shadow-inner">
                          {getInitials(user.name)}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-[var(--text-primary)] text-sm">{user.name}</span>
                          <span className="text-xs text-[var(--text-secondary)]">{new Date(user?.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs font-medium bg-[var(--bg-surface)] border border-[var(--border-muted)] text-[var(--text-primary)] px-2.5 py-1 rounded-lg">
                          {user?.seatType}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>) : <AdminDashboardSkeleton />}
    </div>

  );
}