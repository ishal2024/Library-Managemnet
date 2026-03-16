import userModel from "../../Models/user.model.js"
import userPaymentModel from "../../Models/userPayment.model.js"



async function getAdminDashboardData(req, res) {
    try {
        let data = [{ unPaidUsers: [] }]

        const thisMonthPayments = await userPaymentModel.find({
            paymentYear: Number(new Date().toISOString().split("T")[0].split("-")[0]),
            paymentMonth: Number(new Date().toISOString().split("T")[0].split("-")[1])
        })

        const totalUsers = await userModel.find({}).populate('seatId').populate('lockerId').populate('paymentId')

        let totalFixedSeats = 0
        let totalFixedLockers = 0
        let totalPaidUsers = 0

        const newUsers = totalUsers.map((user) => {
            if (user?.seatType == "Fixed")
                totalFixedSeats++
            if (user?.lockerId)
                totalFixedLockers++
            if (
                user?.paymentId?.paymentMonth == new Date().toISOString().split("T")[0].split("-")[1] &&
                user?.paymentId?.paymentYear == new Date().toISOString().split("T")[0].split("-")[0]
            )
            totalPaidUsers++
            if (
                    new Date(user?.createdAt).getMonth() === new Date().getMonth() &&
                    new Date(user?.createdAt).getFullYear() === new Date().getFullYear()
                )
                    return user

        },)

        const totalRevenue = thisMonthPayments.reduce((acc, payment) => {
            return acc + payment.amount
        }, 0)

        return res.status(200).json({
            status: true, data: {
                totalUsers : totalUsers.length,
                totalFixedLockers,
                totalFixedSeats,
                totalRevenue,
                newUsers,
                totalPaidUsers
            }, message: `Dashboard Data`,
            description: ``
        })

    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error", description: error?.message })
    }
}

export default getAdminDashboardData