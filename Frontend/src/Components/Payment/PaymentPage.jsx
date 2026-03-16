import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  Calendar,
  ChevronDown,
  Eye,
  Edit2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Banknote,
  Smartphone,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Filter,
  AlignCenter,
  Plus,
  User,
  Trash2
} from 'lucide-react';
import { deletePayment, getAllUsersPayments } from '../../axios/paymentsApi';
import MarkAsPaidModal from './MarkAsPaidModal';
import AddPaymentModal from './AddPaymentForm';
import AdminDashboardSkeleton from '../Loaders/Skeletons/AdminDashboardSkeleton';


export default function PaymentPage() {
  // State
  const [payments, setPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [isMarkAsPaidOpen, setMarkAsPaidOpen] = useState({ status: false, mode: "add", data: {} })
  const [isAddPaymentOpen, setAddPaymentOpen] = useState(false)
    const [isSkeletonOpen, setSkeletonOpen] = useState(false)

  const [paymentCreated, setPaymentCreated] = useState(false)

  // Default to today's date (07 Mar 2026 as per context)
  const [headerDate, setHeaderDate] = useState(new Date().toISOString().split("T")[0]);
  const filterRef = useRef(null);


  // Handle outside click for custom dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  async function initializePayments() {
    try {
      setSkeletonOpen(true)
      const res = await getAllUsersPayments(headerDate)
      if (res.data?.status) {
        console.log(res?.data?.data)
        setPayments(res?.data?.data)
        setSkeletonOpen(false)
      }
    } catch (error) {
      console.log(error?.response?.data)
      setSkeletonOpen(false)
    }
  }

  async function handleDeletePayment(paymentId){
    try {
      const res = await deletePayment(paymentId)
      if(res?.data?.status){
        initializePayments()
      }
    } catch (error) {
      alert(error?.response?.data)
    }
  }

  // Reset page when filters change
  useEffect(() => {
    initializePayments()
  }, [headerDate, paymentCreated]);

  console.log(payments)

  // Helper for Payment Method Icon
  const getMethodIcon = (method) => {
    switch (method) {
      case 'Cash': return <Banknote size={14} className="text-emerald-400" />;
      case 'UPI': return <Smartphone size={14} className="text-blue-400" />;
      case 'Card': return <CreditCard size={14} className="text-purple-400" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-300 font-sans p-4 md:p-6 lg:p-8 selection:bg-blue-500/30">

      {/* Scrollbar CSS */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>

      {!isSkeletonOpen ? <div className="max-w-[1400px] mx-auto space-y-6">

        {/* =========================================
            PAGE HEADER
            ========================================= */}

        {isMarkAsPaidOpen?.status && <MarkAsPaidModal
          isOpen={isMarkAsPaidOpen?.status}
          onClose={() => {
            setMarkAsPaidOpen({ status: false, mode: "add", data: {} })
          }}
          payment={isMarkAsPaidOpen?.data}
          mode={isMarkAsPaidOpen?.mode}
          setPaymentCreated={setPaymentCreated}
        />}

        {isAddPaymentOpen && <AddPaymentModal
          isOpen={isAddPaymentOpen}
          onClose={() => {
            setAddPaymentOpen(false)
          }}
        />}


        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-100 tracking-tight">Payments</h1>
            <p className="text-sm text-slate-500 mt-1">Manage library memberships and transactions.</p>
          </div>

          <button
            onClick={() => setAddPaymentOpen(true)}
            className="flex items-center justify-center gap-2 w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-2.5 rounded-lg font-medium shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all duration-300 transform hover:-translate-y-0.5">
            <Plus size={18} />
            <span>New Payment</span>
          </button>
        </div>

        {/* =========================================
            SEARCH AND FILTER SECTION
            ========================================= */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">

          {/* Search Input */}
          <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search member by name, phone or seat number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1d24] border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
            />
          </div>

          {/* Custom Dropdown Filter */}
          <div className="relative w-full md:w-auto" ref={filterRef}>
            <div className='flex gap-10'>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full md:w-48 flex items-center justify-between bg-[#1a1d24] border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-slate-500" />
                  <span className="text-sm font-medium">{filterStatus}</span>
                </div>
                <ChevronDown size={16} className={`text-slate-500 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className="relative flex items-center gap-3 bg-[#1a1d24] border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-sm overflow-hidden group">
                <Calendar size={18} className="text-blue-500 group-focus-within:text-blue-400 transition-colors" />
                <span className="font-semibold text-sm tracking-wide">{headerDate.split('-').reverse().join('-')}</span>
                {/* Transparent native date input overlay */}
                <input
                  type="date"
                  value={headerDate}
                  onChange={(e) => setHeaderDate(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Dropdown Menu */}
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-full md:w-48 bg-[#15181e] border border-slate-700/80 rounded-xl shadow-xl shadow-black/50 overflow-hidden z-20 py-1">
                {['All', 'Paid', 'Unpaid', 'Expired'].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setFilterStatus(status);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-blue-500/10 hover:text-blue-400
                      ${filterStatus === status ? 'bg-blue-500/10 text-blue-400 font-medium' : 'text-slate-300'}
                    `}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* =========================================
            PAYMENT TABLE / MOBILE CARDS SECTION
            ========================================= */}
        <div className="bg-[#15181e] border border-slate-800/80 rounded-2xl shadow-xl shadow-black/20 overflow-hidden flex flex-col">

          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1a1d24] border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4 rounded-tl-2xl">Name</th>
                  <th className="px-6 py-4">Seat Type</th>
                  <th className="px-6 py-4">Period</th>
                  <th className="px-6 py-4">Payment Status</th>
                  <th className="px-6 py-4">Method & Date</th>
                  <th className="px-6 py-4 text-right rounded-tr-2xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {payments.length > 0 ? (
                  payments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-slate-800/30 transition-colors group">

                      {/* Name */}
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-200">{payment?.userDetail?.name}</span>
                      </td>

                      {/* Seat Type */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-400">{payment?.userDetail?.seatType}</span>
                      </td>

                      {/* Period */}
                      <td className="px-6 py-4">
                        {payment.status === 'Paid' ? (
                          <span className="text-sm font-medium text-blue-400/90 bg-[#0f1115] px-2.5 py-1 rounded-md border border-slate-800/60 whitespace-nowrap">
                            {new Date(payment?.paymentDetail?.paymentStartDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} -
                            {new Date(payment?.paymentDetail?.paymentEndDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                          </span>
                        ) :
                          (<span className="text-sm text-slate-600 italic ">N/A</span>)
                        }
                      </td>

                      {/* Payment Status */}
                      <td className="px-6 py-4">
                        {payment.status === 'Paid' && (
                          <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                            <CheckCircle size={14} /> Paid
                          </div>
                        )}
                        {payment.status === 'Unpaid' && (
                          <div className="flex items-center gap-3">
                            <div className="inline-flex items-center gap-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                              <XCircle size={14} /> Unpaid
                            </div>
                            <button
                              onClick={() => {
                                setMarkAsPaidOpen({ status: true, mode: "add", data: { user: payment?.userDetail } })
                              }}
                              className="text-xs font-semibold bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/30 px-3 py-1.5 rounded-md transition-all shadow-[0_0_10px_rgba(59,130,246,0)] hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] whitespace-nowrap"
                            >
                              Mark as Paid
                            </button>
                          </div>
                        )}
                        {payment.status === 'Expired' && (
                          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                            <AlertCircle size={14} /> Expired
                          </div>
                        )}
                      </td>

                      {/* Method & Date */}
                      <td className="px-6 py-4">
                        {payment.status === 'Paid' ? (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                              {getMethodIcon(payment?.paymentDetail?.paymentMethod)} {payment?.paymentDetail?.paymentMethod}
                            </div>
                            <span className="text-xs text-slate-500">{new Date(payment?.paymentDetail?.paymentDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-600 italic">N/A</span>
                        )}
                      </td>

                      {/* Actions */}
                      {payment?.status == "Paid" && <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button 
                          onClick={() => handleDeletePayment(payment?.paymentDetail?._id)}
                          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all" title="View Details">
                            <Trash2 size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setMarkAsPaidOpen({ status: true, mode: "edit", data: { paymentDetail: payment?.paymentDetail } })
                            }}
                            className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all" title="Edit Payment">
                            <Edit2 size={18} />
                          </button>
                        </div>
                      </td>}

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                      No payments found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS VIEW */}
          <div className="md:hidden flex flex-col divide-y divide-slate-800/50">
            {payments.length > 0 ? (
              payments.map((payment) => (
                <div key={payment.id} className="p-5 flex flex-col gap-4 hover:bg-slate-800/20 transition-colors">

                  {/* Card Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-slate-200 text-lg">{payment?.userDetail?.name}</h3>
                      <p className="text-sm text-slate-500 mt-0.5">{payment?.userDetail?.seatType}</p>
                    </div>
                    {payment?.status == "Paid" && <div className="flex items-center gap-2">
                      <button 
                      onClick={() => handleDeletePayment(payment?.paymentDetail?._id)}
                        className="p-2 text-slate-400 hover:text-blue-400 bg-[#0f1115] rounded-lg border border-slate-800">
                        <Trash2 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setMarkAsPaidOpen({ status: true, mode: "edit", data: { paymentDetail: payment?.paymentDetail } })
                        }}
                        className="p-2 text-slate-400 hover:text-emerald-400 bg-[#0f1115] rounded-lg border border-slate-800">
                        <Edit2 size={16} />
                      </button>
                    </div>}
                  </div>

                  {/* Period Badge */}
                  <div>
                    <span className="text-xs font-medium text-blue-400/90 bg-[#0f1115] px-2.5 py-1.5 rounded-md border border-slate-800/60 inline-block">
                      {new Date(payment?.paymentDetail?.paymentStartDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} -
                      {new Date(payment?.paymentDetail?.paymentEndDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </div>

                  {/* Status & Method Section */}
                  <div className="flex flex-col gap-3 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Status</span>
                      {payment.status === 'Paid' && (
                        <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                          <CheckCircle size={14} /> Paid
                        </div>
                      )}
                      {payment.status === 'Unpaid' && (
                        <div className="inline-flex items-center gap-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                          <XCircle size={14} /> Unpaid
                        </div>
                      )}
                      {payment.status === 'Expired' && (
                        <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                          <AlertCircle size={14} /> Expired
                        </div>
                      )}
                    </div>

                    {payment.status === 'Paid' ? (
                      <div className="flex justify-between items-center bg-[#0f1115] p-3 rounded-lg border border-slate-800/50">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          {getMethodIcon(payment?.paymentDetail?.paymentMethod)}
                          <span>{payment?.paymentDetail?.paymentMethod}</span>
                        </div>
                        <span className="text-xs text-slate-500">
                          {new Date(payment?.paymentDetail?.paymentDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                        </span>
                      </div>
                    ) : payment.status === 'Unpaid' ? (
                      <button
                        onClick={() => {
                          setMarkAsPaidOpen({ status: true, mode: "add", data: { user: payment?.userDetail } })
                        }}
                        className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-4 py-3 rounded-lg font-semibold shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all transform hover:-translate-y-0.5 text-sm"
                      >
                        <CheckCircle size={16} /> Mark as Paid
                      </button>
                    ) : null}
                  </div>

                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500">
                No payments found matching your criteria.
              </div>
            )}
          </div>
        </div>

        {/* =========================================
            PAGINATION SECTION
            ========================================= */}
        {/* {payments.length > 0 && (
          <div className="flex justify-between md:justify-end items-center gap-4 pt-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 border
                ${currentPage === 1 
                  ? 'bg-[#15181e] border-slate-800 text-slate-600 cursor-not-allowed' 
                  : 'bg-[#1a1d24] border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-100 hover:border-slate-600 shadow-sm'
                }`}
            >
              <ChevronLeft size={18} />
              <span>Previous</span>
            </button>
            
                        <span className="text-sm text-slate-500 hidden md:block mx-4">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 border
                ${currentPage === totalPages 
                  ? 'bg-[#15181e] border-slate-800 text-slate-600 cursor-not-allowed' 
                  : 'bg-[#1a1d24] border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-100 hover:border-slate-600 shadow-sm'
                }`}
            >
              <span>Next</span>
              <ChevronRight size={18} />
            </button>
          </div>
        )} */}

      </div>  : <AdminDashboardSkeleton />}
    </div>
  );
}