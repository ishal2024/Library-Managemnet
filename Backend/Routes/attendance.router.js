import express from 'express'
import getCheckOutInfo from '../Controllers/Attendance/checkoutInfo.controller.js'
import getAttendanceLogOfAnyParticularDay from '../Controllers/Attendance/attendanceLogAnyDay.controller.js'
import getUserAttendanceAtSpecificDate from '../Controllers/Attendance/userAttendance.controller.js'

const router = express.Router()

router.get('/info/checkout/:userId' , getCheckOutInfo)

router.post('/daily' , getAttendanceLogOfAnyParticularDay)

router.post('/user' ,getUserAttendanceAtSpecificDate)

export default router