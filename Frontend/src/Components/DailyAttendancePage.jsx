import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Calendar,
  Search,
  Filter,
  ChevronDown,
  Check,
  Users,
  LogIn,
  LogOut,
  Clock,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import { getAttendanceOfAnyParticularDay } from '../axios/attendanceApi';
import AdminDashboardSkeleton from './Loaders/Skeletons/AdminDashboardSkeleton';

// --- HELPER FUNCTIONS ---
const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  return parts.length > 1 
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name[0].toUpperCase();
};

const formatTime = (isoString) => {
  if (!isoString) return "—";
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const calculateTimeSpent = (checkInStr, checkOutStr) => {
  if (!checkInStr || !checkOutStr) return "—";
  const checkIn = new Date(checkInStr);
  const checkOut = new Date(checkOutStr);
  const diffMs = Math.max(0, checkOut - checkIn);
  
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffHrs === 0) return `${diffMins}m`;
  return `${diffHrs}h ${diffMins}m`;
};



export default function DailyAttendancePage() {

   const [isSkeletonOpen, setSkeletonOpen] = useState(false)

  // State
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-GB').replace(/\//g, '-'));
  const [attendanceData , setAttendanceData] = useState([])
  const [filteredData , setFilteredData] = useState()
  const [searchQuery, setSearchQuery] = useState('');
  const[genderFilter, setGenderFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  const isToday = selectedDate == new Date().toLocaleDateString('en-GB').replace(/\//g, '-')

  function handleFilterChange(){
    
    const matches = attendanceData?.attendance?.filter((attendance) => attendance?.userId?.name?.toLowerCase().includes(searchQuery?.trim().toLowerCase()))
    if(genderFilter != "All"){
      const data = matches.filter((attendance) => attendance?.userId?.gender == genderFilter)
      setFilteredData(data)
    }
    else{
      setFilteredData(matches)
    }  
  }

  useEffect(() => {
      handleFilterChange()
  } , [searchQuery , genderFilter , attendanceData])


  // Close filter dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  },[]);



  async function initializeAttendanceData(){
    try {
      setSkeletonOpen(true)
      if(!selectedDate) return
      const res = await getAttendanceOfAnyParticularDay(selectedDate)
      if(res?.data?.status){
          setAttendanceData(res?.data?.data)
          setSkeletonOpen(false)
      }
    } catch (error) {
      setSkeletonOpen(false)
      console.log(error)
    }
  }


  console.log(attendanceData)

  useEffect(() => {
    initializeAttendanceData()
  } , [selectedDate])

  return (
    <div className="min-h-screen bg-[var(--bg-background)] text-[var(--text-primary)] font-sans p-4 md:p-8 transition-colors duration-300">
      
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
          
          --success: #10b981;             
          --success-bg: rgba(16, 185, 129, 0.1);
          --warning: #f59e0b;             
          --warning-bg: rgba(245, 158, 11, 0.1);
        }

        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--bg-surface-hover); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
      `}</style>

      {!isSkeletonOpen ? <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* =========================================
            PAGE HEADER
            ========================================= */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">Daily Attendance</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1.5">View member attendance logs for any date.</p>
          </div>

          {/* Date Selector */}
          <div className="relative flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-xl px-4 py-2.5 shadow-sm focus-within:ring-2 ring-[var(--accent-primary)]/40 transition-all group overflow-hidden cursor-pointer hover:border-[var(--border-focus)]">
            <Calendar size={18} className="text-[var(--text-secondary)] group-focus-within:text-[var(--accent-primary)] transition-colors" />
            <span className="font-semibold text-sm tracking-wide text-[var(--text-primary)]">{selectedDate}</span>
            {/* Transparent native date input */}
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value.split("-").reverse().join("-"))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer[color-scheme:dark]"
            />
          </div>
        </header>

        {/* =========================================
            ATTENDANCE OVERVIEW STATS
            ========================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Total Present Students */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-xl p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Total Present Students</span>
              <div className="p-2.5 rounded-lg bg-[var(--accent-transparent)] text-[var(--accent-primary)] group-hover:scale-110 transition-transform duration-300">
                <Users size={20} />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-[var(--text-primary)]">{attendanceData?.totalPresentStudents || 0}</h3>
          </div>

          {/* Total Checked-In */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-xl p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Total Checked-In</span>
              <div className="p-2.5 rounded-lg bg-[var(--success-bg)] text-[var(--success)] group-hover:scale-110 transition-transform duration-300">
                <LogIn size={20} />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-[var(--text-primary)]">{attendanceData?.totalCheckedInUsers || 0}</h3>
          </div>

          {/* Total Checked-Out */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-xl p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group md:col-span-2 lg:col-span-1">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Total Checked-Out</span>
              <div className="p-2.5 rounded-lg bg-[var(--warning-bg)] text-[var(--warning)] group-hover:scale-110 transition-transform duration-300">
                <LogOut size={20} />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-[var(--text-primary)]">{attendanceData?.totalCheckedOutUsers || 0}</h3>
          </div>
        </div>

        {/* =========================================
            ATTENDANCE LOG CONTAINER
            ========================================= */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl shadow-sm overflow-hidden flex flex-col">
          
          {/* Container Header: Search & Filter */}
          <div className="p-5 lg:p-6 border-b border-[var(--border-muted)] flex flex-col md:flex-row gap-4 justify-between items-center bg-[var(--bg-surface)]/30">
            
            {/* Search Input */}
            <div className="relative w-full md:max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-[var(--accent-primary)] transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search member by name or seat number..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-xl pl-11 pr-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition-all shadow-sm"
              />
            </div>

            {/* Gender Filter */}
            <div className="relative w-full md:w-48" ref={filterRef}>
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full flex items-center justify-between bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] hover:border-[var(--border-focus)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition-all shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <Filter size={16} className="text-[var(--text-secondary)]" />
                  <span className="font-medium">{genderFilter}</span>
                </div>
                <ChevronDown size={16} className={`text-[var(--text-secondary)] transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-full bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-xl shadow-xl overflow-hidden z-20 py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                  {['All', 'Male', 'Female'].map((gender) => (
                    <button
                      key={gender}
                      onClick={() => {
                        setGenderFilter(gender);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between
                        ${genderFilter === gender 
                          ? 'bg-[var(--accent-transparent)] text-[var(--accent-primary)] font-medium' 
                          : 'text-[var(--text-primary)] hover:bg-[var(--bg-surface)]'}
                      `}
                    >
                      {gender}
                      {genderFilter === gender && <Check size={14} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="bg-[var(--bg-surface)]/50 sticky top-0 z-10 backdrop-blur-sm">
                <tr className="border-b border-[var(--border-muted)] text-[var(--text-secondary)] text-xs uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Seat Type</th>
                  <th className="px-6 py-4">Seat Number</th>
                  <th className="px-6 py-4">Check-In Time</th>
                  <th className="px-6 py-4">Check-Out Time</th>
                  <th className="px-6 py-4">{isToday ? 'Status' : 'Total Time Spent'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-muted)]">
                {filteredData?.length > 0 ? (
                  filteredData?.map((log, index) => (
                    <tr 
                      key={log.id} 
                      className={`hover:bg-[var(--bg-surface)] transition-colors group ${index % 2 === 0 ? 'bg-[var(--bg-background)]/20' : ''}`}
                    >
                      
                      {/* Name & Avatar */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--accent-primary)]/20 to-purple-500/20 border border-[var(--accent-primary)]/20 flex items-center justify-center text-[var(--accent-primary)] font-bold text-xs shrink-0 shadow-inner">
                            {getInitials(log?.userId?.name)}
                          </div>
                          <span className="font-medium text-[var(--text-primary)]">{log?.userId?.name}</span>
                        </div>
                      </td>
                      
                      {/* Seat Type */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-[var(--text-secondary)]">{log?.userId?.seatType}</span>
                      </td>

                      {/* Seat Number */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-[var(--text-muted)]" />
                          <span className="text-sm font-medium text-[var(--text-primary)]">{log?.seatNumber}</span>
                        </div>
                      </td>
                      
                      {/* Check-In */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-[var(--text-secondary)]">{formatTime(log?.checkInTime)}</span>
                      </td>

                      {/* Check-Out */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-[var(--text-secondary)]">{formatTime(log?.checkOutTime)}</span>
                      </td>
                      
                      {/* Conditional: Status OR Time Spent */}
                      <td className="px-6 py-4">
                        {isToday ? (
                          // Show Status Badges for Today
                          log.status != "Active" ? (
                            <div className="inline-flex items-center gap-1.5 bg-[var(--warning-bg)] text-[var(--warning)] border border-[var(--warning)]/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                              <LogOut size={14} /> Checked Out
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 bg-[var(--success-bg)] text-[var(--success)] border border-[var(--success)]/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                              <CheckCircle2 size={14} /> Active
                            </div>
                          )
                        ) : (
                          // Show Time Spent for Past Dates
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-[var(--accent-primary)]" />
                            <span className="text-sm font-medium text-[var(--text-primary)]">
                              {calculateTimeSpent(log.checkInTime, log.checkOutTime)}
                            </span>
                          </div>
                        )}
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center text-[var(--text-secondary)]">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Search size={24} className="text-[var(--text-muted)] mb-2" />
                        <p className="font-medium text-[var(--text-primary)]">No attendance logs found</p>
                        <p className="text-sm">Try adjusting your search filters or date.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS VIEW */}
          <div className="md:hidden flex flex-col divide-y divide-[var(--border-muted)]">
            {filteredData?.length > 0 ? (
              filteredData?.map((log) => (
                <div key={log.id} className="p-5 flex flex-col gap-4 bg-[var(--bg-card)] hover:bg-[var(--bg-surface)]/50 transition-colors">
                  
                  {/* Card Header: Avatar, Name & Status/Time */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-primary)]/20 to-purple-500/20 border border-[var(--accent-primary)]/20 flex items-center justify-center text-[var(--accent-primary)] font-bold text-sm shrink-0 shadow-inner">
                        {getInitials(log.name)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--text-primary)]">{log?.userId?.name}</h3>
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">{log?.userId?.seatType} • {log?.seatNumber}</p>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="bg-[var(--bg-surface)]/40 p-3 rounded-xl border border-[var(--border-muted)] grid grid-cols-2 gap-3">
                    <div>
                      <span className="block text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] mb-1">Check-In</span>
                      <span className="text-sm text-[var(--text-primary)] font-medium">{formatTime(log?.checkInTime)}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] mb-1">Check-Out</span>
                      <span className="text-sm text-[var(--text-primary)] font-medium">{formatTime(log?.checkOutTime)}</span>
                    </div>
                  </div>

                  {/* Conditional Footer: Status or Time Spent */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-sm font-medium text-[var(--text-secondary)]">
                      {isToday ? 'Status' : 'Time Spent'}
                    </span>
                    
                    {isToday ? (
                      log.checkOut ? (
                        <div className="inline-flex items-center gap-1.5 bg-[var(--warning-bg)] text-[var(--warning)] border border-[var(--warning)]/20 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                          <LogOut size={12} /> Checked Out
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 bg-[var(--success-bg)] text-[var(--success)] border border-[var(--success)]/20 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                          <CheckCircle2 size={12} /> Present
                        </div>
                      )
                    ) : (
                      <span className="text-sm font-bold text-[var(--accent-primary)] bg-[var(--accent-transparent)] px-3 py-1 rounded-lg">
                        {calculateTimeSpent(log.checkInTime, log.checkOutTime)}
                      </span>
                    )}
                  </div>

                </div>
              ))
            ) : (
              <div className="p-10 text-center text-[var(--text-secondary)]">
                No attendance logs found for this date.
              </div>
            )}
          </div>

        </div>
      </div> : <AdminDashboardSkeleton />}
    </div>
  );
}