import userAttendanceModel from "../../Models/userAttendance.model.js"


async function getUserAttendanceAtSpecificDate(req, res) {
    try {
        const { userId, date } = req?.body

        if (!userId || !date) {
            return res.status(400).json({ status: false, message: "Invalid Data", description: "Please provide userId and date" })
        }

        const attendance = await userAttendanceModel.find({
            userId: userId,
            attendanceDate: date
        }).populate("userId")

        return res.status(200).json({
            status: true, attendance , message: ``,
            description: ``
        })

    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error", description: error?.message })
    }
}

export default getUserAttendanceAtSpecificDate