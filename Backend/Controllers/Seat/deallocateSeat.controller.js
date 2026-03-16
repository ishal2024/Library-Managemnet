import userSeatModel from "../../Models/userSeat.model.js"
import userModel from "../../Models/user.model.js"



async function deAllocateUserSeat(req, res) {
    try {
        const { user , seatId } = req?.body

        if(!user?.seatId)
            return res.status(400).json({ status: false, description: "User doesn't allocated any seat ", message: "Seat not found" });
        
        if(!String(user?.seatId?._id) === String(seatId))
            return res.status(400).json({ status: false, description: "This seat is already alloted someone", message: "Invalid Seat" });
        

        const deletedSeat = await userSeatModel.findOneAndDelete({
            _id : seatId
        })

        if (!deletedSeat) {
            return res.status(400).json({ status: false, description: "Please enter correct seat number ", message: "Seat not found" });
        }

        const updatedUser = await userModel.findOneAndUpdate({ _id: user?._id }, { $set: { seatId: null } } , {new : true})

        return res.status(200).json({
            status: true, data: {
                user : updatedUser,
            }, message: `Deallocation seat completed`,
            description: `This Seat is deallocated from user`
        })


    } catch (error) {
        res.status(500).json({ status: false, message: "Internal Server Error", description: error?.message })
    }
}

export default deAllocateUserSeat