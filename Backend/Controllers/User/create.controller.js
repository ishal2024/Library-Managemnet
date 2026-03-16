import userModel from "../../Models/user.model.js";
import userPaymentModel from "../../Models/userPayment.model.js";


async function addNewUser(req, res) {
    try {
        const user = await userModel.findOne({ email: req?.body?.email })
        if (user)
            return res.status(400).json({ status: false, message: "User already exist", description: "There is user alreday exist with this email id , please try different email" })

        const createdUser = await userModel.create({
            name: req?.body?.name,
            email: req?.body?.email,
            contact: req?.body?.contact,
            gender: req?.body?.gender,
            dob: req?.body?.dob,
            address: req?.body?.address,
            seatType: req?.body?.seatType,
            seatId: null,
            lockerId: null,
            paymentId: null,
        })

        if (req?.body?.paymentStatus === "Paid") {
            const createdPayment = await userPaymentModel.create({
                userId: createdUser?._id,
                paymentMethod: req?.body?.paymentMethod,
                amount: req?.body?.amount,
                paymentStartDate: new Date(req?.body?.paymentStartDate),
                paymentEndDate: new Date(req?.body?.paymentEndDate),
            })

            createdUser.paymentId = createdPayment?._id
            await createdUser.save()
        }

        return res.status(200).json({ status: true, data : createdUser
             , message: "User is created", description: "Your library new user is created" })

    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error", description: error?.message })
    }
}

export default addNewUser