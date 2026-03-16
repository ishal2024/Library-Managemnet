import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    Library,
    X,
    AlertTriangle,
    Plus,
    User,
    LayoutGrid,
    AlignLeft,
    ChevronDown,
    Check,
    CheckCircle
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { assignSeat } from '../../../axios/seatsApi';
import { assignLocker } from '../../../axios/lockerApi';
import Spinner from '../../Loaders/Spinner/Spinner';


export default function AssignLockerForm({ isOpen, onClose, lockerNumber }) {
    //   const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState('');
    const { allUsers } = useSelector((state) => state.users)

    const initialFormState = {
        user: { name: "" },
        lockerNumber: lockerNumber,
        notes: '',
    };

    const [formData, setFormData] = useState(initialFormState);
    const [isSpinnerOpen , setSpinnerOpen] = useState(false)


    function initialUsersData() {
        const users = allUsers.filter((user) => user?.user?.lockerId == null)
        setInitialMembers(users)
    }

    // Autocomplete state
    const [initialMembers, setInitialMembers] = useState([])
    const [filteredMembers, setFilteredMembers] = useState();
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Ref for autocomplete click-outside handling
    const autocompleteRef = useRef(null);

    // Handle ESC key to close modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    // Handle click outside for autocomplete suggestions
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (autocompleteRef.current && !autocompleteRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        initialUsersData()
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    const handleNameChange = (e) => {
        const val = e.target.value;

        setFormData((prev) => ({ ...prev, user: { name: val } }));

        if (error) setError('');

        if (val.trim().length > 0) {
            const matches = initialMembers.filter((user) =>
                user?.user?.name?.toLowerCase().includes(val.toLowerCase())
            );
            setFilteredMembers(matches);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const selectMember = (member) => {
        setFormData((prev) => ({ ...prev, user: member }));
        setShowSuggestions(false);
        setError('');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    // Helper to get initials from a full name (e.g., "Rahul Kumar" -> "RK")
    const getInitials = (name) => {
        if (!name) return "?";
        const parts = name.trim().split(" ");
        if (parts.length > 1) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name[0].toUpperCase();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData?.user?._id) {
            return setError('Please select a member');
        }
        if (!lockerNumber) {
            return setError('Please select a Locker Number.');
        }

        // if (!formData.validFrom || !formData.validTill) {
        //     return setError('Membership validity dates are required.');
        // }

        // if (new Date(formData?.validFrom) > new Date(formData?.validTill)) {
        //     return setError('Valid Till date must be after Valid From date.');
        // }

        console.log(formData)
        setSpinnerOpen(true)
        try {
            const res = await assignLocker(formData)
            if (res?.data?.status) {
                onClose()
                setSpinnerOpen(false)
            }
        } catch (error) {
            console.log(error?.response?.data?.description)
            setSpinnerOpen(false)
        }

    };

    return (
        <div className="min-h-screen bg-[#0f1115] text-slate-300 font-sans p-8 flex items-start justify-center">

            {/* Global styles for scrollbar & modal animation */}
            <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
        
        @keyframes fadeZoom {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-modal {
          animation: fadeZoom 0.2s ease-out forwards;
        }
        
        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down {
          animation: slideDown 0.2s ease-out forwards;
        }
      `}</style>



            {/* MODAL OVERLAY */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 bg-[#0f1115]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
                    onClick={onClose}
                >
                    {/* MODAL CARD */}
                    <div
                        className="w-full max-w-lg bg-[#1a1d24] border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-modal relative overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* STICKY HEADER CONTAINER (Fixed at top inside modal flexbox) */}
                        <div className="shrink-0 z-20 bg-[#15181e] border-b border-slate-800 relative">
                            {/* Subtle top gradient highlight */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-400"></div>

                            {/* Header Content */}
                            <div className="p-5 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 rounded-lg">
                                        {/* <Library size={24} className="text-blue-500" /> */}
                                        <div className="text-blue-500  px-2">{lockerNumber}</div>
                                    </div>
                                    <div>
                                        <h2 className="text-slate-100 font-bold text-lg leading-tight">Locker Number</h2>
                                        <p className="text-slate-500 text-xs mt-0.5">#Assign Locker</p>
                                    </div>
                                </div>

                                <button
                                    onClick={onClose}
                                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                                    title="Close"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* STICKY ERROR BANNER (Only visible if error exists) */}
                            {error && (
                                <div className="px-5 pb-4 animate-slide-down">
                                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-lg flex items-start gap-3 shadow-inner">
                                        <AlertTriangle size={18} className="mt-0.5 flex-shrink-0" />
                                        <p className="text-sm font-medium">{error}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* SCROLLABLE FORM BODY */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                            <form id="assign-seat-form" onSubmit={handleSubmit} className="space-y-6">

                                {/* 1️⃣ Member Name (Autocomplete) */}
                                <div className="space-y-1.5 relative" ref={autocompleteRef}>
                                    <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                                        <User size={14} /> Member Name <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData?.user?.name}
                                        onChange={handleNameChange}
                                        onFocus={() => {
                                            if (formData?.user?.name.trim().length > 0) setShowSuggestions(true);
                                        }}
                                        placeholder="Enter member name..."
                                        autoComplete="off"
                                        className="w-full bg-[#0f1115] border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                                    />

                                    {/* Suggestion Dropdown */}
                                    {showSuggestions && (
                                        <div className="absolute top-[105%] left-0 w-full bg-[#15181e] border border-slate-700/80 rounded-xl shadow-xl shadow-black/50 z-30 max-h-48 overflow-y-auto custom-scrollbar animate-slide-down">
                                            {filteredMembers.length > 0 ? (
                                                <ul className="py-2">
                                                    {filteredMembers.map((user, idx) => (
                                                        <li
                                                            key={idx}
                                                            onClick={() => selectMember(user?.user)}
                                                            className="group px-4 py-3 hover:bg-slate-800/60 cursor-pointer transition-all duration-200 flex items-center gap-3 border-b border-slate-800/50 last:border-none"
                                                        >
                                                            {/* Hover Check Icon */}
                                                            <div className="w-4 flex justify-center shrink-0">
                                                                <Check size={16} className="opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity duration-200" />
                                                            </div>

                                                            {/* Profile Picture Circle (Initials) */}
                                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm shrink-0 shadow-inner group-hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-shadow">
                                                                {getInitials(user?.user?.name)}
                                                            </div>

                                                            {/* User Details (Name & Email) */}
                                                            <div className="flex flex-col overflow-hidden">
                                                                <span className="text-sm font-semibold text-slate-200 group-hover:text-blue-400 transition-colors truncate">
                                                                    {user?.user?.name}
                                                                </span>
                                                                <span className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors truncate mt-0.5">
                                                                    {user?.user?.email || 'No email provided'}
                                                                </span>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div className="px-4 py-3 text-sm text-slate-500 text-center">
                                                    No matching members found.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>


                                {/* 3️⃣ Notes */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                                        <AlignLeft size={14} /> Notes
                                    </label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        placeholder="Add optional notes..."
                                        rows={3}
                                        className="w-full bg-[#0f1115] border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none custom-scrollbar shadow-sm"
                                    />
                                </div>

                                {/* <div className='flex-col  md:flex justify-between'>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                                            <CheckCircle size={14} /> Valid From <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="validFrom"
                                            value={formData.validFrom}
                                            onChange={handleChange}
                                            className="w-full bg-[#0f1115] border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all [color-scheme:dark]"
                                        />
                                    </div>

                                    
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                                            <AlertTriangle size={14} /> Valid Till <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="validTill"
                                            value={formData.validTill}
                                            onChange={handleChange}
                                            className="w-full bg-[#0f1115] border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all [color-scheme:dark]"
                                        />
                                    </div>
                                </div> */}

                            </form>
                        </div>

                        {/* STICKY FOOTER / BUTTONS (Fixed at bottom inside modal flexbox) */}
                        <div className="shrink-0 p-5 border-t border-slate-800 bg-[#15181e] flex flex-col-reverse sm:flex-row justify-end gap-3 rounded-b-2xl">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled = {isSpinnerOpen}
                                className="px-5 py-2.5 rounded-lg font-medium text-slate-300 border border-slate-700 hover:bg-slate-800 hover:text-slate-100 transition-colors w-full sm:w-auto shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="assign-seat-form"
                                disabled = {isSpinnerOpen}
                                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-2.5 rounded-lg font-medium shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 w-full sm:w-auto"
                            >
                                {!isSpinnerOpen ? 
                                <>
                                <Plus size={18} />
                                <span>Assign Seat</span>
                                </>
                                :
                                <Spinner />
                                }
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}