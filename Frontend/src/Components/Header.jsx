import React from 'react';
import {
  Library,
  Bell,
  User,
  Menu,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

function Header() {

    const navLinks =[
  {name : 'Dashboard' , path : '/'},
  {name: 'Live Seats' , path : '/seat-matrix'},
  {name : 'Locker Matrix' , path : '/locker'},
  {name : 'Seat Matrix' , path : '/seat'},
  {name : 'Users' , path : '/users'},
  {name : 'Bookings' , path : '/payment'},
  {name : 'Attendance' , path : '/daily-attendance'},
];

  return (
    <header className="sticky top-0 z-50 bg-[#15181e]/90 backdrop-blur-md border-b border-slate-800 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          
          {/* Left: Logo & Name */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
              <Library size={24} className="text-blue-500" />
            </div>
            <span className="text-slate-100 font-bold text-xl tracking-tight hidden sm:block">
              LibManage
            </span>
          </div>

          {/* Center: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link, idx) => (
              <NavLink
                key={idx}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                  ${idx === 0 
                    ? 'bg-slate-800/50 text-blue-400' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/30'
                  }`}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-slate-400 hover:text-slate-100 transition">
              <Menu size={24} />
            </button>
            <div className="hidden sm:flex items-center gap-4 border-l border-slate-800 pl-4">
              <button className="relative p-2 text-slate-400 hover:text-slate-100 transition-colors rounded-full hover:bg-slate-800">
                <Bell size={20} />
                <span className="absolute top-1 right-1.5 w-2 h-2 bg-blue-500 rounded-full border border-[#15181e]"></span>
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-100 transition-colors rounded-full hover:bg-slate-800 bg-slate-800/50">
                <User size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>
  )
}

export default Header