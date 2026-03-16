import express from 'express'
import addNewUser from '../Controllers/User/create.controller.js'
import assignSeatToUser from '../Controllers/seat/assign.controller.js'
import assignLockerToUser from '../Controllers/Locker/assign.controller.js'
import createPayment from '../Controllers/Payment/create.controller.js'
import checkIn from '../Controllers/Attendance/checkin.controller.js'
import checkOut from '../Controllers/Attendance/checkout.controller.js'
import getAllUsersWithStatus from '../Controllers/User/getUsers.controller.js'
import getSpecificUserData from '../Controllers/User/userPage.controller.js'
import updateUserData from '../Controllers/User/updateUser.controller.js'
import removeUser from '../Controllers/User/deleteUser.controller.js'


const router = express.Router()

// Get all users data
router.get('/' , getAllUsersWithStatus)

router.get('/:userId' , getSpecificUserData)

// Create a user
router.post('/create' , addNewUser)

// Update a user
router.post('/update/:userId' , updateUserData)

// Remove a user
router.get('/delete/:userId' , removeUser)

// Assign seat to user
router.post('/assign/seat' , assignSeatToUser)

// Assign locker to user
router.post('/assign/locker' , assignLockerToUser)

//Create payment for user
router.post('/create/payment' , createPayment)

//Checkin for library
router.post('/checkin' , checkIn)

//Checkout for library
router.get('/checkout/:userId' , checkOut)

export default router