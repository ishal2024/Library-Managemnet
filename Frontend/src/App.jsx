import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LibraryDashboard from './Components/Dashboard'
import UsersPage from './Components/UsersPage'
import Header from './Components/Header'
import { Outlet, useSearchParams } from 'react-router-dom'
import { getAllUser } from './axios/usersApi'
import { useDispatch, useSelector } from 'react-redux'
import { addAllUsersData } from './store/usersSlicer'

function App() {
  
  const {allUsers , status} = useSelector((state) => state?.users)
  const dispatch = useDispatch()

  async function initailizeAllUsers(){
    try {
      const res = await getAllUser()
      if(res?.data?.status){
         dispatch(addAllUsersData(res?.data?.data))
      }
    } catch (error) {
      console.log(error)
    }
  }

  console.log(allUsers)

  useEffect(() => {
    if(allUsers.length == 0)
    initailizeAllUsers()
  } , [status])

  return (
    <>
      <div className="min-h-screen bg-[#0f1115] text-slate-300 font-sans selection:bg-blue-500/30">
      {/* Global Scrollbar Styles inserted for minimal scrollbar design */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
      `}</style>
      <Header />
      <Outlet />
      </div>
    </>
  )
}

export default App
