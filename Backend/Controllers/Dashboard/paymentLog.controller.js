import userPaymentModel from "../../Models/userPayment.model.js"


async function getPaymentOfSpecificDate(req, res) {
    try {
        const { date } = req?.body

        if (!date)
            return res.status(400).json({ status: false, message: "Invalid Date", description: "Specific date is not provided" })

        const payments = await userPaymentModel.find({
            paymentDate : date
           
        }).populate("userId")

        return res.status(200).json({
            status: true, data: {
                payments
            }, message: `Payments Successfully Fetched`,
            description: `All the payments done on ${date}`
        })

    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error", description: error?.message })
    }
}



export default getPaymentOfSpecificDate