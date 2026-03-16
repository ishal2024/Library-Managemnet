import React, { useEffect, useState } from 'react';
import {
  LayoutGrid,
  Bookmark,
  CheckCircle,
  Plus,
  User,
  Phone,
  Calendar,
  Edit2,
  Trash2,
} from 'lucide-react';
import { deAllocateUserSeat, getAllSeats } from '../../../axios/seatsApi';
import { addAllSeatsData } from '../../../store/seatSlicer';
import { useDispatch, useSelector } from 'react-redux';
import AssignSeatForm from './AssignSeatForm';
import AssignedSeatModal from './AssignedSeatModal';
import ConfirmActionModal from '../../Constant/ConfirmActionModal';
import { refreshUsersData } from '../../../store/usersSlicer';
import MatrixPageSkeleton from '../../Loaders/Skeletons/MatrixPageSkeleton';



export default function SeatManagementPage() {

  const dispatch = useDispatch()
  const { allSeatsData } = useSelector((state) => state.seat)

  const [isAssignSeatFormOpen, setAssignSeatFormOpen] = useState(false)
  const [selectedSeatNumber, setSelectedSeatNumber] = useState(null)
  const [isSkeletonOpen, setSkeletonOpen] = useState(false)

  const [assignedSeatModal, setAssignedSeatModal] = useState({ status: false, seat: {} })
  const [confirmActionModal, setConfirmActionModal] = useState({status : false , data : {}})
  const [confirmActionSpinnerOpen , setConfirmActionSpinnerOpen] = useState(false)

  async function initializeAllSeatsData() {
    try {
      setSkeletonOpen(true)
      const res = await getAllSeats()
      if (res?.data?.status) {
        dispatch(addAllSeatsData(res?.data?.data))
        setSkeletonOpen(false)
        console.log(res?.data?.data)
      }

    } catch (error) {
      setSkeletonOpen(false)
      console.log(error)
    }
  }

  async function handleSeatDeAllocation(data) {
    try {
      setConfirmActionSpinnerOpen(true)
      const res = await deAllocateUserSeat(data)
      if (res?.data?.status) {
        initializeAllSeatsData()
        setConfirmActionModal({status : false , data : {}})
        dispatch(refreshUsersData())
        setConfirmActionSpinnerOpen(false)
      }
    } catch (error) {
      setConfirmActionSpinnerOpen(false)
      console.log(error?.response?.data)
    }
  }

  useEffect(() => {
    if (allSeatsData?.seats?.length == 0)
      initializeAllSeatsData()
  }, [])

  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-300 font-sans p-4 md:p-6 lg:p-8 selection:bg-blue-500/30">
      {!isSkeletonOpen ? <div className="max-w-[1400px] mx-auto">

        {isAssignSeatFormOpen &&
          <AssignSeatForm
            isOpen={isAssignSeatFormOpen}
            onClose={() => {
              setAssignSeatFormOpen(false)
              setSelectedSeatNumber(null)
            }}
            seatNumber={selectedSeatNumber}
          />}

        {assignedSeatModal.status && <AssignedSeatModal
          isOpen={assignedSeatModal.status}
          onClose={() => setAssignedSeatModal({ status: false, seat: {} })}
          seatData={assignedSeatModal.seat}
        />}

        {confirmActionModal?.status &&
          <ConfirmActionModal
             title = {"Deallocate Seat"}
             onConfirm={() => handleSeatDeAllocation(confirmActionModal?.data)}
             onCancel={() => setConfirmActionModal({status : false , data : {}})}
             open={confirmActionModal?.status}
             spinnerOpen={confirmActionSpinnerOpen}
          />}

        {/* 1️⃣ PAGE HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
            Seat Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Assign and manage seats for members.
          </p>
        </div>

        {/* 2️⃣ SEAT SUMMARY SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">

          {/* Total Seats Card */}
          <div className="bg-[#1a1d24] border border-slate-800 p-6 rounded-xl relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-purple-500/10 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-colors"></div>
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">Total Seats</p>
                <h3 className="text-3xl font-bold text-slate-100">{allSeatsData?.totalSeats}</h3>
              </div>
              <div className="p-3 bg-[#15181e] rounded-lg border border-slate-800 text-purple-500 group-hover:scale-110 transition-transform duration-300">
                <LayoutGrid size={24} />
              </div>
            </div>
          </div>

          {/* Fixed Seats Card */}
          <div className="bg-[#1a1d24] border border-slate-800 p-6 rounded-xl relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-blue-500/10 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">Fixed Seats</p>
                <h3 className="text-3xl font-bold text-slate-100">{allSeatsData?.occupiedSeats}</h3>
              </div>
              <div className="p-3 bg-[#15181e] rounded-lg border border-slate-800 text-blue-500 group-hover:scale-110 transition-transform duration-300">
                <Bookmark size={24} />
              </div>
            </div>
          </div>

          {/* Available Seats Card */}
          <div className="bg-[#1a1d24] border border-slate-800 p-6 rounded-xl relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-emerald-500/10 hover:-translate-y-1 md:col-span-2 lg:col-span-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors"></div>
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">Available Seats</p>
                <h3 className="text-3xl font-bold text-slate-100">{allSeatsData?.unOccupiedSeats}</h3>
              </div>
              <div className="p-3 bg-[#15181e] rounded-lg border border-slate-800 text-emerald-500 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle size={24} />
              </div>
            </div>
          </div>

        </div>

        {/* 3️⃣ WRAPPED SEAT GRID SECTION */}
        <div className="bg-[#15181e] border border-slate-700/50 rounded-2xl p-6 lg:p-8 shadow-xl shadow-black/30">

          {/* Container Header */}
          <div className="mb-6 border-b border-slate-800/80 pb-4">
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">All Seats</h2>
            <p className="text-sm text-slate-500 mt-1">View and manage seat assignments</p>
          </div>

          {/* Compact Grid Layout (6 per row on Desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {allSeatsData?.seats?.map((seat) => (
              <div
                key={seat.id}
                className={`flex flex-col rounded-xl p-3 transition-all duration-300 min-h-[160px] shadow-md shadow-black/20 group hover:-translate-y-1
                  ${seat.status === 'Available'
                    ? 'bg-[#1a1d24] border border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                    : seat.status === 'Occupied'
                      ? 'bg-[#121419] border border-blue-500/20 hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                      : 'bg-[#121419] border border-rose-500/20 hover:border-rose-500/50 hover:shadow-[0_0_15px_rgba(244,63,94,0.1)]'
                  }`}
              >

                {/* Card Top: Number & Status */}
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
                    #{seat?.seatNumber}
                    {seat.status === 'fixed' && (
                      <span className="bg-blue-500/20 text-blue-400 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                        Fixed
                      </span>
                    )}
                  </h2>
                  <div className="flex items-center gap-1.5 bg-[#0f1115] px-2 py-0.5 rounded-full border border-slate-700/60 shrink-0">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${seat.status === 'Available'
                        ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                        : seat.status === 'Occupied'
                          ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]'
                          : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                        }`}
                    ></span>
                    <span className="text-[10px] font-medium text-slate-400 capitalize">
                      {seat.status === 'Available' ? 'Available' : seat.status}
                    </span>
                  </div>
                </div>

                {/* Card Middle & Bottom */}
                {seat.status === 'Available' ? (
                  // AVAILABLE STATE
                  <div className="flex-1 flex flex-col items-center justify-center py-1">
                    <button
                      onClick={() => {
                        setAssignSeatFormOpen(true)
                        setSelectedSeatNumber(seat?.seatNumber)
                      }}
                      className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all duration-300 mb-2 border border-emerald-500/20 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transform hover:scale-105"
                      title="Assign Seat"
                    >
                      <Plus size={20} />
                    </button>
                    <span className="text-xs font-medium text-emerald-500/80 group-hover:text-emerald-400 transition-colors">
                      Assign Seat
                    </span>
                  </div>
                ) : (
                  <>


                    <div className="flex-1 flex flex-col justify-between">


                      {/* Compact Member Details */}
                      <div onClick={() => setAssignedSeatModal({ status: true, seat: seat })} className="flex flex-col gap-1.5 mt-1 overflow-hidden">
                        <div className="flex items-center gap-2 text-slate-200">
                          <User size={12} className="text-slate-500 shrink-0" />
                          <span className="font-semibold text-[11px] truncate">
                            {seat?.userDetail?.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <Phone size={12} className="text-slate-500 shrink-0" />
                          <span className="text-[11px] truncate">{seat?.userDetail?.contact}</span>
                        </div>

                      </div>

                      {/* Compact Action Buttons */}
                      <div className="flex items-center justify-end gap-1.5 pt-3 mt-3 border-t border-slate-800/60">
                        <button

                          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-md transition-all duration-200 border border-transparent hover:border-blue-500/20"
                          title="Edit Assignment"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setConfirmActionModal({status : true , data : {user : seat?.userDetail , seatId : seat?.seat?._id}})}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-all duration-200 border border-transparent hover:border-rose-500/20"
                          title="Remove Assignment"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

        </div>
      </div> : <MatrixPageSkeleton />}
    </div>
  );
}