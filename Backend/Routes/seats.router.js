import express from 'express'
import getAllSeats from '../Controllers/Seat/getAllSeat.controller.js'
import getLibraryLiveStatus from '../Controllers/Attendance/libraryStatus.controller.js'
import deAllocateUserSeat from '../Controllers/Seat/deallocateSeat.controller.js'

const router = express.Router()


router.get('/' , getAllSeats)

router.get('/seat-matrix/live' , getLibraryLiveStatus)

router.post('/seat/delete' , deAllocateUserSeat)

export default router