import React, { useState, useMemo } from 'react';
import {
  LayoutGrid,
  Users,
  CheckCircle,
  Bookmark,
  DoorOpen,
  Box,
  Droplets,
  User,
  MapPin,
  Clock,
  IndianRupee,
  Phone,
  UserCheck,
  Plus,
  Edit2
} from 'lucide-react';
import { useEffect } from 'react';
import { getLiveSeatMatrix } from '../../axios/seatsApi';
import LiveSeatMatrixSkeleton from '../Loaders/Skeletons/SeatGridSkeleton';

// --- HELPERS ---
const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  return parts.length > 1
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name[0].toUpperCase();
};


// --- SEAT MATRIX LAYOUT DATA ---
const MATRIX_ROWS = [
  { left: [3, 2, 1], right: [39, 40, 41, 42] },
  { left: [6, 5, 4], right: [35, 36, 37, 38] },
  { left: [9, 8, 7], right: [31, 32, 33, 34] },
  { left: [12, 11, 10], right: [27, 28, 29, 30] },
  { left: [15, 14, 13], right: [23, 24, 25, 26] },
  { left: [18, 17, 16], right: [19, 20, 21, 22] },
];

export default function LiveSeatMatrixPage() {
  const [seatsData, setSeatsData] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [isSkeletonOpen, setSkeletonOpen] = useState(false)

  // Derived Statistics
  const stats = useMemo(() => {
    let total = 42;
    let present = 0;
    let available = 0;
    let fixed = 0;
    let occupied = 0;

    Object.values(seatsData).forEach(seat => {
      if (seat.status === 'available') available++;
      if (seat.status === 'occupied_male' || seat.status === 'occupied_female') {
        present++;
        occupied++;
      }
      if (seat.status === 'fixed_absent') {
        occupied++;
      }
      if (seat.user?.seatType === 'Fixed') {
        fixed++;
      }
    });

    return { total, present, available, occupied, fixed };
  }, [seatsData]);

  // Selected Seat Data
  // const selectedSeat = selectedSeatId ? seatsData[selectedSeatId] : null;

  // Render a single seat
  const renderSeat = (seatNumber) => {
    const seat = seatsData?.seats?.find((s) => s?.seatNumber == seatNumber)
    const isSelected = selectedSeat?.seatNumber === seatNumber;

    // Define colors based on status
    let colorClasses = '';

    if (isSelected) {
      colorClasses = 'bg-orange-500 border-orange-400 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)] scale-110 z-10';
    } else {
      if (seat?.userDetail?.seatType == "Fixed")
        colorClasses = 'bg-red-700 border-rose-500/30 text-white hover:bg-red-500';
      else if (seat?.status == "Available")
        colorClasses = 'bg-green-700 border-emerald-500/30 text-white hover:bg-green-500';
      else if (seat?.status == "Occupied" && seat?.userDetail?.gender == "Male")
        colorClasses = 'bg-blue-700 border-pink-500/30 text-white hover:bg-blue-500';
      else if (seat?.status == "Occupied" && seat?.userDetail?.gender == "Female")
        colorClasses = 'bg-pink-700 border-pink-500/30 text-white hover:bg-pink-500';
      else
        colorClasses = 'bg-slate-800 border-slate-700 text-slate-400';
    }

    return (
      <button
        key={seat?.seatNumber}
        onClick={() => setSelectedSeat(seat)}
        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-sm sm:text-base font-bold transition-all duration-300 border ${colorClasses}`}
        title={`Seat ${seat?.seatNumber}`}
      >
        {seat?.seatNumber}
      </button>
    );
  };

  async function initializeSeatData() {
    try {
      setSkeletonOpen(true)
      const res = await getLiveSeatMatrix()
      if (res?.data?.status) {
        setSkeletonOpen(false)
        setSeatsData(res?.data?.data)
      }
    } catch (error) {
      setSkeletonOpen(false)
      alert(error?.response?.data?.description)
    }
  }

  useEffect(() => {
    initializeSeatData()
  }, [])

  console.log(seatsData)

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-300 font-sans p-4 md:p-6 lg:p-8 selection:bg-blue-500/30">

      {/* Scrollbar styling */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>

      {!isSkeletonOpen ? <div className="max-w-[1600px] mx-auto">

        {/* 1️⃣ PAGE HEADER & STATS */}
        <div className="mb-8">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">Live Seat Matrix</h1>
            <p className="text-sm text-slate-500 mt-1">Real-time layout and status of library seats.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: 'Total Seats', value: 42, icon: LayoutGrid, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'hover:border-purple-500/30' },
              { label: 'Present Students', value: seatsData?.activeStudents, icon: UserCheck, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'hover:border-blue-500/30' },
              { label: 'Available Seats', value: seatsData?.availableSeats, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'hover:border-emerald-500/30' },
              // { label: 'Occupied Seats', value: stats.occupied, icon: Users, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'hover:border-amber-500/30' },
              { label: 'Fixed Seats', value: seatsData?.fixedSeats, icon: Bookmark, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'hover:border-rose-500/30' },
            ].map((stat, idx) => (
              <div key={idx} className={`bg-[#1a1d24] border border-slate-800 p-5 rounded-xl transition-all duration-300 group shadow-lg shadow-black/20 hover:-translate-y-1 ${stat.border}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-slate-400">{stat.label}</span>
                  <div className={`p-2 rounded-lg ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon size={18} />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-slate-100">{stat.value}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* 2️⃣ MAIN LAYOUT */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* LEFT SECTION: MATRIX */}
          <div className="w-full lg:w-[65%] xl:w-[70%] bg-[#15181e] border border-slate-700/50 rounded-2xl p-6 lg:p-8 shadow-xl shadow-black/20 flex flex-col items-center">

            {/* Header & Legend */}
            <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <LayoutGrid size={20} className="text-blue-500" /> Library Floor Plan
              </h2>

              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-medium bg-[#0f1115] px-4 py-2.5 rounded-xl border border-slate-800/80">
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/50 block"></span> Available</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500/50 block"></span> Male</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-pink-500/20 border border-pink-500/50 block"></span> Female</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-500/20 border border-rose-500/50 block"></span> Fixed (Absent)</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)] block"></span> Selected</div>
              </div>
            </div>

            {/* Matrix Wrapper */}
            <div className="w-full max-w-3xl overflow-x-auto custom-scrollbar pb-4 flex flex-col items-center">

              {/* Top Icons */}
              <div className="w-full flex justify-between items-center px-4 md:px-12 mb-8 text-slate-500">
                <div className="flex flex-col items-center gap-1 text-emerald-500/80">
                  <DoorOpen size={28} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Entry</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Box size={24} />
                  <span className="text-[10px] uppercase tracking-wider">Lockers</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-blue-400/80">
                  <Droplets size={24} />
                  <span className="text-[10px] uppercase tracking-wider">Washroom</span>
                </div>
              </div>

              {/* Rows Container */}
              <div className="flex flex-col">
                {MATRIX_ROWS.map((row, index) => {
                  // Determine margin bottom to group rows in pairs
                  let mbClass = 'mb-3 sm:mb-4'; // Default inner gap
                  if (index === 1 || index === 3) mbClass = 'mb-10 sm:mb-14 relative'; // Gap between clusters
                  if (index === 5) mbClass = ''; // Last row

                  return (
                    <div key={index} className={`flex justify-center items-center gap-6 sm:gap-12 md:gap-20 ${mbClass}`}>

                      {/* Left Column (3 seats) */}
                      <div className="flex gap-2 sm:gap-3">
                        {row.left.map(seatNumber => renderSeat(seatNumber))}
                      </div>

                      {/* Right Column (4 seats) */}
                      <div className="flex gap-2 sm:gap-3">
                        {row.right.map(seatNumber => renderSeat(seatNumber))}
                      </div>

                      {/* Visual divider for clusters (optional subtle line) */}
                      {(index === 1 || index === 3) && (
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-px bg-slate-800/50"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>


          {/* RIGHT SECTION: STICKY DETAILS PANEL */}
          <div className="w-full lg:w-[35%] xl:w-[30%] lg:sticky top-6">
            <div className="bg-[#15181e] border border-slate-700/50 rounded-2xl shadow-xl shadow-black/20 overflow-hidden min-h-[500px] flex flex-col transition-all duration-300">

              {/* Panel Header */}
              <div className="px-6 py-5 border-b border-slate-800/80 bg-[#1a1d24]/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-100 tracking-tight">Seat Details</h3>
                {selectedSeat && (
                  <span className="bg-[#0f1115] border border-slate-700 text-slate-300 text-xs px-2.5 py-1 rounded-md font-bold">
                    Seat #{selectedSeat.seatNumber}
                  </span>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col">

                {/* STATE 1: DEFAULT (No seat selected) */}
                {!selectedSeat && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70">
                    <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 border border-slate-700/50">
                      <LayoutGrid size={36} className="text-slate-500" />
                    </div>
                    <h4 className="text-lg font-semibold text-slate-300">No Seat Selected</h4>
                    <p className="text-sm text-slate-500 mt-2 max-w-[200px]">
                      Click on any seat from the matrix to view details and status.
                    </p>
                  </div>
                )}

                {/* STATE 2: AVAILABLE SEAT */}
                {selectedSeat && selectedSeat?.status === 'Available' && selectedSeat?.seatType === 'Random' && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                      <CheckCircle size={40} className="text-emerald-400" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-100 mb-2">Seat is Available</h4>
                    <p className="text-sm text-slate-400 mb-8 max-w-[220px]">
                      This seat is currently empty and ready to be assigned.
                    </p>
                    {/* <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-8 py-3 rounded-xl font-semibold shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all transform hover:-translate-y-0.5">
                      <Plus size={18} />
                      Assign Seat
                    </button> */}
                  </div>
                )}

                {/* STATE 3: OCCUPIED / FIXED SEAT DETAILS */}
                {selectedSeat && selectedSeat?.userDetail && (
                  <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300 h-full">

                    {/* User Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xl shrink-0 shadow-inner">
                        {getInitials(selectedSeat?.userDetail?.name)}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-lg font-bold text-slate-100 truncate">{selectedSeat?.userDetail?.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[10px] font-bold  tracking-wider px-2 py-0.5 rounded border ${selectedSeat.status === 'Available' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            }`}>
                            {selectedSeat.status == 'Available' ? 'Inactive' : 'Active'}
                          </span>
                          <span className="bg-[#0f1115] border border-slate-700 text-slate-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                            {selectedSeat?.userDetail?.gender}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 gap-3 flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4">

                      {/* Contact & Address */}
                      <div className="bg-[#0f1115] border border-slate-800/80 rounded-xl p-3.5 flex flex-col gap-3">
                        <div className="flex items-start gap-3">
                          <Phone size={14} className="text-slate-500 mt-0.5 shrink-0" />
                          <span className="text-sm font-medium text-slate-300">{selectedSeat?.userDetail?.contact}</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin size={14} className="text-slate-500 mt-0.5 shrink-0" />
                          <span className="text-sm text-slate-400 leading-snug">{selectedSeat?.userDetail?.address}</span>
                        </div>
                      </div>

                      {/* Status Info */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#0f1115] border border-slate-800/80 rounded-xl p-3.5 flex flex-col gap-1">
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1.5"><Bookmark size={12} /> Seat Type</span>
                          <span className="text-sm font-semibold text-slate-200">{selectedSeat?.userDetail?.seatType}</span>
                        </div>
                        <div className="bg-[#0f1115] border border-slate-800/80 rounded-xl p-3.5 flex flex-col gap-1">
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1.5"><Box size={12} /> Locker</span>
                          <span className="text-sm font-semibold text-slate-200">{selectedSeat?.userDetail?.lockerId?.lockerNumber || 'N/A'}</span>
                        </div>
                        <div className="bg-[#0f1115] border border-slate-800/80 rounded-xl p-3.5 flex flex-col gap-1">
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1.5"><Clock size={12} /> Check-In</span>
                          <span className="text-sm font-semibold text-blue-400">{selectedSeat?.checkinTime || 'Not checked in'}</span>
                        </div>
                        {selectedSeat?.checkoutTime && <div className="bg-[#0f1115] border border-slate-800/80 rounded-xl p-3.5 flex flex-col gap-1">
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1.5"><Clock size={12} /> Check-Out</span>
                          <span className="text-sm font-semibold text-red-400">{selectedSeat?.checkinTime || 'Not checked out'}</span>
                        </div>}
                        <div className="bg-[#0f1115] border border-slate-800/80 rounded-xl p-3.5 flex flex-col gap-1">
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider flex items-center gap-1.5"><IndianRupee size={12} /> Fees</span>
                          <span className={`text-sm font-semibold ${selectedSeat?.userDetail?.paymentStatus === 'Paid' ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {selectedSeat?.userDetail?.paymentStatus}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {/* <div className="pt-4 border-t border-slate-800/80 mt-2 flex gap-3">
                      <button className="flex-1 flex items-center justify-center gap-2 bg-[#0f1115] hover:bg-slate-800 text-slate-300 border border-slate-700 py-2.5 rounded-xl font-medium transition-colors text-sm">
                        <Edit2 size={16} /> Edit
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 py-2.5 rounded-xl font-medium transition-colors text-sm">
                        End Booking
                      </button>
                    </div> */}

                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div> : <LiveSeatMatrixSkeleton />}
    </div>
  );
}