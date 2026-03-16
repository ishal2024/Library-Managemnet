import React, { useEffect, useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  User,
  Sliders,
} from 'lucide-react';
import AddMemberModal from './Forms/AddMember';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmActionModal from './Constant/ConfirmActionModal';
import { removeUser } from '../axios/usersApi';
import { refreshUsersData } from '../store/usersSlicer';


// Helper to get initials for avatar
const getInitials = (name) => {
  const parts = name.split(' ');
  return parts.length > 1
    ? parts[0][0] + parts[1][0]
    : parts[0][0];
};

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  // const [statusFilter, setStatusFilter] = useState(null)
  // const [seatFilter, setSeatFilter] = useState(null)
  const [isAddMemberFormOpen, setAddMemberFormOpen] = useState({ status: false, mode: "add", user: {} })
  const { allUsers } = useSelector((state) => state.users)
  const dispatch = useDispatch()

  const [confirmActionModal, setConfirmActionModal] = useState({status : false , userId : null})

  const [filteredMembers, setFilteredMembers] = useState(allUsers)

  function handleSearchChange(searchQuery) {
    setSearchQuery(searchQuery)
    const matches = allUsers.filter((user) => user?.user?.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    setFilteredMembers(matches)
  }

  function handleStatusFilterChange(status) {
    if (status == 'all') {
      handleSearchChange(searchQuery)
      return
    }


    const firstFilter = allUsers.filter((user) => user?.user?.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    const matches = firstFilter.filter((user) => user?.status == status)
    setFilteredMembers(matches)

  }

  function handleSeatFilterChange(seatType) {
    if (seatType == 'all') {
      handleSearchChange(searchQuery)
      return
    }

    const firstFilter = allUsers.filter((user) => user?.user?.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    const matches = firstFilter.filter((user) => user?.user?.seatType == seatType)
    setFilteredMembers(matches)
  }

  function handleJoinedFilterChange(value) {
    if (value == 'Newest') {
      setFilteredMembers((prev) => [...prev].sort((a, b) => new Date(b?.user?.createdAt) - new Date(a?.user?.createdAt)))
    }
    else {
      setFilteredMembers((prev) => [...prev].sort((a, b) => new Date(a?.user?.createdAt) - new Date(b?.user?.createdAt)))
    }
  }

  async function handleRemoveUser(userId){
      try {
        if(!userId)
          return

        const res = await removeUser(userId)
        if(res?.data?.status){
          alert("User is deleted ")
          dispatch(refreshUsersData())
        }

      } catch (error) {
        alert(error?.response?.data)
      }
  }

  useEffect(() => {
    setFilteredMembers(allUsers)
  }, [allUsers])

  console.log(filteredMembers)

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-300 font-sans selection:bg-blue-500/30 p-4 md:p-6 lg:p-8">
      <div className="max-w-[1400px] mx-auto">

        {isAddMemberFormOpen.status && <AddMemberModal
          onClose={() => setAddMemberFormOpen({ status: false, mode: "add", user: {} })}
          isOpen={isAddMemberFormOpen.status}
          mode={isAddMemberFormOpen.mode}
          user={isAddMemberFormOpen.user}
        />}

        {confirmActionModal?.status &&
          <ConfirmActionModal
            title={"Remove User"}
            onConfirm={() => handleRemoveUser(confirmActionModal?.userId)}
            onCancel={() => setConfirmActionModal({status : false , userId : null})}
            open={confirmActionModal?.status}
          />}

        {/* 1️⃣ TOP SECTION */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">User Management</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your library members and bookings.</p>
          </div>

          <button
            onClick={() => setAddMemberFormOpen({ status: true, mode: "add", user: {} })}
            className="flex items-center justify-center gap-2 w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-2.5 rounded-lg font-medium shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transition-all duration-300 transform hover:-translate-y-0.5">
            <Plus size={18} />
            <span>New Booking</span>
          </button>
        </div>

        {/* 2️⃣ SEARCH + FILTERS SECTION */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search Input */}
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by name, phone, or email..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-[#1a1d24] border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 sm:w-48">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                <Filter size={16} />
              </div>
              <select
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="w-full bg-[#1a1d24] border border-slate-800 rounded-xl pl-9 pr-4 py-3 text-slate-300 appearance-none focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer">
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Checkout">Checkout</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="relative flex-1 sm:w-48">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                <Filter size={16} />
              </div>
              <select
                onChange={(e) => handleSeatFilterChange(e.target.value)}
                className="w-full bg-[#1a1d24] border border-slate-800 rounded-xl pl-9 pr-4 py-3 text-slate-300 appearance-none focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer">
                <option value="all">All Seats</option>
                <option value="Fixed">Fixed Seats</option>
                <option value="Random">Random Seats</option>
              </select>
            </div>

            <div className="relative flex-1 sm:w-48">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                <Calendar size={16} />
              </div>
              <select
                onChange={(e) => handleJoinedFilterChange(e.target.value)}
                className="w-full bg-[#1a1d24] border border-slate-800 rounded-xl pl-9 pr-4 py-3 text-slate-300 appearance-none focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer">
                <option value="Oldest">Oldest First</option>
                <option value="Newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3️⃣ USERS LIST SECTION (Responsive Grid/Table) */}
        <div className="bg-[#1a1d24] border border-slate-800 rounded-xl shadow-lg shadow-black/20 overflow-hidden">

          {/* Desktop Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-slate-800 bg-[#15181e]/80 text-slate-400 font-medium text-sm backdrop-blur-sm">
            <div className="col-span-4 pl-2">User Details</div>
            <div className="col-span-3">Contact Info</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Joined Date</div>
            <div className="col-span-1 text-right pr-2">Actions</div>
          </div>

          {/* Users List Body */}
          <div className="flex flex-col divide-y divide-slate-800/50">
            {filteredMembers.map((user) => (
              <div
                key={user?.user?._id}
                className="flex flex-col md:grid md:grid-cols-12 gap-4 md:gap-4 p-5 md:p-4 md:items-center hover:bg-slate-800/30 transition-colors group"
              >

                {/* Name & Avatar (Row 1 on Mobile, Col 1 on Desktop) */}
                <div className="col-span-4 flex items-center justify-between md:justify-start gap-4">
                  <div className="flex items-center gap-3 pl-0 md:pl-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border border-white/5 ${user.avatarColor}`}>
                      {getInitials(user?.user?.name)}
                    </div>
                    <div>
                      <h3 className="text-slate-100 font-medium text-base">{user?.user?.name}</h3>
                      <span className="text-slate-500 text-xs hidden md:block">#{user?.user?.seatType}</span>
                    </div>
                  </div>
                  {/* Mobile only Status Badge placed top right */}
                  <div className="block md:hidden">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium border inline-flex items-center gap-1.5
                      ${user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        user.status === 'Inactive' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                          'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${user?.status === 'Active' ? 'bg-emerald-400' : user.status === 'Inactive' ? 'bg-rose-400' : 'bg-amber-400'}`}></span>
                      {user?.status}
                    </span>
                  </div>
                </div>

                {/* Contact Info (Row 2 on Mobile, Col 2 on Desktop) */}
                <div className="col-span-3 flex flex-col gap-1.5 mt-2 md:mt-0">
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <Phone size={14} className="text-slate-500 md:hidden" />
                    {user?.user?.phone}
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-sm truncate">
                    <Mail size={14} className="text-slate-600 md:hidden" />
                    {user?.user?.email}
                  </div>
                </div>

                {/* Status (Hidden on Mobile as it's moved to top right, Col 3 on Desktop) */}
                <div className="col-span-2 hidden md:flex items-center">
                  <span className={`px-2.5 py-1.5 rounded-md text-xs font-medium border inline-flex items-center gap-1.5
                    ${user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      user.status === 'Inactive' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${user?.status === 'Active' ? 'bg-emerald-400' : user?.status === 'Inactive' ? 'bg-rose-400' : 'bg-amber-400'}`}></span>
                    {user?.status}
                  </span>
                </div>

                {/* Joined Date (Row 3 on Mobile, Col 4 on Desktop) */}
                <div className="col-span-2 flex items-center gap-2 mt-2 md:mt-0 text-slate-400 text-sm">
                  <span className="md:hidden text-slate-500">Joined:</span>
                  {new Date(user?.user?.createdAt).toLocaleDateString('en-GB').replace(/\//g, '-')}
                </div>

                {/* Actions (Row 4 on Mobile, Col 5 on Desktop) */}
                <div className="col-span-1 flex items-center justify-end gap-2 mt-4 md:mt-0 pt-4 md:pt-0 border-t border-slate-800/50 md:border-none pr-0 md:pr-2">
                  <button
                    onClick={() => setAddMemberFormOpen({ status: true, mode: "edit", user: user?.user })}
                    className="flex-1 md:flex-none flex items-center justify-center p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors border border-transparent hover:border-blue-500/20" title="Edit User">
                    <Edit2 size={16} />
                    <span className="md:hidden ml-2 text-sm font-medium">Edit</span>
                  </button>
                  <button 
                  onClick={() => setConfirmActionModal({status : true , userId : user?.user?._id})}
                  className="flex-1 md:flex-none flex items-center justify-center p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors border border-transparent hover:border-rose-500/20" title="Delete User">
                    <Trash2 size={16} />
                    <span className="md:hidden ml-2 text-sm font-medium">Delete</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* 4️⃣ PAGINATION SECTION */}
        <div className="flex items-center justify-between sm:justify-center mt-8 gap-2 bg-[#1a1d24] sm:bg-transparent p-4 sm:p-0 rounded-xl border sm:border-none border-slate-800">
          <button className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[#1a1d24] border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all sm:mr-4 shadow-sm">
            <ChevronLeft size={16} />
            <span className="hidden sm:inline text-sm font-medium">Prev</span>
          </button>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((page) => (
              <button
                key={page}
                className={`w-9 h-9 rounded-lg border flex items-center justify-center text-sm font-medium transition-all duration-300
                  ${page === 1
                    ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]'
                    : 'bg-[#1a1d24] border-slate-800 text-slate-400 hover:bg-slate-800 hover:border-slate-600 hover:text-slate-200 shadow-sm'
                  }`}
              >
                {page}
              </button>
            ))}
            <span className="text-slate-600 mx-1">...</span>
            <button className="w-9 h-9 rounded-lg border bg-[#1a1d24] border-slate-800 text-slate-400 hover:bg-slate-800 hover:border-slate-600 hover:text-slate-200 shadow-sm flex items-center justify-center text-sm font-medium transition-all">
              12
            </button>
          </div>

          <button className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[#1a1d24] border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all sm:ml-4 shadow-sm">
            <span className="hidden sm:inline text-sm font-medium">Next</span>
            <ChevronRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}