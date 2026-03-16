import userModel from "../../Models/user.model.js"
import userPaymentModel from "../../Models/userPayment.model.js"


async function createPayment(req, res) {
    try {
        const user = req?.body?.user

        if (!user)
            return res.status(400).json({ status: false, message: "Invalid User", description: "This user is not a member of your library" })

        const createdPayment = await userPaymentModel.create({
            userId: user?._id,
            paymentMethod: req?.body?.paymentMethod,
            amount: req?.body?.amount,
            lockerId : user?.lockerId,
            seatId : user?.seatId,
            paymentStartDate: req?.body?.paymentStartDate,
            paymentEndDate: req?.body?.paymentEndDate,
        })

        await userModel.findOneAndUpdate(
            { _id: user._id },
            { $set: { paymentId: createdPayment?._id } },
            { new: true }
        );

        return res.status(200).json({
            status: true, data: {
                user,
                createdPayment
            }, message: `Payment status is updated`,
            description: `${user?.name} payment status is updated successfully`
        })

    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error", description: error?.message })
    }
}

export default createPayment