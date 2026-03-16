import express from 'express'
import getAllLockers from '../Controllers/Locker/getAllLocker.controller.js'
import deAllocateUserLocker from '../Controllers/Locker/deallocateLocker.controller.js'

const router = express.Router()


router.get('/' , getAllLockers)

router.post('/delete' , deAllocateUserLocker)

export default router