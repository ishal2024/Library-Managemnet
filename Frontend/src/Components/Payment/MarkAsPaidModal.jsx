import React, { useState, useEffect, useRef } from 'react';
import {
  Wallet,
  X,
  ChevronDown,
  Check,
  IndianRupee,
  AlertCircle,
  Banknote,
  Smartphone,
  CreditCard,
  Building,
  CalendarCheck,
  CalendarDays
} from 'lucide-react';
import { createPayment, updatePayment } from '../../axios/paymentsApi';
import Spinner from '../Loaders/Spinner/Spinner';

/**
 * Modern SaaS Mark As Paid Modal
 * 
 * NOTE: For demonstration purposes, this file exports a wrapped version 
 * with a trigger button. In a real app, you would extract the `MarkAsPaidModal` 
 * component and pass `isOpen` and `onClose` from the parent Payment page.
 */

const PAYMENT_METHODS = [
  { id: 'Cash', label: 'Cash', icon: Banknote },
  { id: 'Upi', label: 'UPI', icon: Smartphone },
  { id: 'Card', label: 'Card', icon: CreditCard },
];

export default function MarkAsPaidModal({ isOpen, onClose, mode ,payment , setPaymentCreated }) {


  // --- Modal Form State ---
  const [method, setMethod] = useState(mode == "add" ? '' : payment?.paymentDetail?.paymentMethod);
  const [amount, setAmount] = useState(mode == "add" ? '' : payment?.paymentDetail?.amount);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState(mode == "add" ? '' : new Date(payment?.paymentDetail?.paymentStartDate).toISOString().split("T")[0]); // Default to current context date
  const [endDate, setEndDate] = useState(mode == "add" ? '' : new Date(payment?.paymentDetail?.paymentEndDate).toISOString().split("T")[0]);

  // Custom Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isSpinnerOpen , setSpinnerOpen] = useState(false)

  // --- Effects ---

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle outside click for custom dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen && mode == "add") {
      setMethod('');
      setAmount('');
      setError('');
      setIsDropdownOpen(false);
    }
  }, [isOpen]);

  // --- Handlers ---

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  };

  const handleConfirm = async () => {
    setError('');

    // Validation
    if (!method) {
      setError('Please select a payment method.');
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (!startDate) return setError('Please select a payment start date.');
    if (!endDate) return setError('Please select a payment end date.');

    if (new Date(startDate) > new Date(endDate)) {
      return setError('End date cannot be earlier than start date.');
    }

    if (Object.keys(payment?.user).length == 0)
      return

    // Success Simulation
    console.log({ method, amount, payment })
    setSpinnerOpen(true)
    const data = { paymentMethod: method, amount, user : payment?.user , paymentStartDate : startDate , paymentEndDate : endDate }
    try {
      const res = await createPayment(data)
      if (res?.data?.status) {
        setPaymentCreated((prev) => !prev)
        setSpinnerOpen(false)
        onClose()
      }
    } catch (error) {
      setSpinnerOpen(false)
      console.log(error?.response?.data)
      setError(error?.response?.data?.description)
    }


  };

  console.log(amount , method)

  async function handleUpdatePayment(){
    try {
      setSpinnerOpen(true)
      const data = {paymentMethod: method, amount, paymentStartDate : startDate , paymentEndDate : endDate}
      console.log(data)
      const res = await updatePayment(data , payment?.paymentDetail?._id)
      if(res?.data?.status){
        setPaymentCreated((prev) => !prev)
        setSpinnerOpen(false)
        onClose()
      }
    } catch (error) {
      setError(error?.response?.data)
      setSpinnerOpen(false)
    }
  }


  const selectedMethodData = PAYMENT_METHODS.find(m => m.id == method);
  const SelectedIcon = selectedMethodData?.icon;

  return (
    <>
      {/* 
        ========================================================
        THEME CSS VARIABLES (Dark / Light / Custom Adaptable)
        ========================================================
        Using CSS custom properties enables instant theme switching.
        Acts as the baseline for a modern SaaS aesthetic.
      */}
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
          --accent-transparent: rgba(59, 130, 246, 0.1);
          
          --danger: #ef4444;              
          --danger-bg: rgba(239, 68, 68, 0.1);
        }

        /* Hide number input spinners for a cleaner look */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>

      {/* DEMO TRIGGER BUTTON (Visible only if used standalone without props) */}

      {/* <div className="min-h-screen bg-[var(--bg-background)] flex items-center justify-center p-6">
          <button
            onClick={() => setIsDemoOpen(true)}
            className="bg-[var(--bg-card)] border border-[var(--border-muted)] text-[var(--text-primary)] px-6 py-3 rounded-xl shadow-lg hover:border-[var(--accent-primary)] transition-all flex items-center gap-2 font-medium"
          >
            <Wallet size={18} className="text-[var(--accent-primary)]" />
            Trigger "Mark as Paid" Modal
          </button>
        </div> */}


      {/* MODAL OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={handleOverlayClick}
        >
          {/* MODAL CARD */}
          <div
            className="w-full max-w-[420px] bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl shadow-2xl flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-200"
          >
            {/* 1️⃣ MODAL HEADER */}
            <div className="flex justify-between items-start p-5 border-b border-[var(--border-muted)]">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full bg-[var(--accent-transparent)] border border-[var(--accent-primary)]/20 flex items-center justify-center shrink-0`}>
                  <Wallet size={24} className="text-[var(--accent-primary)]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">{mode == "add" ? "Mark as Paid" : "Update Payment"}</h2>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">{mode == "add" ? "Confirm payment details for this member" : "Update payment details for this member"}</p>
                </div>
              </div>
              <button
                onClick={close}
                className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] rounded-lg transition-colors"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* 2️⃣ MODAL BODY (FORM) */}
            <div className="p-6 flex flex-col gap-5">

              {/* Error Banner */}
              {error && (
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-[var(--danger-bg)] border border-[var(--danger)]/20 text-[var(--danger)] text-sm font-medium animate-in slide-in-from-top-2 duration-200">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              {/* Payment Method (Custom Dropdown) */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[var(--text-primary)]">
                  Payment Method
                </label>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex items-center justify-between bg-[var(--bg-surface)] border border-[var(--border-muted)] rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)]/50 transition-all shadow-sm"
                  >
                    {selectedMethodData ? (
                      <div className="flex items-center gap-2.5 text-[var(--text-primary)] font-medium">
                        <SelectedIcon size={16} className="text-[var(--text-secondary)]" />
                        {selectedMethodData.label}
                      </div>
                    ) : (
                      <span className="text-[var(--text-muted)]">Select payment method</span>
                    )}
                    <ChevronDown size={16} className={`text-[var(--text-secondary)] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Options */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 w-full mt-1.5 bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-lg shadow-xl z-10 py-1.5 animate-in fade-in slide-in-from-top-1 duration-150 overflow-hidden">
                      {PAYMENT_METHODS.map((m) => {
                        const Icon = m.icon;
                        const isSelected = method === m.id;
                        return (
                          <button
                            key={m.id}
                            onClick={() => {
                              setMethod(m.id);
                              setIsDropdownOpen(false);
                              if (error) setError('');
                            }}
                            className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-[var(--bg-surface)] ${isSelected ? 'text-[var(--accent-primary)] bg-[var(--accent-transparent)]' : 'text-[var(--text-primary)]'
                              }`}
                          >
                            <div className="flex items-center gap-2.5 font-medium">
                              <Icon size={16} className={isSelected ? 'text-[var(--accent-primary)]' : 'text-[var(--text-secondary)]'} />
                              {m.label}
                            </div>
                            {isSelected && <Check size={14} />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Amount Field */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[var(--text-primary)]">
                  Amount Paid
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <IndianRupee size={16} className="text-[var(--text-secondary)] group-focus-within:text-[var(--accent-primary)] transition-colors" />
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Enter amount"
                    className="w-full bg-[var(--bg-surface)] border border-[var(--border-muted)] rounded-lg pl-10 pr-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-primary)]/50 focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Start Date */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[var(--text-secondary)]">
                    Payment Start Date <span className="text-[var(--danger)]">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <CalendarDays size={16} className="text-[var(--text-secondary)] group-focus-within:text-[var(--accent-primary)] transition-colors" />
                    </div>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => { setStartDate(e.target.value); if (error) setError(''); }}
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-muted)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition-all shadow-sm [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* End Date */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[var(--text-secondary)]">
                    Payment End Date <span className="text-[var(--danger)]">*</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <CalendarCheck size={16} className="text-[var(--text-secondary)] group-focus-within:text-[var(--accent-primary)] transition-colors" />
                    </div>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => { setEndDate(e.target.value); if (error) setError(''); }}
                      min={startDate}
                      className="w-full bg-[var(--bg-surface)] border border-[var(--border-muted)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition-all shadow-sm [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* 3️⃣ MODAL FOOTER */}
            <div className="p-5 border-t border-[var(--border-muted)] bg-[var(--bg-surface)]/30 flex justify-end gap-3">
              <button
              disabled = {isSpinnerOpen}
                onClick={close}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-[var(--text-primary)] bg-transparent border border-[var(--border-muted)] hover:bg-[var(--bg-surface)] hover:border-[var(--border-focus)] transition-all shadow-sm"
              >
                Cancel
              </button>
              <button
                disabled = {isSpinnerOpen}
                onClick={mode == "add" ? handleConfirm : handleUpdatePayment}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium text-white ${mode == "add" ?" bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-hover)] hover:opacity-90" : "bg-green-500 hover:bg-green-200"} shadow-lg shadow-[var(--accent-primary)]/20 hover:shadow-[var(--accent-primary)]/40 flex items-center gap-2 transition-all transform hover:-translate-y-0.5`}
              >
                {!isSpinnerOpen ? 
                <>
                <Check size={16} />
                {mode == "add" ? "Confirm Payment" : "Update Payment"}
                </>
                :
                <Spinner />
                }
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}