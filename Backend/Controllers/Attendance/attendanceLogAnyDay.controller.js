import userAttendanceModel from "../../Models/userAttendance.model.js"



async function getAttendanceLogOfAnyParticularDay(req, res) {
    try {
        const date = req?.body?.date

        const attendanceLog = await userAttendanceModel.find({
            attendanceDate: date
        }).populate('userId').lean()

        let totalCheckedInUsers = 0
        let totalCheckedOutUsers = 0

        attendanceLog.map((attendance) => {
            if (attendance?.checkInTime)
                totalCheckedInUsers++
            if (attendance?.checkOutTime)
                totalCheckedOutUsers++

        })

        if (date == new Date().toLocaleDateString('en-GB').replace(/\//g, '-')) {
            const data = []
            attendanceLog.map((attendance) => {
                if (attendance?.checkOutTime) {
                    data.push({ ...attendance, status: "Checked Out" })
                }
                else {
                    data.push({ ...attendance, status: "Active" })
                }
            })

            return res.status(200).json({
                status: true, data: {
                    attendance: data,
                    totalPresentStudents: data.length,
                    totalCheckedInUsers,
                    totalCheckedOutUsers
                },
                message: `Check Out Information`,
                description: `Checkout information for `
            })

        }
        else {
            return res.status(200).json({
                status: true, data: {
                    attendance: attendanceLog,
                    totalPresentStudents: attendanceLog.length,
                    totalCheckedInUsers,
                    totalCheckedOutUsers
                },
                message: `Check Out Information`,
                description: `Checkout information for `
            })
        }
    }
    catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error", description: error?.message })
    }
}

export default getAttendanceLogOfAnyParticularDay