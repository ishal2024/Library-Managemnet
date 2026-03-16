import userModel from "../../Models/user.model.js"
import userPaymentModel from "../../Models/userPayment.model.js"

async function deleteUserPaymnet(req, res) {
    try {
        const { paymentId } = req?.params

        const payment = await userPaymentModel.findByIdAndDelete(paymentId)

        if (!payment) {
            return res.status(400).json({ status: false, message: "Payment not Found", description: "This Payment is not done by user" })
        }

        await userModel.findOneAndUpdate(
            { "paymentId": paymentId },
            {
                $set: {
                    paymentId: null
                }
            }
        )

        return res.status(200).json({
            status: true, data: { payment },
            message: "User is created", description: "Your library new user is created"
        })

    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error", description: error?.message })
    }
}

export default deleteUserPaymnet