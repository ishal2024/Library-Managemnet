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
import { checkOut, getCheckoutInfo } from '../../axios/attendanceApi';



const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name[0].toUpperCase();
};


const formatTime = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};


const CheckOutForm = ({ users }) => {
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSuggestionData, setSearchSuggestionData] = useState([])
  const [selectedUser, setSelectedUser] = useState(null);

  const [userCheckoutInfo, setUserCheckoutInfo] = useState({})

  const autocompleteRef = useRef(null);

  // Filter members who ARE currently checked in
  // const checkedInMembers = DUMMY_MEMBERS.filter(m => m.checkInTime);
  // const filteredMembers = checkedInMembers.filter(user => 
  //   user.name.toLowerCase().includes(search.toLowerCase()) || 
  //   user.email.toLowerCase().includes(search.toLowerCase())
  // );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    setSearch(user.name);
    setShowSuggestions(false);
    try {
      const res = await getCheckoutInfo(user?._id)
      if (res?.data?.status) {
        setUserCheckoutInfo(res?.data?.data)
      }
    } catch (error) {
      setUserCheckoutInfo({})
      console.log(error?.response?.data)
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setSelectedUser(null);
    setShowSuggestions(e.target.value.trim().length > 0);
    const filter = users?.filter((user) => user?.user?.name?.toLowerCase().includes(e.target.value.trim().toLowerCase()))
    console.log(filter)
    setSearchSuggestionData(filter)
  };

  const handleClockOut = async () => {
    if (!selectedUser) return alert('Please select a member first.');

    try {
      const res = await checkOut(selectedUser?._id)
      if (res?.data?.status) {
        alert("User successfully checkout")
        // Reset Form
        setSearch('');
        setSelectedUser(null);
      }
    } catch (error) {
       alert(error?.response?.data?.description)
    }

  };

  return (
    <div className="bg-[#15181e] border border-slate-700/50 rounded-2xl p-6 lg:p-8 shadow-xl shadow-black/20 relative group hover:shadow-[0_0_30px_rgba(244,63,94,0.05)] hover:border-rose-500/20 transition-all duration-500 flex flex-col h-full">

      {/* Card Header */}
      <div className="flex items-center gap-4 mb-8 pb-5 border-b border-slate-800/80">
        <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20 text-rose-400 shadow-inner group-hover:scale-105 transition-transform duration-300">
          <LogOut size={28} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">Member Check-Out</h2>
          <p className="text-xs text-slate-500 mt-0.5">Record an exit from the library</p>
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
              className="w-full bg-[#0f1115] border border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20 transition-all shadow-sm"
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
                        <Check size={16} className="opacity-0 group-hover:opacity-100 text-rose-500 transition-opacity duration-200" />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-600/20 to-orange-600/20 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-sm shrink-0 shadow-inner group-hover:shadow-[0_0_15px_rgba(244,63,94,0.2)] transition-shadow">
                        {getInitials(user?.user?.name)}
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-semibold text-slate-200 group-hover:text-rose-400 transition-colors truncate">
                          {user?.user?.name}
                        </span>
                        <span className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors truncate mt-0.5">
                          {user?.user?.email} &bull;
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-4 text-sm text-slate-500 text-center flex flex-col items-center gap-2">
                  <Search size={20} className="text-slate-600" />
                  <p>No checked-in members found.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* AUTO DISCLAIMER BANNER (IMPORTANT FEATURE) */}
        {selectedUser && (
          <div className="bg-[#121b2a] border border-slate-800 border-l-4 border-l-blue-500 rounded-r-xl rounded-l-md p-5 animate-slide-down shadow-inner relative overflow-hidden">
            {/* Background glowing orb */}
            <div className="absolute top-[-50%] right-[-10%] w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-start gap-3 relative z-10">
              <Info className="text-blue-500 mt-0.5 shrink-0" size={20} />
              <div className="flex flex-col gap-1.5 w-full">
                <h4 className="text-slate-200 font-semibold text-sm">Attendance Summary</h4>

                <div className="bg-[#0f1115]/50 rounded-lg p-3 mt-1 border border-slate-800/80 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-slate-500 block mb-0.5">Clock In Time</span>
                    <span className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                      <Clock size={13} className="text-blue-400" />
                      {userCheckoutInfo.length == 0 ? "N/A" : userCheckoutInfo?.formattedCheckinTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block mb-0.5">Time Spent</span>
                    <span className="text-sm font-medium text-blue-400">
                      {userCheckoutInfo.length == 0 ? "N/A" : userCheckoutInfo?.totalTimeSpent}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1"></div> {/* Spacer */}

        {/* Action Button */}
        <button
          onClick={handleClockOut}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white px-6 py-4 rounded-xl font-semibold shadow-[0_0_15px_rgba(244,63,94,0.2)] hover:shadow-[0_0_25px_rgba(244,63,94,0.4)] transition-all duration-300 transform hover:-translate-y-1 text-lg"
        >
          <LogOut size={22} />
          <span>Clock Out Member</span>
        </button>
      </div>
    </div>
  );
};

export default CheckOutForm