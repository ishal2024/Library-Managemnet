import express from 'express'
import getAdminDashboardData from '../Controllers/Dashboard/dashboard.controller.js'
import getPaymentOfSpecificDate from '../Controllers/Dashboard/paymentLog.controller.js'

const router = express.Router()


router.get('/' , getAdminDashboardData)

router.post('/payment/' , getPaymentOfSpecificDate)


export default router