import userModel from "../../Models/user.model.js"
import userLockerModel from "../../Models/userLocker.model.js"
import userPaymentModel from "../../Models/userPayment.model.js"


async function assignLockerToUser(req, res) {
    try {

        let user = req?.body?.user

        if (!user)
            return res.status(400).json({ status: false, message: "Invalid User", description: "This user is not a member of your library" })

        if (user?.lockerId)
            return res.status(400).json({
                status: false, message: "Locker is already assigned",
                description: "A Locker is already assigned to user, please deallocate earlier locker first"
            })

        const lockerExist = await userLockerModel.findOne({ lockerNumber: req?.body?.lockerNumber })
        if (lockerExist)
            return res.status(400).json({
                status: false, message: "Locker is already assigned",
                description: "A Locker is already assigned to someone, please deallocate earlier locker first"
            })

        const assignedLocker = await userLockerModel.create({
            userId: user?._id,
            lockerNumber: req?.body?.lockerNumber,
        })

        user = await userModel.findByIdAndUpdate(
            user?._id,
            {
                lockerId: assignedLocker?._id
            },
            { new: true }
        );

        await userPaymentModel.findOneAndUpdate({
            userId: user?._id,
            lockerId: null,
            paymentYear: Number(new Date().toISOString().split("T")[0].split("-")[0]),
            paymentMonth: Number(new Date().toISOString().split("T")[0].split("-")[1])
        },
            {
                $set: { lockerId: assignedLocker?._id }
            }, { new: true })

        return res.status(200).json({
            status: true, data: {
                user,
                assignedLocker
            }, message: `Locker is successfully assigned`,
            description: `${assignedLocker?.lockerNumber} is assigned to ${user?.name}`
        })

    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error", description: error?.message })
    }
}

export default assignLockerToUser