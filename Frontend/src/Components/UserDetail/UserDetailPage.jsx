import React, { useState, useMemo } from 'react';
import {
    User,
    Mail,
    Phone,
    Calendar,
    MapPin,
    Box,
    LayoutGrid,
    CreditCard,
    Clock,
    History,
    CalendarDays,
    CheckCircle2,
    XCircle,
    AlertCircle,
    LogOut,
    Fingerprint
} from 'lucide-react';
import { getSpecificUserData } from '../../axios/usersApi';
import { useEffect } from 'react';
import { getUserAttendanceAtSpecificDate } from '../../axios/attendanceApi';

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


export default function UserDetailPage() {
    // State
    const [activeTab, setActiveTab] = useState('bookings');
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0].split("-").reverse().join("-"));
    const [userDetail, setUserDetail] = useState({})
    const [userPayments, setUserPayments] = useState([])
    const [userAttendance, setUserAttendance] = useState([])

     const isToday = attendanceDate == new Date().toISOString().split("T")[0].split("-").reverse().join("-");

    async function handleAttendanceDateChange(e) {
        console.log(e.target.value.split("-").reverse().join("-"))
        setAttendanceDate(e.target.value.split("-").reverse().join("-"))
        try {
            const data = { userId: userDetail?._id, date: e.target.value.split("-").reverse().join("-") }
            const res = await getUserAttendanceAtSpecificDate(data)
            if (res?.data?.status) {
                setUserAttendance(res?.data?.attendance)
            }
        } catch (error) {
            setAttendanceDate([])
        }
    }



    async function initializeUserDetails() {
        try {
            const res = await getSpecificUserData("69b0361179b864e1af57f2b7")
            if (res?.data?.status) {
                setUserDetail(res?.data?.data?.user)
                setUserAttendance(res?.data?.data?.attendance)
                setUserPayments(res?.data?.data?.payments)
            }
        } catch (error) {
            console.log(error?.message)
        }
    }

    console.log(attendanceDate)

    useEffect(() => {
        initializeUserDetails()
    }, [])

    return (
        <div className="min-h-screen bg-[var(--bg-background)] text-[var(--text-primary)] font-sans p-4 md:p-6 lg:p-8 transition-colors duration-300">

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
          --danger: #ef4444;
          --danger-bg: rgba(239, 68, 68, 0.1);
        }

        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--bg-surface-hover); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
      `}</style>

            <div className="max-w-[1400px] mx-auto">

                {/* PAGE HEADER */}
                <header className="mb-6 lg:mb-8">
                    <div className="flex items-center gap-3">
                        <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-2 bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-lg shadow-sm hidden sm:block">
                            <History size={18} className="rotate-180" /> {/* Back arrow approximation */}
                        </button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[var(--text-primary)]">User Detail</h1>
                            <p className="text-sm text-[var(--text-secondary)] mt-1">Complete information and activity logs for {userDetail?.name}</p>
                        </div>
                    </div>
                </header>

                {/* MAIN LAYOUT (2 Columns on Desktop) */}
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

                    {/* =========================================
              LEFT SECTION – USER DETAILS (35%)
              ========================================= */}
                    <div className="w-full lg:w-[35%] bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl shadow-lg overflow-hidden shrink-0 flex flex-col">

                        {/* Profile Header */}
                        <div className="bg-[var(--bg-surface)]/40 p-6 flex flex-col items-center justify-center border-b border-[var(--border-muted)] relative">
                            <div className="absolute top-4 right-4 bg-[var(--success-bg)] text-[var(--success)] border border-[var(--success)]/20 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                Active
                            </div>
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--accent-primary)]/20 to-purple-500/20 border-2 border-[var(--accent-primary)]/30 flex items-center justify-center text-[var(--accent-primary)] font-bold text-3xl shadow-inner mb-4">
                                {getInitials(userDetail?.name)}
                            </div>
                            <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">{userDetail?.name}</h2>
                            <p className="text-sm text-[var(--text-secondary)] mt-0.5">{userDetail?.email}</p>
                        </div>

                        {/* Profile Fields */}
                        <div className="p-6 flex flex-col gap-4">
                            <ProfileField icon={<Fingerprint />} label="User ID" value={userDetail?._id} />
                            <ProfileField icon={<Phone />} label="Contact" value={userDetail?.contact} />
                            <ProfileField icon={<User />} label="Gender" value={userDetail?.gender} />
                            <ProfileField icon={<CalendarDays />} label="Date of Birth" value={userDetail?.dob} />
                            <ProfileField icon={<MapPin />} label="Address" value={userDetail?.address} isMultiLine />

                            <div className="my-2 h-px bg-[var(--border-muted)] w-full"></div>

                            <ProfileField icon={<LayoutGrid />} label="Seat Type" value={userDetail?.seatType} />
                            <ProfileField icon={<MapPin />} label="Seat ID" value={userDetail?.seatId?.seatNumber} highlight />
                            <ProfileField icon={<Box />} label="Locker ID" value={userDetail?.lockerId?.lockerNumber} highlight />
                            <ProfileField icon={<CreditCard />} label="Payment Status" value={userDetail?.paymentId} />

                            <div className="my-2 h-px bg-[var(--border-muted)] w-full"></div>

                            <ProfileField icon={<Calendar />} label="Joined Date" value={new Date(userDetail?.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} />
                            <ProfileField icon={<Clock />} label="Last Updated" value={userDetail?.updatedAt} />
                        </div>
                    </div>

                    {/* =========================================
              RIGHT SECTION – ACTIVITY LOGS (65%)
              ========================================= */}
                    <div className="w-full lg:w-[65%] flex flex-col gap-6">

                        {/* Container Card */}
                        <div className="bg-[var(--bg-card)] border border-[var(--border-muted)] rounded-2xl shadow-lg flex flex-col min-h-[600px] overflow-hidden">

                            {/* Tabs Header */}
                            <div className="flex px-4 sm:px-6 border-b border-[var(--border-muted)] bg-[var(--bg-surface)]/30 overflow-x-auto custom-scrollbar">
                                <button
                                    onClick={() => setActiveTab('bookings')}
                                    className={`px-4 py-5 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${activeTab === 'bookings'
                                        ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
                                        : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                        }`}
                                >
                                    Booking Logs
                                </button>
                                <button
                                    onClick={() => setActiveTab('attendance')}
                                    className={`px-4 py-5 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${activeTab === 'attendance'
                                        ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
                                        : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                        }`}
                                >
                                    Attendance Logs
                                </button>
                            </div>

                            {/* TAB CONTENT: BOOKING LOGS */}
                            {activeTab === 'bookings' && (
                                <div className="flex-1 flex flex-col">
                                    {/* Desktop Table View */}
                                    <div className="hidden md:block overflow-x-auto custom-scrollbar">
                                        <table className="w-full text-left border-collapse whitespace-nowrap">
                                            <thead className="bg-[var(--bg-surface)]/50 sticky top-0 z-10 backdrop-blur-sm">
                                                <tr className="border-b border-[var(--border-muted)] text-[var(--text-secondary)] text-xs uppercase tracking-wider font-semibold">
                                                    <th className="px-6 py-4">Seat Number</th>
                                                    <th className="px-6 py-4">Seat Type</th>
                                                    <th className="px-6 py-4">Locker Number</th>
                                                    <th className="px-6 py-4">Start Date</th>
                                                    <th className="px-6 py-4">End Date</th>
                                                    <th className="px-6 py-4">Payment Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[var(--border-muted)]">
                                                {userPayments.map((log) => (
                                                    <tr key={log.id} className="hover:bg-[var(--bg-surface)] transition-colors group">
                                                        <td className="px-6 py-4 font-medium text-[var(--text-primary)]">{log?.seatId?.seatNumber || "N/A"}</td>
                                                        <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{log?.seatId ? "Fixed" : "Random"}</td>
                                                        <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{log?.lockerId.lockerNumber || "N/A"}</td>
                                                        <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{new Date(log?.paymentStartDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</td>
                                                        <td className="px-6 py-4 text-sm text-[var(--text-primary)]">{new Date(log?.paymentEndDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</td>
                                                        <td className="px-6 py-4">
                                                            <span className="inline-flex items-center gap-1.5 bg-[var(--success-bg)] text-[var(--success)] border border-[var(--success)]/20 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                                                                <CheckCircle2 size={12} /> Paid
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile Cards View */}
                                    <div className="md:hidden flex flex-col divide-y divide-[var(--border-muted)]">
                                        {userPayments.map((log) => (
                                            <div key={log.id} className="p-5 flex flex-col gap-3 bg-[var(--bg-card)] hover:bg-[var(--bg-surface)]/50 transition-colors">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="font-semibold text-[var(--text-primary)]">Seat {log.seatNumber}</h3>
                                                    {log.status === 'Paid' ? (
                                                        <span className="inline-flex items-center gap-1.5 bg-[var(--success-bg)] text-[var(--success)] border border-[var(--success)]/20 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                                                            Paid
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 bg-[var(--warning-bg)] text-[var(--warning)] border border-[var(--warning)]/20 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                                                            Expired
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-sm text-[var(--text-secondary)]">
                                                    <div>Type: <span className="text-[var(--text-primary)] font-medium">{log.seatType}</span></div>
                                                    <div>Locker: <span className="text-[var(--text-primary)] font-medium">{log.lockerNumber}</span></div>
                                                    <div className="col-span-2 mt-1 flex justify-between bg-[var(--bg-surface)] p-2.5 rounded-lg border border-[var(--border-muted)]">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Start</span>
                                                            <span className="text-[var(--text-primary)]">{log.startDate}</span>
                                                        </div>
                                                        <div className="flex flex-col text-right">
                                                            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">End</span>
                                                            <span className="text-[var(--text-primary)]">{log.endDate}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* TAB CONTENT: ATTENDANCE LOGS */}
                            {activeTab === 'attendance' && (
                                <div className="flex-1 flex flex-col">

                                    {/* Attendance Controls */}
                                    <div className="p-5 border-b border-[var(--border-muted)] flex justify-between items-center bg-[var(--bg-card)]">
                                        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Attendance Records</h3>
                                        {/* Date Selector */}
                                        <div className="relative flex items-center gap-2.5 bg-[var(--bg-surface)] border border-[var(--border-muted)] rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 ring-[var(--accent-primary)]/40 transition-all group overflow-hidden cursor-pointer hover:border-[var(--border-focus)]">
                                            <Calendar size={14} className="text-[var(--text-secondary)] group-focus-within:text-[var(--accent-primary)] transition-colors" />
                                            <span className="font-semibold text-xs tracking-wide text-[var(--text-primary)]">{attendanceDate}</span>
                                            <input
                                                type="date"
                                                value={attendanceDate.split("-").reverse().join("-")}
                                                onChange={(e) => handleAttendanceDateChange(e)}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer[color-scheme:dark]"
                                            />
                                        </div>
                                    </div>

                                    {/* Desktop Table View */}
                                    <div className="hidden md:block overflow-x-auto custom-scrollbar flex-1">
                                        <table className="w-full text-left border-collapse whitespace-nowrap">
                                            <thead className="bg-[var(--bg-surface)]/50 sticky top-0 z-10 backdrop-blur-sm">
                                                <tr className="border-b border-[var(--border-muted)] text-[var(--text-secondary)] text-xs uppercase tracking-wider font-semibold">
                                    
                                                    <th className="px-6 py-4">Seat Type</th>
                                                    <th className="px-6 py-4">Seat Number</th>
                                                    <th className="px-6 py-4">Check-In Time</th>
                                                    <th className="px-6 py-4">Check-Out Time</th>
                                                    <th className="px-6 py-4">{isToday ? 'Status' : 'Time Spent'}</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[var(--border-muted)]">
                                                {userAttendance.length > 0 ? (
                                                    userAttendance.map((log) => (
                                                        <tr key={log.id} className="hover:bg-[var(--bg-surface)] transition-colors group">
                                                            
                                                            <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{log?.userId?.seatType}</td>
                                                            <td className="px-6 py-4 text-sm text-[var(--text-primary)] font-medium">{log?.seatNumber}</td>
                                                            <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{formatTime(log?.checkInTime)}</td>
                                                            <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{formatTime(log?.checkOutTime)}</td>
                                                            <td className="px-6 py-4">
                                                                {isToday ? (
                                                                    log.checkOut ? (
                                                                        <span className="inline-flex items-center gap-1.5 bg-[var(--warning-bg)] text-[var(--warning)] border border-[var(--warning)]/20 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                                                            <LogOut size={12} /> Checked Out
                                                                        </span>
                                                                    ) : (
                                                                        <span className="inline-flex items-center gap-1.5 bg-[var(--success-bg)] text-[var(--success)] border border-[var(--success)]/20 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                                                            <CheckCircle2 size={12} /> Present
                                                                        </span>
                                                                    )
                                                                ) : (
                                                                    <span className="flex items-center gap-1.5 text-sm font-bold text-[var(--accent-primary)] bg-[var(--accent-transparent)] px-2.5 py-1 rounded-md w-max">
                                                                        <Clock size={14} /> {calculateTimeSpent(log?.checkInTime, log?.checkOutTime)}
                                                                    </span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="6" className="px-6 py-12 text-center text-[var(--text-secondary)] text-sm">
                                                            No attendance records found for this date.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile Cards View */}
                                    <div className="md:hidden flex flex-col divide-y divide-[var(--border-muted)] flex-1 overflow-y-auto">
                                        {userAttendance.length > 0 ? (
                                            userAttendance.map((log) => (
                                                <div key={log.id} className="p-5 flex flex-col gap-3 bg-[var(--bg-card)] hover:bg-[var(--bg-surface)]/50 transition-colors">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="font-semibold text-[var(--text-primary)]">{log.name}</h3>
                                                        {isToday ? (
                                                            log.checkOut ? (
                                                                <span className="inline-flex items-center gap-1 bg-[var(--warning-bg)] text-[var(--warning)] border border-[var(--warning)]/20 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                                                                    Checked Out
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 bg-[var(--success-bg)] text-[var(--success)] border border-[var(--success)]/20 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                                                                    Present
                                                                </span>
                                                            )
                                                        ) : (
                                                            <span className="text-xs font-bold text-[var(--accent-primary)] bg-[var(--accent-transparent)] px-2 py-1 rounded-md">
                                                                {calculateTimeSpent(log.checkIn, log.checkOut)}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mb-1">
                                                        <span className="bg-[var(--bg-surface)] border border-[var(--border-muted)] px-2 py-0.5 rounded">{log.seatType}</span>
                                                        <span>Seat {log.seatNumber}</span>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2 bg-[var(--bg-surface)]/50 p-3 rounded-lg border border-[var(--border-muted)]">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Check-In</span>
                                                            <span className="text-sm text-[var(--text-primary)] font-medium">{formatTime(log.checkIn)}</span>
                                                        </div>
                                                        <div className="flex flex-col text-right">
                                                            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Check-Out</span>
                                                            <span className="text-sm text-[var(--text-primary)] font-medium">{formatTime(log.checkOut)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-10 text-center text-[var(--text-secondary)] text-sm">
                                                No attendance records found for {attendanceDate}.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}

// --- PROFILE FIELD COMPONENT ---
function ProfileField({ icon, label, value, highlight = false, isMultiLine = false }) {
    return (
        <div className="flex items-start justify-between group">
            <div className="flex items-center gap-2.5 text-[var(--text-secondary)] w-1/3 shrink-0 mt-0.5">
                <span className="text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors">
                    {React.cloneElement(icon, { size: 16 })}
                </span>
                <span className="text-sm font-medium">{label}</span>
            </div>
            <div className={`text-sm w-2/3 text-right ${isMultiLine ? 'leading-relaxed text-[var(--text-secondary)]' : 'truncate font-medium text-[var(--text-primary)]'}`}>
                {highlight ? (
                    <span className="bg-[var(--bg-surface)] border border-[var(--border-muted)] text-[var(--text-primary)] px-2.5 py-1 rounded-lg">
                        {value}
                    </span>
                ) : (
                    value
                )}
            </div>
        </div>
    );
}