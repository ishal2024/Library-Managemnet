import userAttendanceModel from "../../Models/userAttendance.model.js"
import calculateTimeSpent from "../../Services/Time/calculateTimeSpent.service.js"


async function getCheckOutInfo(req, res) {
    try {
        const { userId } = req?.params

        const attendanceExist = await userAttendanceModel.findOne({
            userId,
            attendanceDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
        })

        if (!attendanceExist)
            return res.status(400).json({
                status: false, message: "Not Checkin",
                description: "You are not did any checkin today , please checkin first"
            })


        const totalTimeSpent = calculateTimeSpent(attendanceExist?.checkInTime)
        const formattedCheckinTime = attendanceExist?.checkInTime?.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

        return res.status(200).json({
            status: true, data: {
                attendance : attendanceExist,
                totalTimeSpent,
                formattedCheckinTime
            },
            message: `Check Out Information`,
            description: `Checkout information for ${attendanceExist?.attendanceDate}`
        })

    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error", description: error?.message })
    }
}

export default getCheckOutInfo