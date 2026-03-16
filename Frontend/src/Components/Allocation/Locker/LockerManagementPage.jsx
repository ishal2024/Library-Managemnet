import React, { useState } from 'react';
import {
  Box,
  Lock,
  Unlock,
  Plus,
  User,
  Phone,
  Calendar,
  Edit2,
  Trash2,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { deAllocateUserLocker, getAllLockers } from '../../../axios/lockerApi';
import { addAllLockerData } from '../../../store/lockerSlicer';
import { useEffect } from 'react';
import AssignLockerForm from './AssignLockerForm';
import AssignedLockerOverviewModal from './AssignedLockerModal';
import ConfirmActionModal from '../../Constant/ConfirmActionModal';
import { refreshUsersData } from '../../../store/usersSlicer';
import MatrixPageSkeleton from '../../Loaders/Skeletons/MatrixPageSkeleton';


export default function LockerManagementPage() {


  const dispatch = useDispatch()
  const { allLockerData } = useSelector((state) => state.locker)

  const [isAssignLockerFormOpen, setAssignLockerFormOpen] = useState(false)
  const [selectedLockerNumber, setSelectedLockerNumber] = useState(null)
  const [isSkeletonOpen, setSkeletonOpen] = useState(false)

  const [assignedLockerModal, setAssignedLockerModal] = useState({ status: false, locker: {} })
  const [confirmActionModal, setConfirmActionModal] = useState({ status: false, data: {} })
  const [confirmActionSpinnerOpen , setConfirmActionSpinnerOpen] = useState(false)

  async function initializeAllLockerData() {
    try {
      setSkeletonOpen(true)
      const res = await getAllLockers()
      if (res?.data?.status) {
        dispatch(addAllLockerData(res?.data?.data))
        setSkeletonOpen(false)
        console.log(res?.data?.data)
      }

    } catch (error) {
      setSkeletonOpen(false)
      console.log(error)
    }
  }

  async function handleLockerDeAllocation(data) {
    try {
      setConfirmActionSpinnerOpen(true)
      const res = await deAllocateUserLocker(data)
      if (res?.data?.status) {
        initializeAllLockerData()
        setConfirmActionModal({ status: false, data: {} })
        dispatch(refreshUsersData())
        setConfirmActionSpinnerOpen(false)
      }
    } catch (error) {
      setConfirmActionSpinnerOpen(false)
      console.log(error?.response?.data)
    }
  }

  useEffect(() => {
    if (allLockerData?.lockers?.length == 0)
      initializeAllLockerData()
  }, [])

  console.log(allLockerData)


  return (
    <div className="min-h-screen bg-[#0f1115] text-slate-300 font-sans p-4 md:p-6 lg:p-8 selection:bg-blue-500/30">
      {!isSkeletonOpen ?  <div className="max-w-[1400px] mx-auto">

        {isAssignLockerFormOpen && <AssignLockerForm
          isOpen={isAssignLockerFormOpen}
          onClose={() => {
            setAssignLockerFormOpen(false)
            setSelectedLockerNumber(null)
          }}
          lockerNumber={selectedLockerNumber}
        />}

        {assignedLockerModal.status && <AssignedLockerOverviewModal
          isOpen={assignedLockerModal.status}
          onClose={() => setAssignedLockerModal({ status: false, locker: {} })}
          lockerData={assignedLockerModal.locker}
        />}

        {confirmActionModal?.status &&
          <ConfirmActionModal
            title={"Deallocate Locker"}
            onConfirm={() => handleLockerDeAllocation(confirmActionModal?.data)}
            onCancel={() => setConfirmActionModal({ status: false, data: {} })}
            open={confirmActionModal?.status}
            spinnerOpen = {confirmActionSpinnerOpen}
          />}

        {/* 1️⃣ PAGE HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-100 tracking-tight">
            Locker Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Assign and manage lockers for library members.
          </p>
        </div>

        {/* 2️⃣ LOCKER SUMMARY SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">

          {/* Total Lockers Card */}
          <div className="bg-[#1a1d24] border border-slate-800 p-6 rounded-xl relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-blue-500/10 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">Total Lockers</p>
                <h3 className="text-3xl font-bold text-slate-100">{allLockerData?.totalLockers}</h3>
              </div>
              <div className="p-3 bg-[#15181e] rounded-lg border border-slate-800 text-blue-500 group-hover:scale-110 transition-transform duration-300">
                <Box size={24} />
              </div>
            </div>
          </div>

          {/* Occupied Lockers Card */}
          <div className="bg-[#1a1d24] border border-slate-800 p-6 rounded-xl relative overflow-hidden group hover:border-rose-500/30 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-rose-500/10 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl group-hover:bg-rose-500/10 transition-colors"></div>
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">Occupied Lockers</p>
                <h3 className="text-3xl font-bold text-slate-100">{allLockerData?.occupiedLockers}</h3>
              </div>
              <div className="p-3 bg-[#15181e] rounded-lg border border-slate-800 text-rose-500 group-hover:scale-110 transition-transform duration-300">
                <Lock size={24} />
              </div>
            </div>
          </div>

          {/* Unoccupied Lockers Card */}
          <div className="bg-[#1a1d24] border border-slate-800 p-6 rounded-xl relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-emerald-500/10 hover:-translate-y-1 md:col-span-2 lg:col-span-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors"></div>
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">Unoccupied Lockers</p>
                <h3 className="text-3xl font-bold text-slate-100">{allLockerData?.unOccupiedLockers}</h3>
              </div>
              <div className="p-3 bg-[#15181e] rounded-lg border border-slate-800 text-emerald-500 group-hover:scale-110 transition-transform duration-300">
                <Unlock size={24} />
              </div>
            </div>
          </div>

        </div>

        {/* 3️⃣ WRAPPED LOCKER GRID SECTION */}
        <div className="bg-[#15181e] border border-slate-700/50 rounded-2xl p-6 lg:p-8 shadow-xl shadow-black/30">

          {/* Container Header */}
          <div className="mb-6 border-b border-slate-800/80 pb-4">
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">All Lockers</h2>
            <p className="text-sm text-slate-500 mt-1">Manage and assign lockers</p>
          </div>

          {/* Compact Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {allLockerData?.lockers.map((locker) => (
              <div
                key={locker?.id}
                className={`flex flex-col rounded-xl p-4 transition-all duration-300 min-h-[160px] shadow-md shadow-black/20 group hover:-translate-y-1
                  ${locker?.status === 'Available'
                    ? 'bg-[#1a1d24] border border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                    : 'bg-[#121419] border border-rose-500/20 hover:border-rose-500/50 hover:shadow-[0_0_15px_rgba(244,63,94,0.1)]'
                  }`}
              >

                {/* Card Top: Number & Status */}
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-bold text-slate-100 tracking-tight">
                    #{locker?.id}
                  </h2>
                  <div className="flex items-center gap-1.5 bg-[#0f1115] px-2 py-0.5 rounded-full border border-slate-700/60">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${locker?.status === 'Available'
                        ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                        : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                        }`}
                    ></span>
                    <span className="text-[11px] font-medium text-slate-400 capitalize">
                      {locker?.status}
                    </span>
                  </div>
                </div>

                {/* Card Middle & Bottom */}
                {locker?.status === 'Available' ? (
                  // AVAILABLE STATE
                  <div className="flex-1 flex flex-col items-center justify-center py-1">
                    <button

                      onClick={() => {
                        setAssignLockerFormOpen(true)
                        setSelectedLockerNumber(locker?.lockerNumber)
                      }}
                      className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all duration-300 mb-2 border border-emerald-500/20 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transform hover:scale-105"
                      title="Assign Locker"
                    >
                      <Plus size={20} />
                    </button>
                    <span className="text-xs font-medium text-emerald-500/80 group-hover:text-emerald-400 transition-colors">
                      Assign Locker
                    </span>
                  </div>
                ) : (
                  // OCCUPIED STATE
                  <div className="flex-1 flex flex-col justify-between">

                    {/* Compact Member Details */}
                    <div onClick={() => setAssignedLockerModal({ status: true, locker: locker })} className="flex flex-col gap-1.5 mt-1">
                      <div className="flex items-center gap-2 text-slate-200">
                        <User size={13} className="text-slate-500 shrink-0" />
                        <span className="font-semibold text-xs truncate">
                          {locker?.userDetail?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Phone size={13} className="text-slate-500 shrink-0" />
                        <span className="text-xs truncate">{locker?.userDetail?.contact}</span>
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
                        onClick={() => setConfirmActionModal({ status: true, data: { user: locker?.userDetail, lockerId: locker?.locker?._id } })}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-all duration-200 border border-transparent hover:border-rose-500/20"
                        title="Remove Assignment"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>: <MatrixPageSkeleton />}
    </div>
  );
}