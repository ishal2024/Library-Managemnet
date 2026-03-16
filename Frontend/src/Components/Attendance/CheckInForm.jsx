import React, { useState, useEffect, useRef } from 'react';
import {
  LogIn,
  LogOut,
  Search,
  Check,
  Clock,
  Info,
  ChevronDown,
  LayoutGrid,
} from 'lucide-react';
import { checkIn } from '../../axios/attendanceApi';
import { getLiveSeatMatrix } from '../../axios/seatsApi';

const today = new Date();
const setPastTime = (hours, minutes) => {
  const d = new Date(today);
  d.setHours(d.getHours() - hours);
  d.setMinutes(d.getMinutes() - minutes);
  return d.toISOString();
};

// const DUMMY_MEMBERS = [
//   // Available for Check-In
//   { id: 1, name: 'Rahul Kumar', email: 'rahul.k@example.com', seatType: 'Random', checkInTime: null },
//   { id: 2, name: 'Anjali Verma', email: 'anjali.v@example.com', seatType: 'Fixed', checkInTime: null },
//   { id: 3, name: 'Siddharth Rao', email: 'siddharth.r@example.com', seatType: 'Random', checkInTime: null },
//   { id: 4, name: 'Neha Gupta', email: 'neha.g@example.com', seatType: 'Fixed', checkInTime: null },

//   // Available for Check-Out (Already Checked In)
//   { id: 5, name: 'Priya Sharma', email: 'priya.s@example.com', seatType: 'Random', checkInTime: setPastTime(3, 45) },
//   { id: 6, name: 'Arjun Das', email: 'arjun.d@example.com', seatType: 'Fixed', checkInTime: setPastTime(6, 15) },
//   { id: 7, name: 'Karan Mehra', email: 'karan.m@example.com', seatType: 'Fixed', checkInTime: setPastTime(1, 10) },
//   { id: 8, name: 'Sneha Patil', email: 'sneha.p@example.com', seatType: 'Random', checkInTime: setPastTime(4, 30) },
// ];

// Generate 42 seats, making some "unavailable" randomly for the demo
const SEATS = Array.from({ length: 42 }, (_, i) => ({
  id: i + 1,
  available: ![3, 8, 14, 22, 35].includes(i + 1),
}));

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name[0].toUpperCase();
};



