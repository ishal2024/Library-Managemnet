import userAttendanceModel from "../../Models/userAttendance.model.js"
import userModel from '../../Models/user.model.js'


async function getLibraryLiveStatus(req, res) {
    try {

        const attendanceData = await userAttendanceModel
            .find({
                attendanceDate: new Date().toLocaleDateString('en-GB').replace(/\//g, '-')
            })
            .populate({
                path: 'userId',
                populate: [
                    { path: 'seatId' },
                    { path: 'lockerId' }
                ]
            })

        const fixedSeatUsers = await userModel.find({
            seatType: "Fixed"
        }).populate('seatId').populate('lockerId')

        let data = []
        let activeStudents = 0
        let availableSeats = 0

        for (let i = 1; i <= 42; i++) {
            const attendance = attendanceData.find((s) => s.seatNumber == i)
            if (attendance && !attendance?.checkOutTime) {
                data.push({
                    seatNumber: i,
                    status: "Occupied",
                    seatType: attendance?.userId?.seatType == "Fixed" ? "Fixed" : "Random",
                    userDetail: attendance?.userId,
                    checkinTime: new Date(attendance?.checkInTime)?.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
                })
                activeStudents++
            }
            else if (attendance && attendance?.checkOutTime) {
                data.push({
                    seatNumber: i,
                    status: "Available",
                    seatType: attendance?.userId?.seatType == "Fixed" ? "Fixed" : "Random",
                    userDetail: attendance?.userId,
                    checkinTime: new Date(attendance?.checkInTime)?.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
                    checkoutTime : new Date(attendance?.checkOutTime)?.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
                })
            }
            else {
                const fixedSeatUser = fixedSeatUsers.find((s) => s?.seatId?.seatNumber == i)
                if (fixedSeatUser) {
                    data.push({
                        seatNumber: i,
                        status: "Available",
                        seatType: "Fixed",
                        userDetail: fixedSeatUser,
                    })
                }
                else {
                    data.push({
                        seatNumber: i,
                        status: "Available",
                        seatType: "Random"
                    })
                }
                availableSeats++
            }
        }

        return res.status(200).json({
            status: true, data: {
                seats: data,
                activeStudents,
                availableSeats,
                fixedSeats: fixedSeatUsers.length
            },
            message: `Check Out Information`,
            description: `Checkout information for `
        })


    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error", description: error?.message })
    }
}

export default getLibraryLiveStatus