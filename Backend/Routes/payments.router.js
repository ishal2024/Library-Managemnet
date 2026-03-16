import express from 'express'
import getAllUsersWithPaymentStatus from '../Controllers/Payment/paymentPage.controller.js'
import updateUserPayment from '../Controllers/Payment/updatePayment.controller.js'
import deleteUserPaymnet from '../Controllers/Payment/deletePayment.controller.js'

const router = express.Router()

router.post('/' , getAllUsersWithPaymentStatus)

router.post('/update/:paymentId' , updateUserPayment)

router.get('/delete/:paymentId' , deleteUserPaymnet)

export default router