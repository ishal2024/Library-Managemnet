import React, { useState, useEffect } from 'react';
import {
  Library,
  X,
  AlertTriangle,
  Plus,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  IndianRupee,
  ChevronDown,
  CheckCircle,
} from 'lucide-react';
import { addUser, updateUser } from '../../axios/usersApi';
import { useDispatch } from 'react-redux';
import { refreshUsersData } from '../../store/usersSlicer';

export default function AddMemberModal({ isOpen, onClose , mode , user }) {
  //   const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch()

  const initialFormState = {
    name: '',
    email: '',
    contact: '',
    gender: 'Male',
    dob: '',
    address: '',
    seatType: 'Random',
    paymentStatus: 'Unpaid',
    paymentMethod: 'Cash',
    amount: '',
    paymentStartDate: '',
    paymentEndDate: '',
  };

  const [formData, setFormData] = useState(Object.keys(user).length == 0 ? initialFormState : user);

  // Close modal on escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData)
    // Basic Client-Side Validation
    if (!formData.name.trim()) return setError('Full Name is required.');
    if (!formData.contact.trim()) return setError('Contact Number is required.');
    if (!formData.seatType) return setError('Please select a Seat Type.');

    if (formData.paymentStatus === 'Paid') {
      if (!formData.amount) return setError('Payment Amount is required for Paid status.');
      if (!formData.paymentMethod) return setError('Payment Method is required.');
    }

    // if (!formData.paymentStartDate || !formData.paymentEndDate) {
    //   return setError('Membership validity dates are required.');
    // }

    // if (new Date(formData?.paymentStartDate) > new Date(formData?.paymentEndDate)) {
    //     return setError('Valid Till date must be after Valid From date.');
    // }

    console.log(formData)
    try {
 
      const res = await addUser(formData)
      dispatch(refreshUsersData())
      alert(res?.data?.message)
    } catch (error) {
      console.log(error?.response)
    }

  };

  async function handleUpdateUser(e){
    try {
       e.preventDefault();
      console.log(formData)
      const res = await updateUser(formData , formData?._id)
      if(res?.data?.status){
        dispatch(refreshUsersData())
        alert("User is updated")
      }
    } catch (error) {
      alert(error?.response?.data?.description)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-300 font-sans p-8 flex items-start justify-center">

      {/* Global minimal scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
        
        /* Modal open animation */
        @keyframes fadeZoom {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-modal {
          animation: fadeZoom 0.2s ease-out forwards;
        }
      `}</style>



      {/* MODAL OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#0f1115]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={onClose} // Close on outside click
        >
          {/* MODAL CARD */}
          <div
            className="w-full max-w-3xl bg-[#1a1d24] border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-modal relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >

            {/* 1️⃣ MODAL HEADER */}
            <div className='relative '>
              <div className="p-5 border-b border-slate-800 bg-[#15181e] flex justify-between items-center overflow-hidden">
                {/* Subtle top gradient highlight */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-400"></div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Library size={24} className="text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-slate-100 font-bold text-lg leading-tight">Add New Member</h2>
                    <p className="text-slate-500 text-xs mt-0.5">LibManage System</p>
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
              {error && (
                <div className="mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-lg flex items-start gap-3 animate-modal">
                  <AlertTriangle size={18} className="mt-0.5 flex-shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}
            </div>



            {/* MODAL BODY (Scrollable) */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">

              {/* 2️⃣ ERROR BANNER */}
              {/* {error && (
                <div className="mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-lg flex items-start gap-3 animate-modal">
                  <AlertTriangle size={18} className="mt-0.5 flex-shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )} */}

              {/* 3️⃣ FORM START */}
              <form id="add-member-form" onSubmit={mode == "add" ? handleSubmit : handleUpdateUser} className="space-y-6">

                {/* Personal Information Section */}
                <div>
                  <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <User size={14} /> Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Rahul Kumar"
                        className="w-full bg-[#0f1115] border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>

                    {/* Contact */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <Phone size={14} /> Contact Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#0f1115] border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <Mail size={14} /> Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="rahul@example.com"
                        className="w-full bg-[#0f1115] border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>

                    {/* DOB */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <Calendar size={14} /> Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="w-full bg-[#0f1115] border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all [color-scheme:dark]"
                      />
                    </div>

                    {/* Gender Dropdown */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <User size={14} /> Gender
                      </label>
                      <div className="relative">
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="w-full bg-[#0f1115] border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 appearance-none focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <MapPin size={14} /> Full Address
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="House No, Street, City..."
                        rows={2}
                        className="w-full bg-[#0f1115] border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none custom-scrollbar"
                      />
                    </div>
                  </div>
                </div>

                {/* Membership & Payment Section */}
                <div className="pt-2">
                  <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
                    Membership & Booking
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* Seat Type */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-400">
                        Seat Type <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="seatType"
                          value={formData.seatType}
                          onChange={handleChange}
                          className="w-full bg-[#0f1115] border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 appearance-none focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                        >
                          <option value="Random">Random Allocation</option>
                          <option value="Fixed">Fixed Seat</option>

                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                      </div>
                    </div>

                    {/* Payment Status */}
                    {mode == "add" && <>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-400">
                        Payment Status <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          name="paymentStatus"
                          value={formData.paymentStatus}
                          onChange={handleChange}
                          className="w-full bg-[#0f1115] border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 appearance-none focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                        >
                          <option value="Unpaid">Unpaid / Pending</option>
                          <option value="Paid">Paid</option>
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                      </div>
                    </div>

                    
                    {formData.paymentStatus === 'Paid' && (
                      <>
                        <div className="space-y-1.5 animate-modal">
                          <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                            <CreditCard size={14} /> Payment Method <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              name="paymentMethod"
                              value={formData.paymentMethod}
                              onChange={handleChange}
                              className="w-full bg-[#0f1115] border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 appearance-none focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                            >
                              <option value="Cash">Cash</option>
                              <option value="UPI">UPI</option>
                              <option value="Card">Credit/Debit Card</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                          </div>
                        </div>

                        <div className="space-y-1.5 animate-modal">
                          <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                            <IndianRupee size={14} /> Amount Paid <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            placeholder="e.g. 1500"
                            min="0"
                            className="w-full bg-[#0f1115] border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                          />
                        </div>
                        {/* Valid From */}
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                            <CheckCircle size={14} /> Payment Date <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="paymentStartDate"
                            // min={new Date().toISOString().split("T")[0]}
                            // max={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split("T")[0]}
                            value={formData?.paymentStartDate}
                            onChange={handleChange}
                            className="w-full bg-[#0f1115] border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all [color-scheme:dark]"
                          />
                        </div>
                        {/* Valid Till */}
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                            <AlertTriangle size={14} /> Payment End Date <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="paymentEndDate"
                            value={formData.paymentEndDate}
                            onChange={handleChange}
                            className="w-full bg-[#0f1115] border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all [color-scheme:dark]"
                          />
                        </div>
                      </>
                    )}</>}



                  </div>
                </div>
              </form>
            </div>

            {/* 4️⃣ MODAL FOOTER / BUTTONS */}
            <div className="p-5 border-t border-slate-800 bg-[#15181e] flex flex-col-reverse sm:flex-row justify-end gap-3 rounded-b-xl">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg font-medium text-slate-300 border border-slate-700 hover:bg-slate-800 hover:text-slate-100 transition-colors w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="add-member-form"
                className={`flex items-center justify-center gap-2 bg-gradient-to-r 
                  ${mode == "add" ? "from-blue-600 to-blue-500 hover:from-blue-500" : "from-green-600 to-green-500 hover:from-green-500"} hover:to-blue-400 text-white px-6 py-2.5 rounded-lg font-medium shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 w-full sm:w-auto`}
              >
                <Plus size={18} />
                <span>{mode == "add" ? "Add Member" : "Update Member"}</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}