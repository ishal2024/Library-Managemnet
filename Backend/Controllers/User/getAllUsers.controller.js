import userModel from "../../Models/user.model.js"


async function getAllUsers(req,res){
    try {
        const users = await userModel.find({}).populate('seatId').populate('lockerId')

        return res.status(200).json({
            status: true,
            data: {
                users,
            }, message: `List of all the users`,
            description: `List of all the users`
        })

    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error", description: error?.message })
    }
}

export default getAllUsers