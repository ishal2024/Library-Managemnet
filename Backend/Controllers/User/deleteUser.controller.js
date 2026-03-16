import userModel from '../../Models/user.model.js'
import userAttendanceModel from '../../Models/userAttendance.model.js'
import userLockerModel from '../../Models/userLocker.model.js'
import userSeatModel from '../../Models/userSeat.model.js'


async function removeUser(req, res) {
    try {
        const { userId } = req.params

        const user = await userModel.findByIdAndDelete(userId)

        if (!user) {
            return res.status(400).json({
                status: false,
                message: "user not found",
                description: "This user is not a part of this library"
            })
        }

        const promises = [
            userAttendanceModel.deleteMany({ userId })
        ]

        if (user.seatType === "Fixed" && user?.seatId) {
            promises.push(userSeatModel.findOneAndDelete({ userId }))
        }

        if (user?.lockerId) {
            promises.push(userLockerModel.findOneAndDelete({ userId }))
        }

        await Promise.all(promises)

        return res.status(200).json({
            status: true,
            data: { user },
            message: "User is deleted",
            description: "User is successfully removed from library"
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Internal Server Error",
            description: error?.message
        })
    }
}

export default removeUser