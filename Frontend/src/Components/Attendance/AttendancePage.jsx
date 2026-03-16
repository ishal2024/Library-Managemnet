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
import CheckInForm from './CheckInForm';
import CheckOutForm from './CheckOutForm';
import { getAllUser } from '../../axios/usersApi';



export default function AttendanceManagementPage() {

    const [users , setUsers] = useState([])

    async function initializeAllUsers(){
        try {
            const res = await getAllUser()
            if(res?.data?.status){
              console.log(res?.data?.data)
                setUsers(res?.data?.data)
            }
        } catch (error) {
            console.log(error?.message)
        }
    }

    useEffect(() => {
        initializeAllUsers()
    }, [])

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-300 font-sans p-4 md:p-6 lg:p-8 selection:bg-blue-500/30">
      
      {/* Global CSS for animations and scrollbars */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
        
        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down {
          animation: slideDown 0.2s ease-out forwards;
        }
      `}</style>

      <div className="max-w-[1400px] mx-auto">
        
        {/* PAGE HEADER */}
        <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight flex items-center gap-3">
              <Clock className="text-blue-500 hidden sm:block" size={28} />
              Attendance Management
            </h1>
            <p className="text-sm text-slate-500 mt-1.5 sm:ml-10">
              Manage member check-in and check-out tracking.
            </p>
          </div>
          <div className="bg-[#15181e] border border-slate-800 rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm text-sm font-medium text-slate-300">
            <Clock size={16} className="text-slate-500" />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </div>
        </div>

        {/* MAIN LAYOUT (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          <CheckInForm users = {users} />
          <CheckOutForm users = {users} />
        </div>

      </div>
    </div>
  );
}