const CheckInForm = ({ users }) => {
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSuggestionData, setSearchSuggestionData] = useState([])
  const [selectedUser, setSelectedUser] = useState(null);


  const [isSeatDropdownOpen, setIsSeatDropdownOpen] = useState(false);
  const [seatsData, setSeatsData] = useState([])
  const [selectedSeat, setSelectedSeat] = useState(null);

  const autocompleteRef = useRef(null);
  const seatDropdownRef = useRef(null);

  // Filter members who are NOT checked in yet
  //   const availableMembers = DUMMY_MEMBERS.filter(m => !m.checkInTime);
  //   const filteredMembers = availableMembers.filter(user => 
  //     user.name.toLowerCase().includes(search.toLowerCase()) || 
  //     user.email.toLowerCase().includes(search.toLowerCase())
  //   );

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (seatDropdownRef.current && !seatDropdownRef.current.contains(e.target)) {
        setIsSeatDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSearch(user?.name);
    setShowSuggestions(false);
    setSelectedSeat(null); // Reset seat selection
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setSelectedUser(null);
    setShowSuggestions(e.target.value.trim().length > 0)
    const filter = users.filter((user) => user?.user?.name?.toLowerCase().includes(e.target.value.trim().toLowerCase()))
    console.log(filter)
    setSearchSuggestionData(filter)
  };

  const handleClockIn = async () => {
    if (!selectedUser) return alert('Please select a member first.');
    if (selectedUser.seatType === 'Random' && !selectedSeat) {
      return alert('Please select a seat for this random seat member.');
    }

    if (selectedUser.seatType === 'Fixed' && !selectedUser?.seatId) {
      return alert('Please assign seat to fixed seat users');
    }

    const data = {
      user: selectedUser,
      seatNumber: selectedUser?.seatType == "Random" ? selectedSeat?.seatNumber : selectedUser?.seatId?.seatNumber
    }

    console.log(data)

    try {
      const res = await checkIn(data)
      if (res?.data?.status) {
        setSearch('');
        setSelectedUser(null);
        setSelectedSeat(null);
        console.log(res?.data?.data)
        alert("Checkin Completed")
      }
    } catch (error) {
      console.log(error?.message)
    }

  };

  async function initializeSeatData() {
    try {
      const res = await getLiveSeatMatrix()
      if (res?.data?.status) {
        setSeatsData(res?.data?.data?.seats)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    initializeSeatData()
  }, [users])

  return (
    <div className="bg-[#15181e] border border-slate-700/50 rounded-2xl p-6 lg:p-8 shadow-xl shadow-black/20 relative group hover:shadow-[0_0_30px_rgba(59,130,246,0.05)] hover:border-blue-500/20 transition-all duration-500 flex flex-col h-full">

      {/* Card Header */}
      <div className="flex items-center gap-4 mb-8 pb-5 border-b border-slate-800/80">
        <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400 shadow-inner group-hover:scale-105 transition-transform duration-300">
          <LogIn size={28} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">Member Check-In</h2>
          <p className="text-xs text-slate-500 mt-0.5">Record an entry to the library</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col space-y-6 relative">

        {/* User Search Autocomplete */}
        <div className="space-y-2 relative z-50" ref={autocompleteRef}>
          <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <Search size={14} /> Search Member
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              onFocus={() => { if (search.trim().length > 0) setShowSuggestions(true); }}
              placeholder="Search member..."
              autoComplete="off"
              className="w-full bg-[#0f1115] border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
            />
          </div>

          {/* Dropdown Suggestions */}
          {showSuggestions && (
            <div className="absolute top-[105%] left-0 w-full bg-[#15181e] border border-slate-700/80 rounded-xl shadow-xl shadow-black/50 max-h-64 overflow-y-auto custom-scrollbar animate-slide-down">
              {searchSuggestionData.length > 0 ? (
                <ul className="py-2">
                  {searchSuggestionData.map((user, idx) => (
                    <li
                      key={idx}
                      onClick={() => handleSelectUser(user?.user)}
                      className="group px-4 py-3 hover:bg-slate-800/60 cursor-pointer transition-all duration-200 flex items-center gap-3 border-b border-slate-800/50 last:border-none"
                    >
                      <div className="w-4 flex justify-center shrink-0">
                        <Check size={16} className="opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity duration-200" />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm shrink-0 shadow-inner group-hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-shadow">
                        {getInitials(user?.user?.name)}
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-semibold text-slate-200 group-hover:text-blue-400 transition-colors truncate">
                          {user?.user?.name}
                        </span>
                        <span className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors truncate mt-0.5">
                          {user?.user?.email} &bull; <span className={user?.user?.seatType === 'Fixed' ? 'text-blue-400' : 'text-purple-400'}>{user?.user?.seatType} Seat</span>
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-4 text-sm text-slate-500 text-center flex flex-col items-center gap-2">
                  <Search size={20} className="text-slate-600" />
                  <p>No available members found.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* FANCY SEAT SELECTOR (Only if Random Seat) */}
        {selectedUser && selectedUser.seatType === 'Random' && (
          <div className="space-y-2 relative z-40 animate-slide-down" ref={seatDropdownRef}>
            <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <LayoutGrid size={14} /> Select Seat Assignment
            </label>

            <button
              type="button"
              onClick={() => setIsSeatDropdownOpen(!isSeatDropdownOpen)}
              className="w-full bg-[#0f1115] border border-slate-800 rounded-xl px-4 py-3.5 text-left flex items-center justify-between hover:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
            >
              <span className={selectedSeat ? "text-slate-200 font-medium" : "text-slate-600"}>
                {selectedSeat ? `Seat #${selectedSeat?.seatNumber}` : "Choose an available seat..."}
              </span>
              <ChevronDown size={18} className={`text-slate-500 transition-transform duration-300 ${isSeatDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Panel Grid */}
            {isSeatDropdownOpen && (
              <div className="absolute top-[105%] left-0 w-full bg-[#1a1d24] border border-slate-700/80 rounded-xl shadow-xl shadow-black/50 p-4 animate-slide-down z-50">
                <div className="grid grid-cols-6 sm:grid-cols-7 gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                  {seatsData.map((seat) => (
                    <button
                      key={seat.id}
                      disabled={seat?.status == "Occupied" || seat?.seatType == "Fixed"}
                      onClick={() => {
                        setSelectedSeat(seat);
                        setIsSeatDropdownOpen(false);
                      }}
                      className={`
                        relative w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-200
                        ${seat?.status == "Occupied" || seat?.seatType == "Fixed"
                          ? 'bg-rose-500/10 text-rose-500/50 border border-rose-500/10 cursor-not-allowed'
                          : selectedSeat?.seatNumber === seat?.seatNumber
                            ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] border border-blue-400 scale-105'
                            : 'bg-[#0f1115] text-slate-400 border border-slate-800 hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-500/30'
                        }
                      `}
                    >
                      {seat?.seatNumber}
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-4 text-xs font-medium border-t border-slate-800/80 pt-3">
                  <span className="flex items-center gap-1.5 text-slate-400"><span className="w-2.5 h-2.5 rounded-full bg-[#0f1115] border border-slate-600"></span> Available</span>
                  <span className="flex items-center gap-1.5 text-slate-400"><span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-[0_0_5px_rgba(59,130,246,0.5)]"></span> Selected</span>
                  <span className="flex items-center gap-1.5 text-slate-400"><span className="w-2.5 h-2.5 rounded-full bg-rose-500/20 border border-rose-500/20"></span> Occupied</span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex-1"></div> {/* Spacer to push button down */}

        {/* Action Button */}
        <button
          onClick={handleClockIn}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-4 rounded-xl font-semibold shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-all duration-300 transform hover:-translate-y-1 text-lg"
        >
          <LogIn size={22} />
          <span>Clock In Member</span>
        </button>
      </div>
    </div>
  );
};

export default CheckInForm