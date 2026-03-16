import userModel from "../../Models/user.model.js"
import userAttendanceModel from "../../Models/userAttendance.model.js"
import userPaymentModel from "../../Models/userPayment.model.js"


async function getSpecificUserData(req,res) {
    try {
        const { userId } = req?.params

        const user = await userModel.findOne({ "_id": userId }).populate("seatId").populate("lockerId")

        if (!user) {
            return res.status(400).json({ status: false, message: "Invalid User", description: "This user does not exist in library" })
        }

        const [payments, attendance] = await Promise.all([
            userPaymentModel.find({ userId: userId }).populate("seatId").populate("lockerId"),
            userAttendanceModel.find({
                attendanceDate: new Date().toISOString().split("T")[0].split("-").reverse().join("-"),
                userId : userId
            })
        ]);

        return res.status(200).json({
            status: true, data: {
                user,
                payments,
                attendance
            }, message: ``,
            description: ``
        })


    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error", description: error?.message })
    }
}

export default getSpecificUserData