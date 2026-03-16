import userModel from "../../Models/user.model.js"
import userPaymentModel from "../../Models/userPayment.model.js"

async function getAllUsersWithPaymentStatus(req, res) {
    try {
        let data = []
        const date = req?.body?.date
        const users = await userModel.find({ createdAt: { $lte: new Date(date).setHours(23, 59, 59, 999) } })

        const payments = await userPaymentModel.find({
            'paymentMonth' : Number(new Date(date).toISOString().split("T")[0].split("-")[1]),
            'paymentYear' : Number(new Date(date).toISOString().split("T")[0].split("-")[0])
        })

        users.map((user) => {
            const paymentExist = payments.find((payment) => payment?.userId.equals(user?._id))
            if (paymentExist) {
                data.push({
                    userDetail: user,
                    paymentDetail: paymentExist,
                    status: "Paid"
                })
            }
            else {
                data.push({
                    userDetail: user,
                    status: "Unpaid"
                })
            }
        })

        return res.status(200).json({
            status: true, data: data, message: `All Payments`,
            description: `I fetched all payments`
        })

    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error", description: error?.message })
    }
}

export default getAllUsersWithPaymentStatus