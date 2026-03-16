import userModel from '../../Models/user.model.js'
import userAttendanceModel from '../../Models/userAttendance.model.js'

async function getAllUsersWithStatus(req, res) {
    try {
        const data = []

        const users = await userModel.find({}).populate('seatId').populate('lockerId').populate('paymentId')
        const attendance = await userAttendanceModel.find({
            attendanceDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-')
        })

        users.map((user) => {
            const userAttendance = attendance.find((s) => s?.userId?.toString() === user?._id?.toString())
            if (userAttendance) {
                if (userAttendance?.checkOutTime == null) {
                    data.push({
                        user,
                        userAttendance,
                        status: "Active"
                    })
                }
                else {
                    data.push({
                        user,
                        userAttendance,
                        status: "Checkout"
                    })
                }
            }
            else {
                data.push({
                    user,
                    status: "Inactive"
                })
            }
        })


        return res.status(200).json({status: true, data: data})


    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error", description: error?.message })
    }
}

export default getAllUsersWithStatus