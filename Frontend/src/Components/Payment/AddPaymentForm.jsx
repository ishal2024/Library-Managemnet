import React, { useState, useEffect, useRef } from 'react';
import {
    X,
    Search,
    Check,
    ChevronDown,
    AlertCircle,
    IndianRupee,
    Wallet,
    CalendarDays,
    CalendarCheck,
    Box,
    LayoutGrid,
    CreditCard,
    Building,
    Smartphone,
    Banknote,
    Plus
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { createPayment } from '../../axios/paymentsApi';
import Spinner from '../Loaders/Spinner/Spinner';


const PAYMENT_METHODS = [
    { id: 'Cash', label: 'Cash', icon: Banknote },
    { id: 'UPI', label: 'UPI', icon: Smartphone },
    { id: 'Card', label: 'Card', icon: CreditCard },
    { id: 'Bank', label: 'Bank Transfer', icon: Building },
];

export default function AddPaymentModal({ isOpen, onClose }) {

    // --- Form State ---
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [paymentMethod, setPaymentMethod] = useState('');
    const [startDate, setStartDate] = useState('2026-03-10'); // Default to current context date
    const [endDate, setEndDate] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');

    // Dropdown States
    const [isMethodDropdownOpen, setIsMethodDropdownOpen] = useState(false);
    const [isSpinnerOpen , setSpinnerOpen] = useState(false)

    const { allUsers } = useSelector((state) => state.users)

    // Refs for outside clicks
    const autocompleteRef = useRef(null);
    const methodDropdownRef = useRef(null);
    const modalRef = useRef(null);

    const filteredUsers = useMemo(() => {
        return allUsers.filter(user =>
            user?.user?.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, allUsers]);

    // --- Effects ---

    // Handle ESC key to close
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Handle outside clicks for dropdowns
    useEffect(() => {
        const handleClickOutside = (e) => {
            // Close autocomplete
            if (autocompleteRef.current && !autocompleteRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
            // Close method dropdown
            if (methodDropdownRef.current && !methodDropdownRef.current.contains(e.target)) {
                setIsMethodDropdownOpen(false)
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setSearchQuery('');
            setSelectedUser(null);
            setPaymentMethod('');
            setStartDate('2026-03-10');
            setEndDate('');
            setAmount('');
            setError('');
            setShowSuggestions(false);
            setIsMethodDropdownOpen(false);
        }
    }, [isOpen]);

    // --- Handlers ---

    const handleOverlayClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            close();
        }
    };

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    }

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setSearchQuery(user.name);
        setShowSuggestions(false);
        if (error) setError('');
    };

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchQuery(val);
        setSelectedUser(null);
        setShowSuggestions(val.trim().length > 0);
    };

    const handleAddPayment = async () => {
        setError('');

        // Validation
        if (!selectedUser) return setError('Please select a member.');
        if (!paymentMethod) return setError('Please select a payment method.');
        if (!startDate) return setError('Please select a payment start date.');
        if (!endDate) return setError('Please select a payment end date.');
        if (!amount || isNaN(amount) || Number(amount) <= 0) return setError('Please enter a valid amount.');

        if (new Date(startDate) > new Date(endDate)) {
            return setError('End date cannot be earlier than start date.');
        }

        const data = {
            user : selectedUser,
            paymentMethod,
            amount,
            paymentStartDate : startDate,
            paymentEndDate : endDate
        }
        setSpinnerOpen(true)
        try {
            const res = await createPayment(data)
            if(res?.data?.status){
                alert("Payment is created")
                setSpinnerOpen(false)
            }
        } catch (error) {
            setSpinnerOpen(false)
            setError(error?.response?.data?.description)
        }

    };

    console.log(allUsers)

    const selectedMethodData = PAYMENT_METHODS.find(m => m.id === paymentMethod);
    const MethodIcon = selectedMethodData?.icon;

    return (
        <>
            {/* 
        ========================================================
        THEME CSS VARIABLES (Dark / Light / Custom Adaptable)
        ========================================================
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

        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--bg-surface-hover); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }

        /* Hide spinners on number input */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>

            {/* MODAL OVERLAY */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200"
                    onMouseDown={handleOverlayClick}
                >
                    {/* MODAL CARD */}
                   
                    
                    <div
                        ref={modalRef}
                        className="w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
                    >
                        {/* 1️⃣ MODAL HEADER */}
                        <div className="flex justify-between items-start p-5 sm:p-6 border-b border-[var(--border-muted)] shrink-0 bg-[var(--bg-card)] relative z-20">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[var(--accent-transparent)] border border-[var(--accent-primary)]/20 flex items-center justify-center shrink-0 shadow-inner">
                                    <Wallet size={24} className="text-[var(--accent-primary)]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">Add New Payment</h2>
                                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">Record a new membership payment</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] rounded-lg transition-colors"
                                title="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>
                            {/* Error Banner */}
                            {error && (
                                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[var(--danger-bg)] border border-[var(--danger)]/20 text-[var(--danger)] text-sm font-medium animate-in slide-in-from-top-2 duration-200 shadow-sm">
                                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                                    <p>{error}</p>
                                </div>
                            )}
                    
                    

                        {/* 2️⃣ MODAL BODY (SCROLLABLE) */}
                        <div className="p-5 sm:p-6 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6">


                            {/* USER SELECTION (AUTOCOMPLETE) */}
                            <div className="flex flex-col gap-2 relative z-50" ref={autocompleteRef}>
                                <label className="text-sm font-medium text-[var(--text-primary)]">
                                    Select Member <span className="text-[var(--danger)]">*</span>
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Search size={16} className="text-[var(--text-secondary)] group-focus-within:text-[var(--accent-primary)] transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        onFocus={() => { if (searchQuery.trim().length > 0) setShowSuggestions(true); }}
                                        placeholder="Search by member name or seat..."
                                        autoComplete="off"
                                        className="w-full bg-[var(--bg-surface)] border border-[var(--border-muted)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition-all shadow-sm"
                                    />
                                    {selectedUser && (
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <Check size={16} className="text-[var(--success)]" />
                                        </div>
                                    )}
                                </div>

                                {/* Autocomplete Dropdown */}
                                {showSuggestions && (
                                    <div className="absolute top-[105%] left-0 w-full bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-xl shadow-xl z-50 py-1.5 max-h-48 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-1 duration-150">
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map((user) => (
                                                <button
                                                    key={user?.user?._id}
                                                    onClick={() => handleSelectUser(user?.user)}
                                                    className="w-full text-left px-4 py-3 text-sm transition-colors hover:bg-[var(--bg-surface)] flex flex-col gap-0.5 border-b border-[var(--border-muted)]/50 last:border-none"
                                                >
                                                    <span className="font-semibold text-[var(--text-primary)]">{user?.user?.name}</span>
                                                    <span className="text-xs text-[var(--text-secondary)]">Seat: {user?.user?.seatId?.seatNumber}</span>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-4 py-4 text-sm text-[var(--text-muted)] text-center">
                                                No members found.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* USER DETAILS INFO CARD */}
                            {selectedUser && (
                                <div className="bg-[var(--bg-surface)]/40 border border-[var(--border-muted)] rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3">Member Details</h4>
                                    <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1.5"><LayoutGrid size={12} /> Seat Number</span>
                                            <span className="text-sm font-semibold text-[var(--text-primary)]">{selectedUser?.seatId?.seatNumber || "N/A"}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1.5"><Box size={12} /> Locker</span>
                                            <span className="text-sm font-semibold text-[var(--text-primary)]">{selectedUser?.lockerId?.lockerNumber || "N/A"}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1.5"><CalendarCheck size={12} /> Last Paid</span>
                                            <span className="text-sm font-semibold text-[var(--accent-primary)]">{formatDate(selectedUser?.paymentId?.paymentDate)}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1.5"><CalendarDays size={12} /> Joined Date</span>
                                            <span className="text-sm font-semibold text-[var(--text-secondary)]">{formatDate(selectedUser?.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* PAYMENT DETAILS SECTION */}
                            <div className="flex flex-col gap-5 pt-2 border-t border-[var(--border-muted)]/50">
                                <h4 className="text-sm font-bold text-[var(--text-primary)]">Payment Information</h4>

                                {/* Payment Method (Custom Dropdown) */}
                                <div className="flex flex-col gap-2 relative z-40" ref={methodDropdownRef}>
                                    <label className="text-sm font-medium text-[var(--text-secondary)]">
                                        Payment Method <span className="text-[var(--danger)]">*</span>
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setIsMethodDropdownOpen(!isMethodDropdownOpen)}
                                        className="w-full flex items-center justify-between bg-[var(--bg-surface)] border border-[var(--border-muted)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--border-focus)] transition-all shadow-sm"
                                    >
                                        {selectedMethodData ? (
                                            <div className="flex items-center gap-2.5 text-[var(--text-primary)] font-medium">
                                                <MethodIcon size={16} className="text-[var(--accent-primary)]" />
                                                {selectedMethodData.label}
                                            </div>
                                        ) : (
                                            <span className="text-[var(--text-muted)]">Select method</span>
                                        )}
                                        <ChevronDown size={16} className={`text-[var(--text-secondary)] transition-transform duration-200 ${isMethodDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Options */}
                                    {isMethodDropdownOpen && (
                                        <div className="absolute top-[105%] left-0 w-full bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-xl shadow-xl z-10 py-1.5 animate-in fade-in slide-in-from-top-1 duration-150 overflow-hidden">
                                            {PAYMENT_METHODS.map((m) => {
                                                const Icon = m.icon;
                                                const isSelected = paymentMethod === m.id;
                                                return (
                                                    <button
                                                        key={m.id}
                                                        onClick={() => {
                                                            setPaymentMethod(m.id);
                                                            setIsMethodDropdownOpen(false);
                                                            if (error) setError('');
                                                        }}
                                                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-[var(--bg-surface)] ${isSelected ? 'text-[var(--accent-primary)] bg-[var(--accent-transparent)]' : 'text-[var(--text-primary)]'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-2.5 font-medium">
                                                            <Icon size={16} className={isSelected ? 'text-[var(--accent-primary)]' : 'text-[var(--text-secondary)]'} />
                                                            {m.label}
                                                        </div>
                                                        {isSelected && <Check size={14} className="text-[var(--accent-primary)]" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Dates Row */}
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

                                {/* Amount Field */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium text-[var(--text-secondary)]">
                                        Amount <span className="text-[var(--danger)]">*</span>
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <IndianRupee size={16} className="text-[var(--text-secondary)] group-focus-within:text-[var(--accent-primary)] transition-colors" />
                                        </div>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => { setAmount(e.target.value); if (error) setError(''); }}
                                            placeholder="Enter payment amount"
                                            className="w-full bg-[var(--bg-surface)] border border-[var(--border-muted)] rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition-all shadow-sm font-semibold"
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* 3️⃣ MODAL FOOTER */}
                        <div className="p-5 sm:p-6 border-t border-[var(--border-muted)] bg-[var(--bg-card)] shrink-0 flex justify-end gap-3 z-20">
                            <button
                            disabled={isSpinnerOpen}
                                onClick={close}
                                className="px-5 py-2.5 rounded-xl text-sm font-medium text-[var(--text-primary)] bg-transparent border border-[var(--border-muted)] hover:bg-[var(--bg-surface)] hover:border-[var(--border-focus)] transition-all shadow-sm w-full sm:w-auto"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={isSpinnerOpen}
                                onClick={handleAddPayment}
                                className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-hover)] hover:opacity-90 shadow-lg shadow-[var(--accent-primary)]/20 hover:shadow-[var(--accent-primary)]/40 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 w-full sm:w-auto"
                            >
                                {!isSpinnerOpen ?
                                <>
                                <Plus size={16} strokeWidth={3} />
                                Add Payment
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