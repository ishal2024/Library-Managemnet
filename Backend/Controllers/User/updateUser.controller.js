import userModel from "../../Models/user.model.js"
import userSeatModel from "../../Models/userSeat.model.js"


async function updateUserData(req, res) {
    try {
        // const { newUserData } = req?.body
        const { userId } = req?.params

        if (Object.keys(req?.body).length == 0) {
            return res.status(400).json({ status: false, message: "Data is not provided", description: "Please provide data to update the user" })
        }

        if(req?.body?.seatType == "Random" && req?.body?.seatId){
            const deletedDoc = await userSeatModel.findOneAndDelete({_id : req?.body?.seatId?._id})
            if(deletedDoc)
                req.body.seatId = null
        }

        const updatedUser = await userModel.findOneAndUpdate(
            { _id: userId },
            {
                $set: {
                    name: req?.body?.name,
                    email: req?.body?.email,
                    contact: req?.body?.contact,
                    gender: req?.body?.gender,
                    dob: req?.body?.dob,
                    address: req?.body?.address,
                    seatType: req?.body?.seatType,
                    seatId : req?.body?.seatId
                }
            },
            { new: true }
        )

        if (!updatedUser) {
            return res.status(400).json({ status: false, message: "User not Found", description: "This user is not a member of this library" })
        }

        return res.status(200).json({
            status: true, data: { user: updatedUser },
            message: "User is created", description: "Your library new user is created"
        })


    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error", description: error?.message })
    }
}

export default updateUserData