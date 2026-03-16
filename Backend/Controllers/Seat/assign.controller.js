import userModel from "../../Models/user.model.js"
import userPaymentModel from "../../Models/userPayment.model.js"
import userSeatModel from "../../Models/userSeat.model.js"


async function assignSeatToUser(req, res) {
    try {

        if (req?.body?.seatNumber > 42)
            return res.status(400).json({ status: false, message: "Invalid Seat Number", description: "Invalid Seat Number , Please enter correct seat number" })

        let user = req?.body?.user

        if (!user?._id)
            return res.status(400).json({ status: false, message: "Invalid User", description: "This user is not a member of your library" })

        if (user?.seatType == "Random")
            return res.status(400).json({ status: false, message: "User seat is random", description: "You cannot assign fixed seat to a random user" })

        if (user?.seatId)
            return res.status(400).json({
                status: false, message: "Seat is already assigned",
                description: "A seat is already assigned to user, please deallocate earlier seat first"
            })

        const seatExist = await userSeatModel.findOne({ "seatNumber": req?.body?.seatNumber })
        if (seatExist)
            return res.status(400).json({
                status: false, message: "Seat is Unavailable",
                description: "This seat is already alloted to someone , please choose another seat"
            })


        const assignedSeat = await userSeatModel.create({
            userId: user?._id,
            seatNumber: Number(req?.body?.seatNumber),
            notes: req?.body?.notes,
        })

        user = await userModel.findByIdAndUpdate(
            user?._id,
            {
                seatId: assignedSeat?._id
            },
            { new: true }
        );

        await userPaymentModel.findOneAndUpdate({
            userId: user?._id,
            seatId: null,
            paymentYear: Number(new Date().toISOString().split("T")[0].split("-")[0]),
            paymentMonth: Number(new Date().toISOString().split("T")[0].split("-")[1])
        },
            {
                $set: { seatId: assignedSeat?._id }
            }, { new: true })

        return res.status(200).json({
            status: true, data: {
                user,
                assignedSeat
            }, message: `Seat is successfully assigned`,
            description: `${assignedSeat?.seatNumber} is assigned to ${user?.name}`
        })

    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error", description: error?.message })
    }
}

export default assignSeatToUser