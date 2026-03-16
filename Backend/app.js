import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './Config/db.config.js'
import cors from 'cors'

//config
dotenv.config()
connectDB()

const app = express()

// Global Middlewares 
app.use(express.json())
app.use(express.urlencoded())


// CORS 
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

import userRouter from './Routes/user.router.js'
import seatRouter from './Routes/seats.router.js'
import lockerRouter from './Routes/locker.router.js'
import attendanceRouter from './Routes/attendance.router.js'
import paymentRouter from './Routes/payments.router.js'
import dashboardRouter from './Routes/dashboard.router.js'

app.use('/api/user' , userRouter)
app.use('/api/seats' , seatRouter)
app.use('/api/locker' , lockerRouter)
app.use('/api/attendance' , attendanceRouter)
app.use('/api/payment' , paymentRouter)
app.use('/api/dashboard' , dashboardRouter)

app.get('/' , (req,res) => {
    res.send("Hello world")
})

app.listen(process.env.PORT , () => {
    console.log("Server is listening")
})