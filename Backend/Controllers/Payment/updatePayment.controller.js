import userPaymentModel from "../../Models/userPayment.model.js"

async function updateUserPayment(req, res) {
    try {
        const { paymentId } = req?.params
        const { paymentMethod, amount, paymentStartDate, paymentEndDate } = req?.body

        const payment = await userPaymentModel.findByIdAndUpdate(
            paymentId,
            {
                $set: {
                    paymentMethod,
                    amount,
                    paymentEndDate,
                    paymentStartDate
                }
            },
            { new: true }
        )

        if (!payment) {
            return res.status(400).json({
                status: false,
                message: "Invalid Payment",
                description: "This payment is not done by user"
            })
        }

        return res.status(200).json({
            status: true,
            data: { payment },
            message: "Payment is Updated",
            description: "Payment is successfully updated"
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Internal Server Error",
            description: error?.message
        })
    }
}

export default updateUserPayment